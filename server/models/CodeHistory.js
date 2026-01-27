const mongoose = require("mongoose");

const codeHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    output: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 86400 // TTL Index: Documents expire 24 hours after creation
    }
});

module.exports = mongoose.model("CodeHistory", codeHistorySchema);
