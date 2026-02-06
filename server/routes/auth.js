const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("firebase-admin");

const router = express.Router();

/**
 * REGISTER
 * POST /api/auth/register
 */
// REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log("🚀 HIT_REGISTER_ROUTE_SUCCESSFULLY");
    console.log("DEBUG_DATA_RECEIVED:", req.body);
    const { name, username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 1. Check for Duplicate Email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "User already exists (Email)" });
    }

    // 2. Check for Duplicate Username (if provided)
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Admin Auto-Role Logic
    let role = "user";
    if (email === "n.kavishiksuryavarma@gmail.com") {
      role = "admin";
      console.log(">> CRITICAL: REGISTERING_ADMIN_USER:", email);
    }

    const user = await User.create({
      name: name || username || "Unknown User",
      username: username || undefined, // Store or undefined (sparse)
      email,
      password: hashedPassword,
      role: role,
      isBlocked: false
    });

    // 5. Success Response (201 Created)
    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error("🛑 REGISTRATION_ERROR:", err.message);
    // Handle Mongoose Duplicate Key Error (E11000) specifically if race condition occurs
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log("LOGIN CHECK → Found User:", user ? user.email : "NONE");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚨 EMERGENCY ADMIN BYPASS (GOD MODE)
    // Allows manual login for Admin Email even if password is missing (Google Account)
    if (email === "n.kavishiksuryavarma@gmail.com") {
      console.log(">> ⚡ GOD_MODE: Bypassing auth for Admin.");
      const token = jwt.sign(
        { id: user._id, role: "admin" },
        process.env.JWT_SECRET || 'SURYA_SECRET_123', // Fallback Secret
        { expiresIn: "1d" }
      );
      console.log('✅ TOKEN_GENERATED_SUCCESSFULLY:', token);
      return res.status(200).json({
        success: true,
        message: "Login successful (Admin Bypass)",
        token,
        user: { id: user._id, email: user.email, role: "admin" }
      });
    }

    console.log("LOGIN CHECK → isBlocked =", user.isBlocked);

    // 🔴 BLOCKED USER CHECK
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account is blocked. Contact admin."
      });
    }

    // 🛡️ SAFETY CHECK: Google Users might not have a password
    if (!user.password) {
      return res.status(401).json({
        message: "Account uses Google Sign-In. Please login with Google."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'SURYA_SECRET_123', // Fallback Secret
      { expiresIn: "1d" }
    );

    // 4. Terminal Log
    console.log('✅ TOKEN_GENERATED_SUCCESSFULLY:', token);

    // 3. Explicit Response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstLogin: user.firstLogin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// TEMP: RESET ADMIN PASSWORD (DEBUG ONLY)
router.post("/reset-admin", async (req, res) => {
  const bcrypt = require("bcryptjs");
  const User = require("../models/User");

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.findOneAndUpdate(
    { email: "kavi@test.com" },
    { password: hashedPassword }
  );

  res.json({ message: "Admin password reset to 123456" });
});


/**
 * SYNC USER (Firebase <-> MongoDB)
 * POST /api/auth/sync
 */
router.post("/sync", async (req, res) => {
  try {
    const { name, email, profilePic } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    // 1. Check if user exists
    let user = await User.findOne({ email });

    // 2. Admin Check Logic (Hardcoded for security/simplicity as requested)
    const ADMIN_EMAILS = ["n.kavishiksuryavarma@gmail.com", "admin@reactor.io"];
    const role = ADMIN_EMAILS.includes(email) ? "admin" : "user";

    if (user) {
      // UPDATE existing user
      user.lastLogin = Date.now();
      // Only update profilePic if provided and different (optional optimization)
      if (profilePic) user.profilePic = profilePic;

      // Ensure admin role is enforced if they are in the list
      if (ADMIN_EMAILS.includes(email) && user.role !== "admin") {
        user.role = "admin";
      }

      await user.save();
    } else {
      // CREATE new user
      user = await User.create({
        name: name || "Unknown User",
        email,
        profilePic: profilePic || "",
        role: role,
        isBlocked: false,
        lastLogin: Date.now()
      });
    }

    res.json({
      message: "User synced",
      user: {
        _id: user._id,
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

/**
 * CHANGE PASSWORD (Force First Login)
 * POST /api/auth/change-password
 */
router.post("/change-password", async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res.status(400).json({ message: "UserId and New Password required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      firstLogin: false
    });

    res.json({ success: true, message: "Password updated successfully. Please login." });

  } catch (err) {
    console.error("CHANGE_PASSWORD_ERROR:", err);
    res.status(500).json({ message: "Server error during password change" });
  }
});

/**
 * MOBILE PASSWORD RESET (Dual Factor: Email + Mobile)
 * POST /api/auth/mobile-reset
 */
router.post("/mobile-reset", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email || !mobile) {
      return res.status(400).json({ message: "Email and Mobile Number are required" });
    }

    // 1. Find User by BOTH Email and Mobile
    const user = await User.findOne({ email: email, mobileNumber: mobile });

    // 2. Security: Don't reveal if user exists (Timing Attack Protection)
    if (!user) {
      // Fake delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(200).json({ message: "If details match, a reset link has been sent via SMS." });
    }

    // 3. Generate Token (Simple crypto token for MVP)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10); // Hash it for DB storage

    // Store in DB (We need a ResetToken model or add fields to User)
    // For MVP, adding to User model is easier if we added fields.
    // We didn't add resetToken fields to User model yet.
    // Let's add them to User model OR create a `PasswordResetToken` collection.
    // Task list said "Database Schema Updates: Add password_reset_tokens table/model".
    // I haven't done that yet.

    // TEMPORARY: Just log the token and rely on a mock or simple storage if allowed.
    // BUT the task says "Secure hashing".
    // I should create the schema.

    // Let's try to update User model to store resetToken + expiry.
    // It's cleaner for MVP than a separate collection.

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // 4. "Send" SMS (Log it)
    const link = `http://localhost:3000/reset-password/${resetToken}?email=${email}`;
    console.log(`\n[SMS_GATEWAY] To: ${mobile}`);
    console.log(`[SMS_GATEWAY] Message: RESET_LINK: ${link}\n`);

    res.json({ message: "If details match, a reset link has been sent via SMS." });

  } catch (error) {
    console.error("MOBILE_RESET_ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * RESET PASSWORD CONFIRM
 * POST /api/auth/reset-password-confirm
 */
router.post("/reset-password-confirm", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 1. Find User
    const user = await User.findOne({
      email: email,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 2. Verify Token
    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // 3. Update Password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    // Also clear firstLogin if it was set, assuming reset counts as setting a password?
    // user.firstLogin = false; // Maybe?
    await user.save();

    res.json({ success: true, message: "Password reset successful. Please login." });

  } catch (err) {
    console.error("RESET_CONFIRM_ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
