const express = require("express");
const CodeHistory = require("../models/CodeHistory");
const auth = require("../middleware/auth");
const router = express.Router();

/**
 * GET USER HISTORY
 * GET /api/history
 */
router.get("/", auth, async (req, res) => {
    try {
        const history = await CodeHistory.find({ userId: req.user.id })
            .sort({ timestamp: -1 })
            .limit(50); // Limit to last 50 entries
        res.json(history);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/**
 * DELETE HISTORY ENTRY
 * DELETE /api/history/:id
 */
router.delete("/:id", auth, async (req, res) => {
    try {
        const history = await CodeHistory.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!history) {
            return res.status(404).json({ message: "History not found" });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
