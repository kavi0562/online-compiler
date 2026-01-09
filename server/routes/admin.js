const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ActivityLog = require("../models/ActivityLog");

const router = express.Router();

/**
 * GET ALL USERS (ADMIN)
 * GET /api/admin/users
 */
router.get("/users", auth, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * BLOCK / UNBLOCK USER
 * PUT /api/admin/block/:id
 */
router.put("/block/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    // 🔐 ACTIVITY LOG
    await ActivityLog.create({
      adminId: req.user.id,
      action: user.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
      targetUserId: user._id
    });

    res.json({
      message: user.isBlocked ? "User blocked ❌" : "User unblocked ✅"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE USER
 * DELETE /api/admin/user/:id
 */
router.delete("/user/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 ACTIVITY LOG
    await ActivityLog.create({
      adminId: req.user.id,
      action: "DELETE_USER",
      targetUserId: user._id
    });

    res.json({ message: "User deleted successfully 🗑️" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN STATS
 * GET /api/admin/stats
 */
router.get("/stats", auth, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true });
    const activeUsers = await User.countDocuments({ isBlocked: false });

    res.json({
      totalUsers,
      blockedUsers,
      activeUsers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * ADMIN ACTIVITY LOGS (OPTIONAL BUT RECOMMENDED)
 * GET /api/admin/logs
 */
router.get("/logs", auth, admin, async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("adminId", "name email")
      .populate("targetUserId", "email")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
