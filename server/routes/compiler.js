const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const CodeHistory = require("../models/CodeHistory");
const { executeDocker } = require("../utils/dockerSandbox");
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

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_MAP = {
  matl: { language: "matl", version: "22.7.4" },
  bash: { language: "bash", version: "5.2.0" },
  befunge93: { language: "befunge93", version: "0.2.0" },
  bqn: { language: "bqn", version: "1.0.0" },
  brachylog: { language: "brachylog", version: "1.0.0" },
  brainfuck: { language: "brainfuck", version: "2.7.3" },
  cjam: { language: "cjam", version: "0.6.5" },
  clojure: { language: "clojure", version: "1.10.3" },
  cobol: { language: "cobol", version: "3.1.2" },
  coffeescript: { language: "coffeescript", version: "2.5.1" },
  cow: { language: "cow", version: "1.0.0" },
  crystal: { language: "crystal", version: "0.36.1" },
  dart: { language: "dart", version: "2.19.6" },
  dash: { language: "dash", version: "0.5.11" },
  typescript: { language: "typescript", version: "5.0.3" },
  javascript: { language: "javascript", version: "18.15.0" },
  "basic.net": { language: "basic.net", version: "5.0.201" },
  "fsharp.net": { language: "fsharp.net", version: "5.0.201" },
  "csharp.net": { language: "csharp.net", version: "5.0.201" },
  fsi: { language: "fsi", version: "5.0.201" },
  dragon: { language: "dragon", version: "1.9.8" },
  elixir: { language: "elixir", version: "1.11.3" },
  emacs: { language: "emacs", version: "27.1.0" },
  emojicode: { language: "emojicode", version: "1.0.2" },
  erlang: { language: "erlang", version: "23.0.0" },
  file: { language: "file", version: "0.0.1" },
  forte: { language: "forte", version: "1.0.0" },
  forth: { language: "forth", version: "0.7.3" },
  freebasic: { language: "freebasic", version: "1.9.0" },
  awk: { language: "awk", version: "5.1.0" },
  c: { language: "c", version: "10.2.0" },
  "c++": { language: "c++", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" }, // Keep cpp alias for backward compatibility
  d: { language: "d", version: "10.2.0" },
  fortran: { language: "fortran", version: "10.2.0" },
  go: { language: "go", version: "1.16.2" },
  golfscript: { language: "golfscript", version: "1.0.0" },
  groovy: { language: "groovy", version: "3.0.7" },
  haskell: { language: "haskell", version: "9.0.1" },
  husk: { language: "husk", version: "1.0.0" },
  iverilog: { language: "iverilog", version: "11.0.0" },
  japt: { language: "japt", version: "2.0.0" },
  java: { language: "java", version: "15.0.2" },
  jelly: { language: "jelly", version: "0.1.31" },
  julia: { language: "julia", version: "1.8.5" },
  kotlin: { language: "kotlin", version: "1.8.20" },
  lisp: { language: "lisp", version: "2.1.2" },
  llvm_ir: { language: "llvm_ir", version: "12.0.1" },
  lolcode: { language: "lolcode", version: "0.11.2" },
  lua: { language: "lua", version: "5.4.4" },
  csharp: { language: "csharp", version: "6.12.0" },
  basic: { language: "basic", version: "6.12.0" },
  nasm: { language: "nasm", version: "2.15.5" },
  nasm64: { language: "nasm64", version: "2.15.5" },
  nim: { language: "nim", version: "1.6.2" },
  ocaml: { language: "ocaml", version: "4.12.0" },
  octave: { language: "octave", version: "8.1.0" },
  osabie: { language: "osabie", version: "1.0.1" },
  paradoc: { language: "paradoc", version: "0.6.0" },
  pascal: { language: "pascal", version: "3.2.2" },
  perl: { language: "perl", version: "5.36.0" },
  php: { language: "php", version: "8.2.3" },
  ponylang: { language: "ponylang", version: "0.39.0" },
  prolog: { language: "prolog", version: "8.2.4" },
  pure: { language: "pure", version: "0.68.0" },
  powershell: { language: "powershell", version: "7.1.4" },
  pyth: { language: "pyth", version: "1.0.0" },
  python2: { language: "python2", version: "2.7.18" },
  python: { language: "python", version: "3.10.0" },
  racket: { language: "racket", version: "8.3.0" },
  raku: { language: "raku", version: "6.100.0" },
  retina: { language: "retina", version: "1.2.0" },
  rockstar: { language: "rockstar", version: "1.0.0" },
  rscript: { language: "rscript", version: "4.1.1" },
  ruby: { language: "ruby", version: "3.0.1" },
  rust: { language: "rust", version: "1.68.2" },
  samarium: { language: "samarium", version: "0.3.1" },
  scala: { language: "scala", version: "3.2.2" },
  smalltalk: { language: "smalltalk", version: "3.2.3" },
  sqlite3: { language: "sqlite3", version: "3.36.0" },
  swift: { language: "swift", version: "5.3.3" },
  vlang: { language: "vlang", version: "0.3.3" },
  vyxal: { language: "vyxal", version: "2.4.1" },
  yeethon: { language: "yeethon", version: "3.10.0" },
  zig: { language: "zig", version: "0.10.1" }
};

// GET /history - Fetch execution logs
router.get("/history", async (req, res) => {
  // console.log("🔔 GET /history HIT");
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // Handle case where client sends "Bearer null" literal string
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
      code: log.code,
      status: (log.output && (log.output.includes("Error") || log.output.includes("Exception"))) ? 'fail' : 'success',
      timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false }),
      duration: "0.00"
    }));

    res.json(formattedHistory);

  } catch (err) {
    // Specific Handling for Common Errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      console.warn("HISTORY_AUTH_FAIL:", err.message);
      return res.status(401).json({ error: "Invalid or Expired Token" });
    }

    if (err.name === 'CastError') {
      console.warn("HISTORY_INVALID_ID:", err.message);
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

    // Use _id for MongoDB compatibility, but also check userId for ownership security
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

const getFileName = (language) => {
  switch (language) {
    case 'java': return 'Main.java';
    case 'csharp': return 'Program.cs';
    case 'go': return 'main.go';
    case 'rust': return 'main.rs';
    case 'c++': return 'source.cpp';
    case 'c': return 'source.c';
    case 'python': return 'main.py';
    case 'javascript': return 'main.js';
    case 'typescript': return 'main.ts';
    case 'php': return 'main.php';
    case 'ruby': return 'main.rb';
    case 'swift': return 'main.swift';
    case 'kotlin': return 'Main.kt';
    case 'scala': return 'Main.scala';
    case 'bash': return 'script.sh';
    default: return 'source';
  }
};

router.post("/execute", async (req, res) => {
  // Logic remains the same, just renamed endpoint to match frontend
  const { code, language, input } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress;

  // 0. CHECK WATCHLIST
  if (isBlocked(clientIp)) {
    logEvent('security', { action: 'BLOCKED_IP_ATTEMPT', ip: clientIp });
    return res.status(403).json({ output: "⛔ ACCESS DENIED: Your IP has been flagged for repeated security violations.", isError: true });
  }

  // 1. SECURITY CHECK (Pre-Execution)
  // We pass a dummy object with IP to validation for logging context if needed, though mostly handled here
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
    // SWITCH: Use Local Docker Sandbox instead of Piston
    // const response = await axios.post(PISTON_API_URL, ...); 

    // Execute via Docker
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
