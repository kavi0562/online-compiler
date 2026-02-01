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
  bash: [/rm\s+-rf/, /:[:]\s*{/, /mkfs/, /dd\s+if=/] // fork bombs & destruction
};

const SECURITY_STATS = {
  MAX_CODE_LENGTH: 10000,
  MAX_INPUT_LENGTH: 1000,
};

const validateSubmission = (language, code, input) => {
  // 1. Basic Size Validation
  if (!code || code.length > SECURITY_STATS.MAX_CODE_LENGTH) {
    return { valid: false, error: "Security Alert: Code exceeds maximum length of 10,000 characters." };
  }
  if (input && input.length > SECURITY_STATS.MAX_INPUT_LENGTH) {
    return { valid: false, error: "Security Alert: Input exceeds maximum length of 1,000 characters." };
  }

  // 2. Keyword Detection (Heuristic)
  const langPatterns = DANGEROUS_PATTERNS[language.toLowerCase()];
  if (langPatterns) {
    for (const pattern of langPatterns) {
      if (pattern.test(code)) {
        logEvent('security', {
          action: 'BLOCKED_KEYWORD',
          language,
          pattern: pattern.toString(),
          ip: input?.ip || 'unknown'
        });
        return {
          valid: false,
          error: "Security Alert: Forbidden keyword or dangerous pattern detected. Action Logged."
        };
      }
    }
  }

  return { valid: true };
};
// --------------------------

// Replaced Piston with Native Docker Sandbox
const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  c: { language: "c", version: "10.2.0" },
  "c++": { language: "c++", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
  python: { language: "python", version: "3.10.0" }
};

// GET /history - Fetch execution logs
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
      status: (log.output && (log.output.includes("Error") || log.output.includes("Exception"))) ? 'fail' : 'success',
      timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
      duration: "0.00"
    }));

    res.json(formattedHistory);

  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Invalid or Expired Token" });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ error: "Invalid User ID format" });
    }
    console.error("FETCH_HISTORY_CRITICAL_FAILURE:", err);
    res.status(500).json({ error: "Internal Server Error: Failed to fetch history" });
  }
});

// 🗑️ DELETE ALL HISTORY FOR USER (Clear Console)
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

// DELETE /history/:id - Delete execution log
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

router.get("/languages", (req, res) => {
  res.json(Object.keys(LANGUAGE_MAP).map(key => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    version: LANGUAGE_MAP[key].version
  })));
});

router.post("/execute", async (req, res) => {
  const { code, language, input } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // 0. CHECK WATCHLIST
  if (isBlocked(clientIp)) {
    logEvent('security', { action: 'BLOCKED_IP_ATTEMPT', ip: clientIp });
    return res.status(403).json({ output: "⛔ ACCESS DENIED: Your IP has been flagged for repeated security violations.", isError: true });
  }

  // 1. SECURITY CHECK (Pre-Execution)
  const securityCheck = validateSubmission(language, code, { ip: clientIp });
  if (!securityCheck.valid) {
    return res.json({
      output: `❌ ${securityCheck.error}`,
      isError: true
    });
  }

  if (!code || !language) {
    return res.json({ output: "❌ Code or language missing" });
  }

  const langConfig = LANGUAGE_MAP[language];
  if (!langConfig) {
    return res.json({ output: "❌ Unsupported language" });
  }

  try {
    // EXECUTE IN DOCKER
    const result = await executeDocker(language, code, input || "");

    // LOG SUCCESS/FAIL
    logEvent('info', {
      action: 'EXECUTION_COMPLETE',
      language,
      duration: result.duration,
      isError: result.isError,
      ip: clientIp
    });

    // 💾 SAVE HISTORY (If User is Logged In)
    const token = req.header("Authorization")?.replace("Bearer ", "");
    let historyId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          const savedLog = await CodeHistory.create({
            userId: decoded.id,
            language,
            code,
            description: req.body.description || "Quick Run",
            output: result.output || "⚠️ No output"
          });
          historyId = savedLog._id;
        }
      } catch (err) {
        console.error("Failed to save history:", err.message);
      }
    }

    res.json({
      output: result.output || "⚠️ No output",
      isError: result.isError,
      historyId: historyId
    });

  } catch (error) {
    console.error("Execution Error:", error.message);
    res.json({ output: "❌ Critical Execution Failure", isError: true });
  }
});

module.exports = router;
