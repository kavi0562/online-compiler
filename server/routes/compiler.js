const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const CodeHistory = require("../models/CodeHistory");
const router = express.Router();

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

  if (!code || !language) {
    return res.json({ output: "❌ Code or language missing" });
  }

  const langConfig = LANGUAGE_MAP[language];
  if (!langConfig) {
    return res.json({ output: "❌ Unsupported language" });
  }

  try {
    const response = await axios.post(PISTON_API_URL, {
      language: langConfig.language,
      version: langConfig.version,
      files: [{
        name: getFileName(langConfig.language),
        content: code
      }],
      stdin: input || "",
      run_timeout: 3000,
      compile_timeout: 10000
    }, {
      timeout: 15000
    });

    const { run, compile } = response.data;

    // Check if there was a compile error first
    if (compile && compile.code !== 0) {
      return res.json({
        output: `❌ Compilation Error:\n${compile.stderr || compile.stdout || "Unknown error"}`,
        isError: true
      });
    }

    // Combine stdout and stderr
    let output = (run.stdout || "") + (run.stderr || "");

    // Check for Piston signal (e.g., SIGTERM, SIGKILL which indicate timeout)
    if (run.signal === "SIGKILL" || run.signal === "SIGTERM") {
      output = `⚠️ Time Limit Exceeded\nYour code took too long to execute. Infinite loop handled.`;
    }

    res.json({
      output: output || "⚠️ No output",
      isError: false
    });

    // 💾 SAVE HISTORY (If User is Logged In)
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          await CodeHistory.create({
            userId: decoded.id, // Assuming payload has 'id'
            language,
            code,
            output: output || "⚠️ No output"
          });
        }
      } catch (err) {
        console.error("Failed to save history:", err.message);
        // Do not fail the request if history saving fails
      }
    }

  } catch (error) {
    console.error("Piston API Error:", error.message);
    if (error.code === 'ECONNABORTED') {
      return res.json({ output: "❌ Error: Request timed out. The code execution took too long.", isError: true });
    }
    res.json({ output: "❌ Error executing code via Piston API", isError: true });
  }
});

module.exports = router;
