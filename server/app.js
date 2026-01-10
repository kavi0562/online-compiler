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

// 🔥 FIREBASE ADMIN SETUP
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("🔥 Firebase Admin Initialized with Service Account");
  }
} catch (error) {
  console.error("❌ Firebase Admin Init Failed:", error.message);
}

// 🔎 DEBUG ENV
console.log("MONGO_URI =", process.env.MONGO_URI);

const app = express();

// 🚨 EMERGENCY BYPASS: Test Route
app.get('/test', (req, res) => {
  console.log('🔔 TEST_HIT_SUCCESS');
  res.send('Server is Talking!');
});

/* =======================
   MIDDLEWARES
======================= */
// 0. GLOBAL LOGGER (LOUD)
app.use((req, res, next) => {
  console.log("🔔 INCOMING_REQUEST:", req.method, req.url);
  next();
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// MIDDLEWARE ORDER: Body Parsers FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
   CRITICAL ROUTES (INLINED OR IMPORTED)
======================= */

// 1. HEALTH CHECK
app.get("/api/status", (req, res) => {
  res.json({ status: "ONLINE", database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED" });
});

// 2. IMPORT ROUTES
// We use the existing files but ensure they are mounted correctly
// We need to double check that specific routes requested exist in them.

// Route for /api/users/sync is likely in ./routes/users.js
app.use("/api/users", require("./routes/users"));

// Route for /api/admin/users is in ./routes/admin.js
app.use("/api/admin", require("./routes/admin"));

// Route for /api/auth/register is in ./routes/auth.js
app.use("/api/auth", require("./routes/auth"));

// 3. COMPILER MOCK ROUTE
app.post("/api/compiler/execute", (req, res) => {
  const { code, language } = req.body;
  console.log(">> EXECUTING_CODE:", language);
  // Mock execution result
  setTimeout(() => {
    res.json({
      output: `> EXECUTION_SUCCESSFUL [${language}]\n> Output:\nHello World from Reactor IO!\n> [Process exited with code 0]`,
      isError: false
    });
  }, 1000);
});


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

// 🚨 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('🔥 GLOBAL_CRASH:', err.stack);
  res.status(500).send('Something broke!');
});

/* =======================
   SERVER START
======================= */
// GLOBAL CONFIG: Port 5051
const PORT = 5051;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
