const express = require("express");
const router = express.Router();
const SharedCode = require("../models/SharedCode");

// Use simple random string generator since nanoid might be ESM only in newer versions
const generateShortId = () => {
    return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 6);
};

// POST /api/share - Save code
router.post("/", async (req, res) => {
    try {
        const { sourceCode, language } = req.body;

        if (!sourceCode) {
            return res.status(400).json({ message: "Code content is required" });
        }

        const shortId = generateShortId();

        const newShare = await SharedCode.create({
            shortId,
            sourceCode,
            language: language || "javascript"
        });

        res.status(201).json({
            success: true,
            shortId: newShare.shortId,
            url: `/s/${newShare.shortId}` // Frontend URL pattern
        });

    } catch (err) {
        console.error("SHARE_ERROR:", err);
        res.status(500).json({ message: "Failed to generate share link" });
    }
});

// GET /api/share/:id - Retrieve code
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const sharedCode = await SharedCode.findOne({ shortId: id });

        if (!sharedCode) {
            return res.status(404).json({ message: "Shared code not found or expired" });
        }

        res.json(sharedCode);

    } catch (err) {
        console.error("GET_SHARE_ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
