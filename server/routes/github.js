const router = require("express").Router();
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

router.post("/push", verifyToken, async (req, res) => {
    try {
        console.log("🔔 GITHUB_PUSH_REQUEST_RECEIVED");

        // 1. BASIC SAFETY CHECKS (Before anything else)
        if (!req.user) {
            console.error("❌ CRITICAL: req.user is MISSING after verifyToken");
            return res.status(500).json({ error: "Authentication Middleware Failed (req.user missing)" });
        }

        const { repo, message, code, filename, githubToken } = req.body;

        // SUBSCRIPTION GATING & METERING
        const plan = req.user.subscriptionPlan || 'free';

        if (plan === 'free') {
            // ROBUST USER LOOKUP (Handles Firebase UID vs Mongo ID)
            let user;
            try {
                // console.log(">> LOOKING_UP_USER:", { id: req.user.id, provider: req.user.provider });
                if (req.user.provider === 'firebase') {
                    // console.log(">> STRATEGY: Find by firebaseUid");
                    user = await User.findOne({ firebaseUid: req.user.id });
                } else {
                    // console.log(">> STRATEGY: Find by _id (Mongo)");
                    user = await User.findById(req.user.id);
                }
            } catch (dbErr) {
                console.error("❌ USER_LOOKUP_CRASH:", dbErr);
                return res.status(500).json({ error: "Database error during user lookup.", details: dbErr.message });
            }

            // Fail gracefully if user still not found (shouldn't happen if sync worked)
            if (!user) {
                console.error("❌ USER_NOT_FOUND_IN_DB (Sync Issue?)");
                return res.status(404).json({ error: "User record not found. Please refresh page." });
            }
            if (user.githubSyncUsage >= 3 && req.user.role !== 'admin') {
                console.error("❌ TRIAL_LIMIT_REACHED");
                return res.status(403).json({ error: `Trial Limit Reached (3/3). Please Upgrade to PRO for unlimited sync.` });
            }
            if (req.user.role !== 'admin') {
                req.shouldIncrementUsage = true;
            } else {
                req.shouldIncrementUsage = false;
            }
        } else {
            req.shouldIncrementUsage = false;
        }

        console.log("PAYLOAD:", { repo, filename, hasToken: !!githubToken });

        if (!githubToken) {
            console.error("❌ ERROR: NO_GITHUB_TOKEN");
            // Check if user has one stored in DB? No, frontend sends it.
            return res.status(401).json({ error: "No GitHub token provided. Please Login." });
        }

        if (!repo || !code || !filename) {
            console.error("❌ ERROR: MISSING_FIELDS");
            return res.status(400).json({ error: "Missing required fields (repo, code, or filename)." });
        }

        console.log("🔄 IMPORTING OCTOKIT...");
        const { Octokit } = await import("octokit");
        const octokit = new Octokit({ auth: githubToken });

        const [owner, repoName] = repo.split("/");
        if (!owner || !repoName) {
            console.error("❌ ERROR: INVALID_REPO_FORMAT", repo);
            return res.status(400).json({ error: "Invalid repository format. Use owner/repo" });
        }

        console.log(`🔍 CHECKING FILE: ${owner}/${repoName}/${filename}`);

        // 1. Get the current commit SHA of the file (if it exists)
        let sha;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner,
                repo: repoName,
                path: filename,
            });
            sha = data.sha;
            console.log("✅ FILE EXISTS. SHA:", sha);
        } catch (err) {
            // File doesn't exist yet, that's fine (create mode)
            if (err.status === 404) {
                console.log("✨ FILE NEW (Create Mode)");
            } else {
                console.error("❌ ERROR CHECKING FILE:", err.message);
                throw err;
            }
        }

        // 2. Create or Update the file
        console.log("🚀 PUSHING TO GITHUB...");
        const { data: updateData } = await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo: repoName,
            path: filename,
            message: message || "Update code via Reactor.io",
            content: Buffer.from(code).toString("base64"),
            sha, // Include SHA if updating
        });

        console.log("✅ PUSH SUCCESS:", updateData.commit.sha);

        if (req.shouldIncrementUsage) {
            await User.findByIdAndUpdate(req.user.id, { $inc: { githubSyncUsage: 1 } });
            console.log("📊 USAGE INCREMENTED FOR FREE USER");
        }

        res.json({ success: true, commit: updateData.commit });

    } catch (criticalErr) {
        console.error("🔥 CRITICAL_ROUTE_CRASH:", criticalErr);
        // Respond with JSON so frontend sees the reason instead of "Something broke!"
        res.status(500).json({
            error: "CRITICAL SERVER CRASH",
            message: criticalErr.message,
            stack: criticalErr.stack
        });
    }
});

// CLI-BASED AUTO-PUSH (Requirement: Use git CLI, child_process)
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const util = require("util");
const execPromise = util.promisify(exec);

router.post("/auto-push-cli", verifyToken, async (req, res) => {
    let tempDir = null;
    try {
        console.log("🔔 AUTO_PUSH_CLI_REQUEST");

        // 1. Validation
        if (!req.user) return res.status(500).json({ error: "Auth Error" });
        const { repo, code, filename, githubToken } = req.body;

        if (!githubToken) return res.status(401).json({ error: "No GitHub Token" });
        if (!repo || !code || !filename) return res.status(400).json({ error: "Missing Fields" });

        // 2. Subscription Limit Check
        const user = req.user.provider === 'firebase'
            ? await User.findOne({ firebaseUid: req.user.id })
            : await User.findById(req.user.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Admin bypass
        const isAdmin = user.role === 'admin';
        if (!isAdmin && user.subscriptionPlan === 'free' && user.githubSyncUsage >= 3) {
            return res.status(403).json({ error: "Daily Limit Reached (3/3)" });
        }

        // 3. Setup Temp Directory
        const uniqueId = `repo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        tempDir = path.join(os.tmpdir(), uniqueId);
        fs.mkdirSync(tempDir);

        console.log(`📂 TEMP_DIR_CREATED: ${tempDir}`);

        // 4. Git Operations
        const [owner, repoName] = repo.split("/");
        const authRepoUrl = `https://${githubToken}@github.com/${owner}/${repoName}.git`;
        const sanitizedUrl = `https://***@github.com/${owner}/${repoName}.git`; // For logs

        // Helper to run commands in tempDir
        const runGit = async (command) => {
            try {
                // console.log(`👉 EXEC: ${command}`); // Debug only, careful with tokens
                const { stdout, stderr } = await execPromise(command, { cwd: tempDir });
                return { stdout, stderr };
            } catch (e) {
                // Redact token from error message
                e.message = e.message.replace(githubToken, "***");
                throw e;
            }
        };

        // A. Clone (Depth 1 for speed)
        console.log("🔄 CLONING...");
        await runGit(`git clone --depth 1 ${authRepoUrl} .`);

        // B. Write File
        const filePath = path.join(tempDir, filename);
        // Ensure directory exists if filename has path
        const fileDir = path.dirname(filePath);
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

        fs.writeFileSync(filePath, code);
        console.log(`📝 FILE_WRITTEN: ${filename}`);

        // C. Config User (Required for commit)
        // Try to get user email/name from DB or use defaults
        const committerName = user.name || user.username || "Reactor User";
        const committerEmail = user.email || "bot@reactor.io";
        await runGit(`git config user.name "${committerName}"`);
        await runGit(`git config user.email "${committerEmail}"`);

        // D. Add & Commit
        await runGit("git add .");
        try {
            await runGit(`git commit -m "Auto-execution update: ${new Date().toISOString()}"`);
        } catch (e) {
            if (e.message.includes("nothing to commit")) {
                console.log("⚠️ NOTHING_TO_COMMIT (File unchanged)");
                return res.json({ success: true, message: "No changes to push" });
            }
            throw e;
        }

        // E. Push
        console.log("🚀 PUSHING...");
        await runGit("git push origin HEAD:main"); // Basic push to main

        // 5. Usage Increment
        if (!isAdmin && user.subscriptionPlan === 'free') {
            await User.findByIdAndUpdate(user._id, { $inc: { githubSyncUsage: 1 } });
            console.log("📊 USAGE_INCREMENTED");
        }

        res.json({ success: true, message: "Auto-pushed successfully" });

    } catch (err) {
        console.error("🔥 AUTO_PUSH_ERROR:", err.message);
        res.status(500).json({ error: "Git CLI Sync Failed", details: err.message });
    } finally {
        // 6. Cleanup
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
            console.log("🧹 TEMP_DIR_CLEANED");
        }
    }
});

module.exports = router;
