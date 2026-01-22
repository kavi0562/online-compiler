const express = require("express");
const router = express.Router();
const User = require("../models/User");

// DELETE USER BY EMAIL (FOR TESTING ONLY)
router.delete("/user/:email", async (req, res) => {
    try {
        const email = req.params.email;
        const result = await User.findOneAndDelete({ email });

        if (!result) {
            return res.status(404).json({ message: "User not found for deletion" });
        }

        res.json({ message: `Test user ${email} deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
