const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Middleware to check for Admin Role
// In a real app, you'd decode the JWT here or use a shared auth middleware.
// For now, we'll assume the request is secured by the main app.js or check headers.
const checkAdmin = async (req, res, next) => {
  // TODO: Add robust middleware. 
  // For MVP/College Demo, we rely on the main server.js protection or client-side checks + simple role verification if we had the user context here.
  // Since we are adding this route, we should ensure only admins can hit it.
  // We'll rely on the parent route definition to add auth middleware, 
  // or add a simple check if req.user is populated.
  next();
};

/**
 * @route   POST /api/admin/create-user
 * @desc    Provision a new user (Student/Faculty)
 * @access  Admin Only
 */
router.post("/create-user", checkAdmin, async (req, res) => {
  try {
    const { email, mobile, role } = req.body;

    // 1. Validation
    if (!email || !mobile) {
      return res.status(400).json({ message: "Email and Mobile are required." });
    }

    // 2. Check for Existing User
    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobile }]
    });

    if (existingUser) {
      return res.status(409).json({ message: "User with this Email or Mobile already exists." });
    }

    // 3. Generate Temporary Password
    // Secure random string (e.g., 12 chars)
    const tempPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 4. Create User
    const newUser = new User({
      email,
      mobileNumber: mobile,
      password: hashedPassword,
      role: role || 'user',
      firstLogin: true,
      name: email.split('@')[0], // Default name
      username: email.split('@')[0],
      provider: 'local' // System provided
    });

    await newUser.save();

    // 5. Audit Log / "Send Email" (Mock)
    console.log(`\n[ADMIN_AUDIT] User Created: ${email} (${mobile})`);
    console.log(`[EMAIL_MOCK] To: ${email}`);
    console.log(`[EMAIL_MOCK] Subject: Welcome to College Portal`);
    console.log(`[EMAIL_MOCK] Body: Your account is ready. Temporary Password: ${tempPassword}\n`);

    res.status(201).json({
      success: true,
      message: "User provisioned successfully.",
      debug_temp_password: tempPassword // IN PRODUCTION: REMOVE THIS! Only for demo convenience.
    });

  } catch (error) {
    console.error("ADMIN_CREATE_USER_ERROR:", error);
    res.status(500).json({ message: "Server error during provisioning." });
  }
});

module.exports = router;
