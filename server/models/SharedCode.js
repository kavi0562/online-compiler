const mongoose = require("mongoose");
// nanoid removed to fix crash (using custom generation in route instead)

const sharedCodeSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    sourceCode: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: "javascript"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30 // Optional: Auto-delete after 30 days
    }
});

module.exports = mongoose.model("SharedCode", sharedCodeSchema);
