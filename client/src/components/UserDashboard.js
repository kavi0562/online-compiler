import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ReactorCore from "./scifi/ReactorCore";
import ControlDeck from "./scifi/ControlDeck";
import HoloTerminal from "./scifi/HoloTerminal";
import LanguageSelector from "./LanguageSelector";
import FileUpload from "./FileUpload";
import GithubSyncPanel from "./scifi/GithubSyncPanel";
import ChatAssistant from "./scifi/ChatAssistant";
import TemporalLogs from "./scifi/TemporalLogs";
import ReactorLogo from "./scifi/ReactorLogo";
import { LayoutTemplate, Database, Download, Share2, Copy } from "lucide-react";
import { LANGUAGES } from "../data/languages";

// Boilerplates
const BOILERPLATES = {
  python: 'print("Hello from the Void!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Systems Operational.");\n    }\n}',
  javascript: 'console.log("N Compiler Systems Online...");',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Energy Levels Optimal." << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("System Ignition...\\n");\n    return 0;\n}',
  csharp: 'using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Neural Uplink Established.");\n    }\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Gopher Online.")\n}',
  rust: 'fn main() {\n    println!("Rust Safe-Mode Active.");\n}',
  php: '<?php\necho "Hypertext Preprocessor Linked.";\n?>',
  ruby: 'puts "Ruby Gem Loaded."',
  swift: 'print("Swift Protocol Initiated.")',
  typescript: 'console.log("Type-Safe Systems Online...");',
  bash: 'echo "Shell Command Executed."',
};

function UserDashboard({ githubToken, user, role, onConnectGithub }) {
  const location = useLocation();
  const [code, setCode] = useState(BOILERPLATES["python"] || "");
  const [language, setLanguage] = useState("python");
  const [languages] = useState(LANGUAGES);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ignitionHover, setIgnitionHover] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeLogId, setActiveLogId] = useState(null);

  const [inputHints, setInputHints] = useState([]);
  const [formValues, setFormValues] = useState({});

  // Handle Persistence & Navigation
  useEffect(() => {
    // 1. Navigation FROM Syllabus (Intentional switch)
    if (location.state) {
      const { challengeCode, language, challengeTitle } = location.state;

      if (challengeTitle) {
        // User explicitly selected a challenge
        localStorage.setItem('current_active_challenge', challengeTitle);

        // Try to load specific progress for this challenge
        const savedProgress = localStorage.getItem(`challenge_progress_${challengeTitle}`);
        if (savedProgress) {
          setCode(savedProgress);
        } else if (challengeCode) {
          setCode(challengeCode);
        }
      } else if (challengeCode) {
        // Just a code snippet without a tracked title
        setCode(challengeCode);
        localStorage.removeItem('current_active_challenge');
      }

      if (language) setLanguage(language);
    }
    // 2. Navigation FROM elsewhere (e.g. Back button, or clicking 'Dashboard' tab)
    else {
      // Restore the EXACT state of the editor from before navigation (Snapshot)
      const lastSnapshot = localStorage.getItem('editor_snapshot');
      if (lastSnapshot) {
        setCode(lastSnapshot);
      }

      // Also restore the last active challenge title context if available
      // (This assumes the snapshot belongs to that challenge)
      // We don't overwrite code here because snapshot is king for visual consistency.
    }
  }, [location]);

  // Handle typing in editor
  const handleCodeChange = (newCode) => {
    setCode(newCode);

    // 1. Always save a "Snapshot" of the editor state (for simple navigation storage)
    localStorage.setItem('editor_snapshot', newCode);

    // 2. If we are working on a specific challenge, save valid progress for THAT challenge
    const currentChallenge = localStorage.getItem('current_active_challenge');
    if (currentChallenge) {
      localStorage.setItem(`challenge_progress_${currentChallenge}`, newCode);
    }
  };
  const [localUsageCount, setLocalUsageCount] = useState(user?.githubSyncUsage || 0);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  // Auto-Push State
  const [repo, setRepo] = useState("");
  const [isAutoPushEnabled, setIsAutoPushEnabled] = useState(false);

  // 1. Sync Local Usage Count (Only when count changes)
  // Extract primitive to avoid 'user' object dependency in effect
  const githubSyncUsage = user?.githubSyncUsage;

  useEffect(() => {
    if (githubSyncUsage !== undefined) {
      setLocalUsageCount(githubSyncUsage);
    }
  }, [githubSyncUsage]);

  // 2. Fetch History (ONCE per login session or manual refresh)
  const fetchHistory = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/compiler/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.data) setHistory(res.data);
      })
      .catch(err => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) return;
        console.error("HISTORY_FETCH_FAILED:", err);
      });
  }, []);

  useEffect(() => {
    if (user?.uid) {
      fetchHistory();
    }
  }, [user?.uid, fetchHistory]);

  // Extract Input Prompts from Code
  useEffect(() => {
    if (!code) return;

    const hints = [];

    const strategies = {
      python: [
        /input\s*\(\s*["']([^"']+)["']\s*\)/g, // Python input function
      ],
      c: [
        /printf\s*\(\s*["']([^"']+)["']\s*\)/g // C printf before scanf
      ],
      cpp: [
        /cout\s*<<\s*["']([^"']+)["']/g,       // C++ cout streaming
        /printf\s*\(\s*["']([^"']+)["']\s*\)/g  // C-style printf in C++
      ],
      java: [
        /System\.out\.print(?:ln)?\s*\(\s*["']([^"']+)["']\s*\)/g // Java sysout
      ],
      csharp: [
        /Console\.Write(?:Line)?\s*\(\s*["']([^"']+)["']\s*\)/g
      ],
      go: [
        /fmt\.Print(?:ln|f)?\s*\(\s*["']([^"']+)["']\s*\)/g
      ],
      rust: [
        /println!\s*\(\s*["']([^"']+)["']\s*\)/g
      ],
      javascript: [
        /prompt\s*\(\s*["']([^"']+)["']\s*\)/g,
        /console\.log\s*\(\s*["']([^"']+)["']\s*\)/g
      ]
    };

    // Fallback Strategies: Detect input variables when no prompts exist
    const fallbackStrategies = {
      cpp: [/cin\s*((?:>>\s*\w+\s*)+);/g],
      c: [/scanf\s*\(\s*["'][^"']+["']\s*,\s*((?:&?\w+\s*,?\s*)+)\)/g],
      python: [/(?:^|\s)(\w+)\s*=\s*input\s*\(\s*\)/g], // input() without arguments
      java: [/(?:Scanner|in)\.(?:next\w*)\s*\(\s*\)/g] // Very basic scanner detection
    };

    let langKey = language.toLowerCase();
    // Normalize keys
    if (langKey === 'py') langKey = 'python';
    if (langKey === 'js') langKey = 'javascript';
    if (langKey === 'cs') langKey = 'csharp';
    if (langKey === 'rs') langKey = 'rust';

    // 1. Primary Scan: Explicit Prompts
    const activeRegexes = strategies[langKey] || [];
    for (const regex of activeRegexes) {
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(code)) !== null) {
        const captured = match[1].trim();

        // Use stricter filter for non-input specific commands like printf/cout
        // to avoid capturing "Result is: ..." headers.

        // Python 'input()' text is ALWAYS a prompt.
        if (langKey === 'python' && match[0].includes('input')) {
          hints.push(captured);
          continue;
        }

        const isQuestion = /[:?=]$/.test(captured) || />$/.test(captured);
        const hasKeywords = /enter|input|type|specify|provide|choose|give|value|number/i.test(captured);

        if (isQuestion || hasKeywords) {
          hints.push(captured);
        }
      }
    }

    // 2. Fallback Scan: Input Variables (if no prompts found)
    if (hints.length === 0) {
      const fallbackRegexes = fallbackStrategies[langKey] || [];
      for (const regex of fallbackRegexes) {
        let match;
        regex.lastIndex = 0;
        while ((match = regex.exec(code)) !== null) {
          // Logic for C++ cin chaining: cin >> a >> b;
          if (langKey === 'cpp') {
            const chain = match[1]; // ">> a >> b"
            const vars = chain.split('>>').map(s => s.trim()).filter(s => s);
            vars.forEach(v => hints.push(`Enter value for ${v}`));
          }
          // Logic for C scanf: &a, &b
          else if (langKey === 'c') {
            const args = match[1]; // "&a, &b"
            const vars = args.split(',').map(s => s.trim().replace('&', '')).filter(s => s);
            vars.forEach(v => hints.push(`Enter value for ${v}`));
          }
          // Logic for Python x = input()
          else if (langKey === 'python') {
            hints.push(`Enter value for ${match[1]}`);
          }
          else {
            hints.push(`Input Required`);
          }
        }
      }
    }

    // Deduplicate hints
    const uniqueHints = [...new Set(hints)];

    // Only update if changed to prevent form reset loop
    if (JSON.stringify(uniqueHints) !== JSON.stringify(inputHints)) {
      setInputHints(uniqueHints);
      setFormValues({}); // Reset form when structure changes
      setInput("");      // Reset raw input
    }
  }, [code, language, inputHints]);

  const handleFormChange = (index, value) => {
    const newValues = { ...formValues, [index]: value };
    setFormValues(newValues);

    // Sync to raw input string -> joined by newlines
    // We strictly use the order of hints
    const lines = [];
    for (let i = 0; i < inputHints.length; i++) {
      lines.push(newValues[i] || "");
    }
    setInput(lines.join("\n"));
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);

    // Safer default fallback with correct comment syntax
    let defaultCode = `// Initialize ${newLang} module...`;
    const hashCommentLangs = ['python', 'python2', 'ruby', 'perl', 'bash', 'sh', 'r', 'julia', 'elixir', 'yaml', 'coffeescript', 'nim', 'crystal', 'dockerfile', 'makefile'];
    if (hashCommentLangs.some(l => newLang.toLowerCase().includes(l))) {
      defaultCode = `# Initialize ${newLang} module...`;
    }

    setCode(BOILERPLATES[newLang] || defaultCode);
    setIsError(false);
    setOutput("");
    setActiveLogId(null);
  };

  const handleDownload = async () => {
    // Extended Extension Map
    const extMap = {
      'python': 'py',
      'java': 'java',
      'javascript': 'js',
      'cpp': 'cpp',
      'c': 'c',
      'csharp': 'cs',
      'go': 'go',
      'rust': 'rs',
      'php': 'php',
      'ruby': 'rb',
      'swift': 'swift',
      'typescript': 'ts',
      'bash': 'sh',
    };

    const extension = extMap[language] || 'txt';
    const defaultName = `main.${extension}`;

    try {
      // Check if the File System Access API is supported
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultName,
          types: [{
            description: 'Source Code',
            accept: { 'text/plain': [`.${extension}`] },
          }],
        });

        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
      } else {
        // Fallback for browsers that don't support the API
        throw new Error("File System Access API not supported");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled the picker, do nothing
        return;
      }

      console.warn("Falling back to legacy download:", err);
      // specific fallback logic
      const blob = new Blob([code], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = defaultName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleFileUpload = ({ content, fileName, extension }) => {
    setCode(content);
    // Simple extension mapping
    const extMap = {
      'py': 'python',
      'js': 'javascript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'swift': 'swift',
      'ts': 'typescript',
      'sh': 'bash',
    };
    if (extMap[extension]) {
      setLanguage(extMap[extension]);
    }
  };

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleShare = async () => {
    try {
      console.log(">> INITIATING_SHARE_PROTOCOL...");
      const response = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/share`, {
        sourceCode: code,
        language: language
      });

      if (response.data.success) {
        const fullUrl = `${window.location.origin}${response.data.url}`;
        setShareUrl(fullUrl);
        setShowShareModal(true);
        console.log(">> SHARE_LINK_GENERATED:", fullUrl);
      }
    } catch (error) {
      console.error("SHARE_FAILED:", error);
      setOutput("// SHARE FAILED: " + (error.response?.data?.message || error.message));
    }
  };

  const runCode = async () => {
    setIsThinking(true);
    setIsError(false);
    setActiveLogId(null);
    setTimeout(() => executeCodeActually(), 2000); // Effect delay
  };

  const executeCodeActually = async () => {
    setLoading(true);
    setIsThinking(false);
    const startTime = Date.now();
    const runId = Date.now();

    // Generate Description (Heuristic: First Comment or Problem Title)
    let logDescription = "Quick Run";
    const cleanCode = code.trim();

    // 1. Check for Problem Title from State context (if applicable - currently not persisted in state but good to have)
    // if (location.state?.challengeTitle) logDescription = location.state.challengeTitle;

    // 2. Extract from First Line Comment
    const firstLine = cleanCode.split('\n')[0].trim();
    if (firstLine.startsWith("//") || firstLine.startsWith("#") || firstLine.startsWith("/*")) {
      logDescription = firstLine.replace(new RegExp("^[/*#]+"), '').trim().substring(0, 30);
      if (logDescription.length === 30) logDescription += "...";
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/compiler/execute`,
        { code, language, input, description: logDescription },
        { headers: user ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {} }
      );

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      let result = res.data.output || "";
      let hasError = false;

      if (typeof result === 'string' && (result.includes("Error") || result.includes("Exception") || result.includes("Traceback"))) {
        setIsError(true);
        hasError = true;
      }
      setOutput(result);
      let verificationStatus = 'success';

      // Add to History
      const newLog = {
        id: res.data.historyId || runId, // Use real DB ID if available
        language: language,
        description: logDescription,
        code: code,
        status: hasError ? 'fail' : verificationStatus,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        duration: duration
      };
      setHistory(prev => [newLog, ...prev].slice(0, 10));
      setActiveLogId(res.data.historyId || runId);

    } catch (err) {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      setIsError(true);
      setOutput("CRITICAL FAILURE: Node Disconnected.\n" + (err.response?.data?.error || err.message));

      const newLog = {
        id: runId,
        language: language,
        code: code,
        status: 'fail',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        duration: duration
      };
      setHistory(prev => [newLog, ...prev].slice(0, 10));
      setActiveLogId(runId);
    } finally {
      setLoading(false);

      // TRIGGER AUTO-PUSH (Background Process)
      if (isAutoPushEnabled && repo && user) {
        handleAutoPush(runId);
      }
    }
  };

  const handleAutoPush = async (runId) => {
    try {
      // console.log(">> AUTO_PUSH_INITIATED");
      const filenameMap = {
        'python': 'main.py',
        'javascript': 'index.js',
        'java': 'Main.java',
        'cpp': 'main.cpp',
        'c': 'main.c'
      };

      await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/github/auto-push-cli`, {
        repo: repo,
        code: code,
        filename: filenameMap[language] || 'code.txt',
        githubToken: githubToken
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      // console.log(">> AUTO_PUSH_SUCCESS");
      // Quietly increment usage count if not admin
      setLocalUsageCount(prev => prev + 1);

    } catch (err) {
      console.error("AUTO_PUSH_FAILED:", err);
      // Optional: Notify user via console output without blocking execution
      setOutput(prev => prev + `\n\n// NOTE: Auto-Push Failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const restoreHistory = (log) => {
    setCode(log.code);
    setLanguage(log.language);
    setIsError(false);
    setOutput(`// DATA RECOVERY SUCCESSFUL\n// RESTORED SNAPSHOT: ${log.timestamp}\n// STATUS: READY FOR ANALYSIS`);
    setActiveLogId(log.id);
  };

  const handleDeleteHistory = async (logId) => {
    if (!logId) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/compiler/history/${logId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setHistory(prev => prev.filter(log => log.id !== logId));
      if (activeLogId === logId) setActiveLogId(null);
    } catch (err) {
      console.error("DELETE_HISTORY_ERROR:", JSON.stringify(err.response?.data || err.message, null, 2));
      // Also log the ID we tried to delete for context
      console.error("FAILED_LOG_ID:", logId);
    }
  };

  const clearHistory = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/compiler/history/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setHistory([]);
      setActiveLogId(null);
      // alert("History Cleared Permanently"); // Optional feedback
    } catch (err) {
      console.error("CLEAR_HISTORY_ERROR:", JSON.stringify(err.response?.data || err.message, null, 2));
      alert("Failed to clear history: " + (err.response?.data?.error || err.message));
    }
  };

  const clearConsole = () => {
    setOutput("");
    setInput("");
    setIsError(false);
  };

  // Unified Clear Function for Reactor Core (Trash Button)
  const handleCoreClear = () => {
    setCode("");
    setInput("");
    setFormValues({});
    setInputHints([]); // Optional: Hints usually derive from code, so clearing code clears hints via effect, but good to be explicit
    // We don't necessarily clear output? User asked "input lo unaa undhi delete ipovali". 
    // Usually clear code -> clear output too makes sense, but let's stick to what was asked: Code + Input.
    // Let's clear output too for a fresh start? Maybe safer.
    // The user said: "compiler lo delete option kotaganey input lo unaa unadhi anthaa delete ipovalli"
    // "When delete option is clicked, everything in input should be deleted".
    // It implies Code is deleted (existing behavior) AND Input is deleted.
  };

  const handleInsertCode = (codeSnippet) => {
    // Replace existing code with the new snippet as requested
    setCode(codeSnippet);
  };

  const handleUplink = async (repo, message) => {
    // ALERT REMOVED AS REQUESTED
    // We will attempt to push even if token is missing/null.
    // The server will respond with 401 if unauthorized, which we catch below.

    try {
      setOutput(`// UPLINK ESTABLISHED...\n// TARGET: ${repo}\n// CONNECTING TO GITHUB SECURE GATEWAY...`);

      // Simple filename map based on language
      const extMap = {
        'python': 'main.py',
        'javascript': 'index.js',
        'java': 'Main.java',
        'cpp': 'main.cpp',
        'c': 'main.c'
      };
      const filename = extMap[language] || 'code.txt';

      const res = await axios.post(`${process.env.REACT_APP_API_URL || "http://localhost:5051"}/api/github/push`, {
        repo: repo, // Format: "owner/repo"
        message: message,
        code: code,
        filename: filename,
        githubToken: githubToken // Might be null, server will handle it
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.data.success) {
        setOutput(`// GITHUB SYNC COMPLETE.\n// COMMIT SHA: ${res.data.commit.sha.substring(0, 7)}\n// STATUS: 200 OK\n// BRANCH: main updated.`);
        // Increment local usage count to reflect change immediately
        setLocalUsageCount(prev => prev + 1);
      } else {
        throw new Error("Unknown error during sync.");
      }

    } catch (err) {
      console.error("UPLINK_ERROR_DETAILS:", err);
      let errorMsg = "CONNECTION_FAILED";
      if (err.response) {
        console.error("SERVER_RESPONSE:", err.response.status, err.response.data);
        errorMsg = `SERVER_REJECTED: ${err.response.status}`;
        if (err.response.data && err.response.data.error) {
          errorMsg += `\n// REASON: ${err.response.data.error}`;
        }
        if (err.response.data && err.response.data.message) {
          errorMsg += `\n// MSG: ${err.response.data.message}`;
        }
        if (typeof err.response.data === 'string') {
          errorMsg += `\n// RAW: ${err.response.data.substring(0, 100)}`;
        }
      } else if (err.request) {
        errorMsg = "NO_RESPONSE_FROM_SERVER (Check invalid URL or Server Offline)";
      } else {
        errorMsg = err.message;
      }
      setOutput(`// UPLINK FAILED: ${errorMsg}\n// CONNECTION TERMINATED.`);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void font-tech text-gray-200">

      {/* Dynamic Starfield Background */}
      <div className="starfield-layer stars-sm"></div>
      <div className="starfield-layer stars-md"></div>

      {/* Global CRT Scan-line Overlay */}
      <div className="absolute inset-0 z-[9999] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20"></div>

      {/* Bento Grid / Mobile Flex Layout */}
      <div className="h-full w-full p-4 md:px-6 md:pt-24 md:pb-6 flex flex-col md:grid md:grid-cols-12 md:grid-rows-12 gap-4 md:gap-6 z-10 relative overflow-y-auto md:overflow-hidden pb-20">

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-neon-cyan/50 p-6 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(0,243,255,0.2)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-neon-cyan tracking-widest">TRANSMISSION_ESTABLISHED</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* URL Input & Copy */}
              <div className="bg-black/50 p-3 rounded border border-gray-800 flex items-center gap-2 mb-6">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="bg-transparent w-full text-xs text-gray-400 outline-none font-mono"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    // Optional: Show copied toast
                  }}
                  className="text-neon-cyan hover:text-white p-2 rounded hover:bg-neon-cyan/10 transition-all"
                  title="Copy Link"
                >
                  <Copy size={16} />
                </button>
              </div>

              {/* Social Icons Row */}
              <div className="flex justify-center gap-6 items-center">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=Check out my code: ${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10 bg-[#25D366] rounded-full hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                  title="Share on WhatsApp"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10 bg-[#0077b5] rounded hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(0,119,181,0.4)]"
                  title="Share on LinkedIn"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out my code snippet on N Compiler!&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-10 h-10 bg-white rounded hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  title="Share on X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        )}

        {/* Header / Stats (Top Left) */}
        <div className="hidden md:flex col-span-12 md:col-span-3 row-span-2 bg-glass border border-glass rounded-2xl p-4 items-center justify-between shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-cyan/5 rounded-lg border border-neon-cyan/20">
              <ReactorLogo className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white">N <span className="text-neon-cyan">COMPILER</span></h1>
              <span className="text-[10px] text-gray-400">N COMPILER – SYSTEM STATUS: ONLINE</span>
            </div>
          </div>
        </div>

        {/* Language Selector (Top Middle) */}
        <div className="w-full md:col-span-5 md:row-span-2 bg-glass border border-glass rounded-2xl p-4 flex flex-col justify-center shadow-lg relative group z-50 order-1 md:order-none">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity pointer-events-none hidden md:block">
            <Database size={40} className="text-neon-magenta" />
          </div>
          <span className="text-[10px] text-neon-magenta tracking-widest mb-1 font-bold">ACTIVE MODULE</span>
          <div className="flex flex-col gap-3 w-full">
            {/* Active Module & Actions Row */}
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 min-w-0">
                <LanguageSelector languages={languages} selected={language} onSelect={handleLanguageChange} />
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Upload Button */}
                <div className="w-[34px] h-[34px]">
                  <FileUpload onFileUpload={handleFileUpload} fullWidth className="p-0 h-full" />
                </div>

                {/* Download Button */}
                <div className="relative group w-[34px] h-[34px]">
                  <button
                    onClick={handleDownload}
                    className="relative flex items-center justify-center w-full h-full p-0
                             bg-neon-cyan/5 border border-neon-cyan/30 
                             rounded-lg backdrop-blur-md transition-all duration-300 
                             hover:bg-neon-cyan/10 hover:border-neon-cyan/60
                             hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]
                             group z-10 peer"
                  >
                    <span className="absolute inset-0 rounded-lg border border-neon-cyan opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    <Download size={15} className="text-neon-cyan/80 group-hover:text-neon-cyan transition-colors" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 
                                  bg-white text-black text-[10px] font-bold tracking-widest rounded
                                  transform opacity-0 translate-y-2 peer-hover:opacity-100 peer-hover:translate-y-0 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap shadow-lg shadow-white/20">
                    DOWNLOAD CODE
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative group w-[34px] h-[34px]">
                  <button
                    onClick={handleShare}
                    className="relative flex items-center justify-center w-full h-full p-0
                             bg-neon-cyan/5 border border-neon-cyan/30 
                             rounded-lg backdrop-blur-md transition-all duration-300 
                             hover:bg-neon-cyan/10 hover:border-neon-cyan/60
                             hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]
                             group z-10 peer"
                  >
                    <span className="absolute inset-0 rounded-lg border border-neon-cyan opacity-0 group-hover:opacity-20 transition-opacity"></span>
                    <Share2 size={15} className="text-neon-cyan/80 group-hover:text-neon-cyan transition-colors" />
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 
                                  bg-white text-black text-[10px] font-bold tracking-widest rounded
                                  transform opacity-0 translate-y-2 peer-hover:opacity-100 peer-hover:translate-y-0 transition-all duration-200 pointer-events-none z-[100] whitespace-nowrap shadow-lg shadow-white/20">
                    SHARE CODE
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stdin (Top Right) */}
        <div className="hidden md:flex col-span-6 md:col-span-4 row-span-2 bg-glass border border-glass rounded-2xl p-3 flex-col shadow-lg relative h-full overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-neon-cyan tracking-widest font-bold flex items-center gap-2">
              <LayoutTemplate size={12} /> INPUT
            </span>
          </div>


          {/* UNIFIED INPUT INTERFACE */}
          {inputHints.length > 0 ? (
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar p-1">
              <div className="text-[8px] text-neon-cyan/70 font-bold uppercase tracking-wider mb-1">
                REQUIRED INPUTS ({inputHints.length})
              </div>
              {inputHints.map((hint, i) => (
                <div key={i} className="group flex flex-col gap-1">
                  <label className="text-[10px] text-neon-cyan font-mono flex items-center gap-2 truncate">
                    <span className="opacity-50">{i + 1}.</span>
                    {hint}
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg px-3 py-2 text-xs text-white focus:border-neon-cyan focus:outline-none focus:bg-neon-cyan/5 transition-all placeholder-gray-700 font-mono"
                    placeholder={`Value for ${hint}...`}
                    value={formValues[i] || ""}
                    onChange={(e) => handleFormChange(i, e.target.value)}
                  />
                </div>
              ))}
              {/* Visual Connector to show inputs differ from code */}
              <div className="h-4"></div>
            </div>
          ) : (
            <textarea
              className="w-full h-full bg-[#050510]/50 bg-grid border border-[#30363d] rounded-xl p-3 text-[10px] font-mono text-gray-300 focus:border-neon-cyan focus:outline-none resize-none transition-all placeholder-gray-600 custom-scrollbar"
              placeholder="// Awaiting input data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          )}
        </div>

        {/* MAIN REACTOR CORE (Center) */}
        <div className="w-full h-[60vh] md:h-full md:col-span-8 md:row-span-7 relative order-2 md:order-none">
          <div className="absolute inset-0 bg-glass/20 border border-neon-cyan/20 rounded-[30px] -z-10 blur-xl transition-all duration-500 hidden md:block"></div>
          <ReactorCore
            code={code}
            language={language}
            onChange={handleCodeChange}
            isError={isError}
            isThinking={isThinking}
            ignitionHover={ignitionHover}
            isMaximized={isEditorMaximized}
            onToggleMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
            onClear={handleCoreClear}
          />
          {/* Connection Beam to Terminal - Desktop Only */}
          {!isThinking && output && !isError && (
            <div className="hidden md:block absolute bottom-[-20px] left-1/2 w-1 h-20 bg-gradient-to-b from-neon-cyan to-transparent animate-pulse z-0 transform -translate-x-1/2"></div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Core AI + Temporal Logs (Desktop Only) - Protected in Guest Mode */}
        <div className="hidden md:flex col-span-4 row-span-7 flex-col gap-2">
          <GithubSyncPanel
            onUplink={handleUplink}
            onConnectGithub={onConnectGithub}
            isLinked={!!githubToken}
            subscriptionPlan={user?.subscriptionPlan || 'free'}
            usageCount={localUsageCount}
            userRole={role} // Use the explicit role prop
            repo={repo}
            onRepoChange={setRepo}
            isAutoPushEnabled={isAutoPushEnabled}
            onToggleAutoPush={setIsAutoPushEnabled}
          />
          <TemporalLogs history={history} onRestore={restoreHistory} onClear={clearHistory} onDelete={handleDeleteHistory} onRefresh={fetchHistory} activeLogId={activeLogId} user={user} onConnectGithub={onConnectGithub} />
        </div>

        {/* HOLO TERMINAL (Bottom) */}
        <div className="w-full h-[30vh] md:h-auto md:col-span-8 md:row-span-3 min-h-0 relative z-20 order-3 md:order-none mt-4 md:mt-0">
          <HoloTerminal output={output} input={input} isError={isError} onClear={clearConsole} />
        </div>

        {/* CONTROL DECK (Bottom Right) */}
        <div className="w-full md:col-span-4 md:row-span-3 flex items-start justify-center pt-2 order-4 md:order-none py-4 md:py-0">
          <ControlDeck
            onRun={runCode}
            onClear={clearConsole}
            isThinking={isThinking || loading}
            onHoverChange={setIgnitionHover}
          />
        </div>


        {/* AI CHAT ASSISTANT OVERLAY */}
        <ChatAssistant language={language} onInsertCode={handleInsertCode} onLanguageChange={handleLanguageChange} />

      </div>
    </div>
  );
}

export default UserDashboard;
