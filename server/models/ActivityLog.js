const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);

