const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

/**
 * REGISTER
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    // 2. Auth Logic Entry (LOUD)
    console.log("🚀 HIT_REGISTER_ROUTE_SUCCESSFULLY");
    console.log("DEBUG_DATA_RECEIVED:", req.body);
    const { name, username, email, password } = req.body;

    // RELAXED VALIDATION: Only Require Email/Pass
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Admin Auto-Role Logic
    let role = "user";
    if (email === "n.kavishiksuryavarma@gmail.com") {
      role = "admin";
      console.log(">> CRITICAL: REGISTERING_ADMIN_USER:", email);
    }

    const user = await User.create({
      name: name || username || "Unknown User",
      email,
      password: hashedPassword,
      role: role,
      isBlocked: false
    });

    res.status(201).json({
      message: "Registration Successful",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    // 3. Error Identification (LOUD)
    console.error("🛑 DATABASE_OR_LOGIC_CRASH:", err.message);
    console.error('🔥 FULL_STACK:', err.stack);
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
        role: user.role
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

module.exports = router;
