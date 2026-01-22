const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true // Allows null/undefined to not conflict
  },
  firebaseUid: {
    type: String,
    required: false, // Changed to allow manual collection registration
    unique: true,
    sparse: true // Allows multiple null/undefined values
  },
  provider: {
    type: String,
    default: "password"
  },
  password: {
    type: String,
    required: false // Changed to false for social logins
  },
  profilePic: {
    type: String,
    default: ""
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  subscriptionPlan: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free"
  },
  subscriptionStatus: {
    type: String,
    enum: ["active", "inactive", "cancelled"],
    default: "active"
  },
  githubSyncUsage: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

