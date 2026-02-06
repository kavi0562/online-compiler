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

app.get('/test-refresh', (req, res) => {
  res.send('REFRESH_CONFIRMED_V2');
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allow Google Auth Popup
  crossOriginResourcePolicy: false, // COMPLETELY DISABLE for Piston/External Resources
  contentSecurityPolicy: false // Disable CSP for now if it conflicts
}));

/* =======================
   RATE LIMITING
======================= */
const globalLimiter = rateLimit({
  windowMs: 1000,
  max: 50   // 🔥 important
});

app.use("/api/auth", globalLimiter);


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

app.use("/api/ai", require("./routes/ai"));

// 3. COMPILER ROUTE (Real Implementation)
// This fixes the 404 for /languages and /execute (via /run)
// Note: Frontend calls /api/compiler/languages and /api/compiler/execute (which we need to map to /run in the router or update frontend)
// Looking at UserDashboard.js: axios.get("http://localhost:5051/api/compiler/languages")
// AND axios.post("http://localhost:5051/api/compiler/execute")
// But compiler.js has router.post("/run") ... we should align them.
// For now, let's mount it at /api/compiler and I will update compiler.js to handle "execute" or I will aliasing it here?
// Better: Mount it, and inside compiler.js ensure paths match.
app.use("/api/compiler", require("./routes/compiler"));
app.use("/api/github", require("./routes/github"));
// app.use("/api/payment", require("./routes/payment"));
app.use("/api/admin", require("./routes/admin")); // Mount Admin Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/test", require("./routes/test"));
app.use("/api/share", require("./routes/share"));


/* =======================
   DATABASE CONNECTION
======================= */
mongoose
  .connect(process.env.MONGO_URI, {
    family: 4 // Force IPv4 to fix "querySrv ECONNREFUSED" on some networks
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// 🚨 GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('🔥 GLOBAL_CRASH:', err.stack); // Log full stack internally

  // Generic safe response to user
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred. Administrators have been notified."
  });
});

/* =======================
   SERVER START
======================= */
// GLOBAL CONFIG: Port 5051
const PORT = process.env.PORT || 5051;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔥 CRITICAL FIX FOR NODE DISCONNECTED
server.setTimeout(0);
server.keepAliveTimeout = 0;
server.headersTimeout = 0;

