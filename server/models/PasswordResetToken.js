const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true // Ensure tokens are unique
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // TTL Index: MongoDB automatically removes documents after this time
    },
    used: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
