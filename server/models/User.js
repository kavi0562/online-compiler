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
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

