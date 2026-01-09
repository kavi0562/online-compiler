// 🔥 CONFIRM CORRECT SERVER
console.log("🔥 CORRECT SERVER app.js RUNNING");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

// 🔑 LOAD ENV (ABSOLUTE PATH – NO CONFUSION)
require("dotenv").config({
  path: __dirname + "/.env"
});

// 🔎 DEBUG ENV (TEMP – REMOVE LATER)
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(helmet());

/* =======================
   RATE LIMITING
======================= */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    message: "Too many requests. Please try again later."
  }
});
app.use(globalLimiter);

/* =======================
   TEST ROUTE
======================= */
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

/* =======================
   ROUTES
======================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/compiler", require("./routes/compiler"));
app.use("/api/protected", require("./routes/protected"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/history", require("./routes/history"));

/* =======================
   DATABASE CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

/* =======================
   SERVER START
======================= */
const PORT = 5051; // Changed to 5051 to avoid conflicts
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
