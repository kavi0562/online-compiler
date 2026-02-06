const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

/**
 * SYNC USER (Firebase <-> MongoDB)
 * POST /api/users/sync
 */
router.post("/sync", async (req, res) => {
    try {
        const { uid, name, email, photoURL, provider, githubAccessToken } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: "UID and Email required" });
        }

        // 2. Admin Check Logic (Case Insensitive)
        const ADMIN_EMAILS = ["n.kavishiksuryavarma@gmail.com", "admin@reactor.io"];
        const normalize = (s) => (s || "").toLowerCase();

        const isAdminEmail = ADMIN_EMAILS.some(adminEmail => normalize(adminEmail) === normalize(email));

        // 3. Find User by EMAIL first (Merge Strategy)
        // This prevents duplicate key errors if a manual user already exists with this email
        let user = await User.findOne({ email });

        if (user) {
            // MERGE: Update existing user with Firebase UID
            console.log(">> MERGING_ACCOUNT: Found existing user by email:", email);
            user.firebaseUid = uid;
            user.name = name || user.name;
            user.profilePic = photoURL || user.profilePic;
            user.provider = provider || user.provider;
            user.lastLogin = Date.now();

            if (isAdminEmail) {
                user.role = 'admin'; // Enforce Admin on merge
            }

            // AUTO-UPGRADE ALL USERS TO PRO (REMOVE PRICING)
            if (user.subscriptionPlan === 'free') {
                user.subscriptionPlan = 'pro';
            }

            if (req.body.githubAccessToken) {
                user.githubAccessToken = req.body.githubAccessToken;
            }
            if (req.body.mobileNumber) {
                user.mobileNumber = req.body.mobileNumber;
            }
            await user.save();
        } else {
            // CREATE: New User
            console.log(">> CREATING_NEW_USER:", email);
            user = await User.create({
                firebaseUid: uid,
                name: name || "Unknown User",
                email: email,
                profilePic: photoURL || "",
                provider: provider || "password",
                role: isAdminEmail ? 'admin' : 'user',
                lastLogin: Date.now(),
                isBlocked: false,
                githubAccessToken: req.body.githubAccessToken || undefined,
                mobileNumber: req.body.mobileNumber || undefined
            });
        }

        console.log("DATABASE_SAVE_SUCCESS:", user.email, "| Role:", user.role);

        // Generate Backend Token for API Access
        const token = jwt.sign(
            { id: user._id, role: user.role, subscriptionPlan: user.subscriptionPlan, githubSyncUsage: user.githubSyncUsage },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Fetch user with githubAccessToken (select: false bypass)
        const userWithSecrets = await User.findById(user._id).select('+githubAccessToken');

        res.json({
            message: "User synced successfully",
            token, // Send token to frontend
            user: {
                _id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic,
                subscriptionPlan: user.subscriptionPlan,
                subscriptionStatus: user.subscriptionStatus,
                githubSyncUsage: user.githubSyncUsage,
                githubAccessToken: userWithSecrets.githubAccessToken // Return persistent token
            }
        });

    } catch (err) {
        console.error("SYNC_ERROR:", err);
        res.status(500).json({ message: "Server error during sync" });
    }
});

module.exports = router;
