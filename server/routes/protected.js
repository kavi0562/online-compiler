const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

/**
 * USER PROTECTED ROUTE
 * GET /api/protected/user
 */
router.get("/user", auth, (req, res) => {
  res.json({
    message: "User dashboard access granted ✅",
    user: req.user
  });
});

/**
 * ADMIN PROTECTED ROUTE
 * GET /api/protected/admin
 */
router.get("/admin", auth, admin, (req, res) => {
  res.json({
    message: "Admin dashboard access granted 👑"
  });
});

module.exports = router;

