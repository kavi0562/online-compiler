const express = require("express");
const jwt = require("jsonwebtoken");
const CodeHistory = require("../models/CodeHistory");
const { executeDocker } = require("../utils/dockerExecutor");
const { logEvent, isBlocked } = require("../utils/securityLogger");
const router = express.Router();

// --- SECURITY PROTOCOLS ---
const DANGEROUS_PATTERNS = {
  python: [/import\s+os/, /import\s+subprocess/, /open\(/, /exec\(/, /eval\(/, /__import__/, /sys\.modules/],
  javascript: [/require\(/, /process\./, /child_process/, /fs\./, /eval\(/, /Function\(/],
  cpp: [/system\(/, /fork\(/, /popen\(/, /<unistd\.h>/, /<windows\.h>/],
  c: [/system\(/, /fork\(/, /popen\(/, /<unistd\.h>/, /<windows\.h>/],
  java: [/Runtime\.getRuntime/, /ProcessBuilder/, /System\.exit/, /java\.io\.File/, /java\.nio/],
  bash: [/rm\s+-rf/, /:[:]\s*{/, /mkfs/, /dd\s+if=/]
};

const SECURITY_STATS = {
  MAX_CODE_LENGTH: 10000,
  MAX_INPUT_LENGTH: 1000
};

const validateSubmission = (language, code, input) => {
  if (!code || code.length > SECURITY_STATS.MAX_CODE_LENGTH) {
    return { valid: false, error: "Security Alert: Code exceeds maximum length." };
  }

  if (input && input.length > SECURITY_STATS.MAX_INPUT_LENGTH) {
    return { valid: false, error: "Security Alert: Input exceeds maximum length." };
  }

  const langPatterns = DANGEROUS_PATTERNS[language?.toLowerCase()];
  if (langPatterns) {
    for (const pattern of langPatterns) {
      if (pattern.test(code)) {
        logEvent("security", {
          action: "BLOCKED_KEYWORD",
          language,
          pattern: pattern.toString(),
          ip: input?.ip || "unknown"
        });
        return {
          valid: false,
          error: "Security Alert: Forbidden keyword detected."
        };
      }
    }
  }

  return { valid: true };
};

// --------------------------

const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  c: { language: "c", version: "10.2.0" },
  "c++": { language: "c++", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  python: { language: "python", version: "3.10.0" }
};

// ==========================
// HISTORY ROUTES (UNCHANGED)
// ==========================

router.get("/history", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ error: "Invalid Token Payload" });
    }

    const history = await CodeHistory.find({ userId: decoded.id })
      .sort({ timestamp: -1 })
      .limit(50);

    const formattedHistory = history.map(log => ({
      id: log._id,
      language: log.language,
      description: log.description || "Quick Run",
      code: log.code,
      status:
        log.output &&
          (log.output.includes("Error") || log.output.includes("Exception"))
          ? "fail"
          : "success",
      timestamp: new Date(log.timestamp).toLocaleTimeString("en-US", {
        hour12: false
      }),
      duration: "0.00"
    }));

    res.json(formattedHistory);
  } catch (err) {
    console.error("FETCH_HISTORY_ERROR:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/history/all", async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Invalid Token" });

    await CodeHistory.deleteMany({ userId: decoded.id });
    res.json({ message: "All history cleared successfully" });
  } catch (error) {
    console.error("Clear All History Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/history/:id", async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return res.status(401).json({ error: "Invalid Token" });

    const result = await CodeHistory.findOneAndDelete({
      _id: req.params.id,
      userId: decoded.id
    });

    if (!result) {
      return res.status(404).json({ error: "Log not found or unauthorized" });
    }

    res.json({ success: true, message: "Log deleted permanently" });
  } catch (err) {
    console.error("DELETE_HISTORY_ERROR:", err);
    res.status(500).json({ error: "Failed to delete log" });
  }
});

// ==========================
// LANGUAGES ROUTE (UNCHANGED)
// ==========================

router.get("/languages", (req, res) => {
  res.json(
    Object.keys(LANGUAGE_MAP).map(key => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      version: LANGUAGE_MAP[key].version
    }))
  );
});

// ==========================
// 🔥 EXECUTION ROUTE (MODIFIED SAFELY)
// ==========================

router.post("/execute", async (req, res) => {
  const { code, language, input, description } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // 0️⃣ IP BLOCK CHECK
  if (isBlocked(clientIp)) {
    logEvent("security", { action: "BLOCKED_IP_ATTEMPT", ip: clientIp });
    return res.status(403).json({
      output: "⛔ ACCESS DENIED: IP blocked",
      isError: true
    });
  }

  // 1️⃣ SECURITY CHECK
  const securityCheck = validateSubmission(language, code, { ip: clientIp });
  if (!securityCheck.valid) {
    return res.json({
      output: `❌ ${securityCheck.error}`,
      isError: true
    });
  }

  if (!code || !language) {
    return res.json({ output: "❌ Code or language missing", isError: true });
  }

  const langConfig = LANGUAGE_MAP[language];
  if (!langConfig) {
    return res.json({ output: "❌ Unsupported language", isError: true });
  }

  // 2️⃣ EXECUTION (SYNCHRONOUS FOR CLIENT)
  try {
    const result = await executeDocker(language, code, input || "");

    // 3️⃣ LOGGING
    logEvent("info", {
      action: "EXECUTION_COMPLETE",
      language,
      duration: result.duration,
      isError: result.isError,
      ip: clientIp
    });

    let historyId = null;

    // 4️⃣ HISTORY SAVING
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          const newLog = await CodeHistory.create({
            userId: decoded.id,
            language,
            code,
            description: description || "Quick Run",
            output: result.output || "⚠️ No output",
            timestamp: new Date()
          });
          historyId = newLog._id;
        }
      } catch (err) {
        console.error("Failed to save history:", err.message);
      }
    }

    // 5️⃣ RETURN RESPONSE
    res.json({
      output: result.output,
      isError: result.isError,
      historyId: historyId, // Return ID so frontend can highlight it
      duration: result.duration
    });

  } catch (error) {
    console.error("Execution Error:", error.message);
    res.status(500).json({ output: "Internal Execution Error", isError: true });
  }
});

module.exports = router;
