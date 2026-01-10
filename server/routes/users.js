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
        const { uid, name, email, photoURL, provider } = req.body;

        if (!uid || !email) {
            return res.status(400).json({ message: "UID and Email required" });
        }

        // 2. Admin Check Logic
        const ADMIN_EMAILS = ["n.kavishiksuryavarma@gmail.com", "admin@reactor.io"];
        const isAdminEmail = ADMIN_EMAILS.includes(email);

        // Determine Role (Default 'user', unless explicitly 'admin' via list or existing role)
        let role = "user";
        if (isAdminEmail) role = "admin";

        // 3. Atomic Upsert (FindOneAndUpdate)
        // 3. Atomic Upsert (FindOneAndUpdate)
        // Construct update object dynamically to avoid reusing keys in $set and $setOnInsert
        const updateData = {
            $set: {
                name: name || "Unknown User",
                email: email,
                profilePic: photoURL || "",
                provider: provider || "password",
                lastLogin: Date.now()
            },
            $setOnInsert: {
                // Default role for NEW users (if not admin override)
                // isBlocked: false
                isBlocked: false
            }
        };

        if (isAdminEmail) {
            // Force admin in $set (updates existing AND new)
            // Make sure we DO NOT put 'role' in $setOnInsert
            updateData.$set.role = "admin";
        } else {
            // If not admin, we only set 'user' on INSERT. 
            // Existing users keep their current role.
            updateData.$setOnInsert.role = "user";
        }

        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            updateData,
            { new: true, upsert: true } // Return new doc, create if not exists
        );

        console.log("DATABASE_SAVE_SUCCESS:", user);

        // Generate Backend Token for API Access
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.json({
            message: "User synced successfully",
            token, // Send token to frontend
            user: {
                _id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePic: user.profilePic
            }
        });

    } catch (err) {
        console.error("SYNC_ERROR:", err);
        res.status(500).json({ message: "Server error during sync" });
    }
});

module.exports = router;
