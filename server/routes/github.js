const router = require("express").Router();

const verifyToken = require("../middleware/auth");

router.post("/push", verifyToken, async (req, res) => {
    console.log("🔔 GITHUB_PUSH_REQUEST_RECEIVED");
    const { repo, message, code, filename, githubToken } = req.body;

    // SUBSCRIPTION GATING
    // SUBSCRIPTION GATING & METERING
    const plan = req.user.subscriptionPlan || 'free';
    const User = require("../models/User");

    if (plan === 'free') {
        // Fetch fresh user data to get accurate usage
        const user = await User.findById(req.user.id);
        if (user.githubSyncUsage >= 3) {
            console.error("❌ TRIAL_LIMIT_REACHED");
            return res.status(403).json({ error: `Trial Limit Reached (3/3). Please Upgrade to PRO for unlimited sync.` });
        }
        req.shouldIncrementUsage = true;
    } else {
        req.shouldIncrementUsage = false;
    }

    console.log("PAYLOAD:", { repo, filename, hasToken: !!githubToken });

    if (!githubToken) {
        console.error("❌ ERROR: NO_GITHUB_TOKEN");
        return res.status(401).json({ error: "No GitHub token provided. Please Login." });
    }

    if (!repo || !code || !filename) {
        console.error("❌ ERROR: MISSING_FIELDS");
        return res.status(400).json({ error: "Missing required fields (repo, code, or filename)." });
    }

    try {
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

    } catch (err) {
        console.error("🔥 GITHUB PUSH EXCEPTION:", err);
        // Better error message for user
        const status = err.status || 500;
        const msg = err.response?.data?.message || err.message || "Failed to push to GitHub";
        res.status(status).json({ error: msg, details: err.response?.data });
    }
});

module.exports = router;
