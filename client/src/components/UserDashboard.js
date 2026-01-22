import { useState, useEffect } from "react";
import axios from "axios";
// import { Link } from "react-router-dom"; // Loop removed
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
  javascript: 'console.log("Reactor Core Online...");',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Energy Levels Optimal." << std::endl;\n    return 0;\n}',
};

function UserDashboard({ githubToken, user }) {
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
  // Local state to track usage immediately without refresh
  const [localUsageCount, setLocalUsageCount] = useState(user?.githubSyncUsage || 0);
  const [isEditorMaximized, setIsEditorMaximized] = useState(false);

  useEffect(() => {
    if (user) {
      setLocalUsageCount(user.githubSyncUsage || 0);
    }
  }, [user]);

  // Extract Input Prompts from Code
  useEffect(() => {
    if (!code) return;

    const hints = [];

    // Python Input Pattern: input("Enter prompt: ")
    const pythonRegex = /input\s*\(\s*["']([^"']+)["']\s*\)/g;

    // Java Scanner Pattern (simple heuristic)
    const printRegex = /System\.out\.print(?:ln)?\s*\(\s*["']([^"']+)["']\s*\)/g;

    let match;
    if (language === 'python' || language === 'py') {
      while ((match = pythonRegex.exec(code)) !== null) {
        hints.push(match[1]);
      }
    } else if (language === 'java' || language === 'cpp' || language === 'c') {
      while ((match = printRegex.exec(code)) !== null) {
        if (match[1].trim().endsWith(':') || match[1].trim().endsWith('?') || match[1].toLowerCase().includes('enter')) {
          hints.push(match[1]);
        }
      }
    }

    // Only update if changed to prevent form reset loop
    if (JSON.stringify(hints) !== JSON.stringify(inputHints)) {
      setInputHints(hints);
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
    setCode(BOILERPLATES[newLang] || `// Initialize ${newLang} module...`);
    setIsError(false);
    setOutput("");
    setActiveLogId(null);
  };

  const handleDownload = () => {
    // Create Blob
    const blob = new Blob([code], { type: 'text/plain' });
    // Create Link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    // Extension Map
    const extMap = {
      'python': 'py',
      'javascript': 'js',
      'cpp': 'cpp',
      'c': 'c',
      'java': 'java'
    };

    link.href = url;
    link.download = `main.${extMap[language] || 'txt'}`;

    // Trigger Download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = ({ content, fileName, extension }) => {
    setCode(content);
    // Simple extension mapping
    const extMap = {
      'py': 'python',
      'js': 'javascript',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'cpp',
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
      const response = await axios.post("http://localhost:5051/api/share", {
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

    try {
      const res = await axios.post(
        "http://localhost:5051/api/compiler/execute",
        { code, language, input },
        { headers: user ? { Authorization: `Bearer ${localStorage.getItem("token")}` } : {} }
      );

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      let result = res.data.output;
      let hasError = false;

      if (result.includes("Error") || result.includes("Exception") || result.includes("Traceback")) {
        setIsError(true);
        hasError = true;
      }
      setOutput(result);

      // Add to History
      const newLog = {
        id: runId,
        language: language,
        code: code,
        status: hasError ? 'fail' : 'success',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        duration: duration
      };
      setHistory(prev => [newLog, ...prev].slice(0, 10));
      setActiveLogId(runId);

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
    }
  };

  const restoreHistory = (log) => {
    setCode(log.code);
    setLanguage(log.language);
    setIsError(false);
    setOutput(`// DATA RECOVERY SUCCESSFUL\n// RESTORED SNAPSHOT: ${log.timestamp}\n// STATUS: READY FOR ANALYSIS`);
    setActiveLogId(log.id);
  };

  const clearHistory = () => {
    setHistory([]);
    setActiveLogId(null);
  };

  const clearConsole = () => {
    setOutput("");
    setInput("");
    setIsError(false);
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

      const res = await axios.post("http://localhost:5051/api/github/push", {
        repo: repo, // Format: "owner/repo"
        message: message,
        code: code,
        filename: filename,
        githubToken: githubToken // Might be null, server will handle it
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
        errorMsg = `SERVER_REJECTED: ${err.response.status}`;
        if (err.response.data && err.response.data.error) {
          errorMsg += `\n// REASON: ${err.response.data.error}`;
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
                  href={`https://twitter.com/intent/tweet?text=Check out my code snippet on Reactor.io!&url=${encodeURIComponent(shareUrl)}`}
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
              <h1 className="text-lg font-bold tracking-wider text-white">REACTOR<span className="text-neon-cyan">.IO</span></h1>
              <span className="text-[10px] text-gray-400">SYSTEM STATUS: ONLINE</span>
            </div>
          </div>
        </div>

        {/* Language Selector (Top Middle) */}
        <div className="w-full md:col-span-5 md:row-span-2 bg-glass border border-glass rounded-2xl p-4 flex flex-col justify-center shadow-lg relative group z-50 order-1 md:order-none">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity pointer-events-none hidden md:block">
            <Database size={40} className="text-neon-magenta" />
          </div>
          <span className="text-[10px] text-neon-magenta tracking-widest mb-1 font-bold">ACTIVE MODULE</span>
          <div className="flex flex-wrap items-center gap-2 pb-1 md:pb-0">
            <LanguageSelector languages={languages} selected={language} onSelect={handleLanguageChange} />
            <FileUpload onFileUpload={handleFileUpload} />

            {/* Navigation Buttons (Moved back to Navbar) */}
            <button
              onClick={handleDownload}
              className="p-3 md:p-2 rounded-lg flex items-center gap-1 transition-all duration-300 
                         bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan 
                         hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] 
                         shadow-[0_0_10px_rgba(0,243,255,0.15)]"
              title="Download Code"
            >
              <Download size={20} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 md:p-2 rounded-lg flex items-center gap-1 transition-all duration-300 
                         bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan 
                         hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] 
                         shadow-[0_0_10px_rgba(0,243,255,0.15)]"
              title="Share Code"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Stdin (Top Right) */}
        <div className="hidden md:flex col-span-6 md:col-span-4 row-span-2 bg-glass border border-glass rounded-2xl p-3 flex-col shadow-lg relative min-h-[150px] h-auto transition-all duration-300">
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
              className="w-full bg-[#050510]/50 bg-grid border border-[#30363d] rounded-xl p-3 text-[10px] font-mono text-gray-300 focus:border-neon-cyan focus:outline-none resize-none transition-all placeholder-gray-600 custom-scrollbar overflow-hidden min-h-[100px]"
              placeholder="// Awaiting input data..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              ref={(ref) => {
                if (ref) {
                  ref.style.height = 'auto';
                  ref.style.height = ref.scrollHeight + 'px';
                }
              }}
              spellCheck={false}
            />
          )}
        </div>

        {/* MAIN REACTOR CORE (Center) */}
        <div className="w-full h-[60vh] md:h-auto md:col-span-8 md:row-span-7 relative order-2 md:order-none">
          <div className="absolute inset-0 bg-glass/20 border border-neon-cyan/20 rounded-[30px] -z-10 blur-xl transition-all duration-500 hidden md:block"></div>
          <ReactorCore
            code={code}
            language={language}
            onChange={setCode}
            isError={isError}
            isThinking={isThinking}
            ignitionHover={ignitionHover}
            isMaximized={isEditorMaximized}
            onToggleMaximize={() => setIsEditorMaximized(!isEditorMaximized)}
          />
          {/* Connection Beam to Terminal - Desktop Only */}
          {!isThinking && output && !isError && (
            <div className="hidden md:block absolute bottom-[-20px] left-1/2 w-1 h-20 bg-gradient-to-b from-neon-cyan to-transparent animate-pulse z-0 transform -translate-x-1/2"></div>
          )}
        </div>

        {/* RIGHT SIDEBAR: Core AI + Temporal Logs (Desktop Only) - Protected in Guest Mode */}
        <div className="hidden md:flex col-span-4 row-span-7 flex-col gap-4">
          {user ? (
            <>
              <GithubSyncPanel
                onUplink={handleUplink}
                isLinked={!!githubToken}
                subscriptionPlan={user?.subscriptionPlan || 'free'}
                usageCount={localUsageCount}
              />
              <TemporalLogs history={history} onRestore={restoreHistory} onClear={clearHistory} activeLogId={activeLogId} />
            </>
          ) : (
            <div className="h-full w-full bg-glass border border-glass rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 shadow-lg backdrop-blur-md relative overflow-hidden group">
              {/* Guest Placeholder */}
              <div className="absolute inset-0 bg-neon-cyan/5 -z-10 group-hover:bg-neon-cyan/10 transition-colors"></div>

              <div className="p-4 bg-[#0a0a1a] rounded-full border border-neon-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                <ReactorLogo className="w-10 h-10 text-neon-cyan" />
              </div>

              <div className="space-y-2">
                <h3 className="text-neon-cyan font-bold tracking-widest text-sm">GUEST MODE ACTIVE</h3>
                <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                  Advanced features like Cloud Sync, History Tracking, and Neural Uplink are disabled.
                </p>
              </div>

              <a href="/login" className="px-6 py-2 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan text-xs font-bold rounded-lg hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all">
                AUTHENTICATE
              </a>

              {/* Decorative scanline */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-neon-cyan/30 animate-scanline"></div>
            </div>
          )}
        </div>

        {/* HOLO TERMINAL (Bottom) */}
        <div className="w-full h-[30vh] md:h-auto md:col-span-8 md:row-span-3 min-h-0 relative z-20 order-3 md:order-none mt-4 md:mt-0">
          <HoloTerminal output={output} input={input} isError={isError} onClear={clearConsole} />
        </div>

        {/* CONTROL DECK (Bottom Right) */}
        <div className="w-full md:col-span-4 md:row-span-2 flex items-center justify-center order-4 md:order-none py-4 md:py-0">
          <ControlDeck
            onRun={runCode}
            onClear={clearConsole}
            isThinking={isThinking || loading}
            onHoverChange={setIgnitionHover}
          />
        </div>


        {/* AI CHAT ASSISTANT OVERLAY */}
        <ChatAssistant language={language} onInsertCode={handleInsertCode} />

      </div>
    </div>
  );
}

export default UserDashboard;
