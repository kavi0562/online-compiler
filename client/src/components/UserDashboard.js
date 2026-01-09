import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ThinkingLoader from "./ThinkingLoader";
import TimelineSidebar from "./TimelineSidebar";
import StatsWidget from "./StatsWidget";

const BOILERPLATES = {
  python: 'print("Hello from Python!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}',
  javascript: 'console.log("Hello from JavaScript!");',
  typescript: 'console.log("Hello from TypeScript!");',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}',
  rust: 'fn main() {\n    println!("Hello from Rust!");\n}',
  // ... (keeping other boilerplates if needed, can expand later)
};

const THEMES = {
  default: { name: "Default (Dark)", bg: "#0d1117", border: "#30363d", accent: "#58a6ff" },
  debug: { name: "🧠 Debug Mode (Blue)", bg: "#0a192f", border: "#172a45", accent: "#64ffda" },
  speed: { name: "🔥 Speed Mode (Red)", bg: "#1a0505", border: "#450a0a", accent: "#ff4d4d" },
  calm: { name: "🧘 Calm Mode (Green)", bg: "#051a10", border: "#0a4523", accent: "#2ea043" },
};

function UserDashboard() {
  const navigate = useNavigate();
  const [code, setCode] = useState(BOILERPLATES["python"] || "");
  const [language, setLanguage] = useState("python");
  const [languages, setLanguages] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState(null);

  // UI UX States
  const [focusMode, setFocusMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("default");
  const [refreshStats, setRefreshStats] = useState(0);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await axios.get("http://localhost:5051/api/compiler/languages");
      setLanguages(res.data);
    } catch (err) {
      console.error("Failed to fetch languages", err);
      setError("Failed to load languages. Is backend running on port 5051?");
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang] || `// Start coding in ${newLang}...`);
  };

  const runCode = async () => {
    setIsThinking(true);
    // ThinkingLoader handled via UI toggle, execution happens after delay/concurrently
    // For demo purposes, we wait for visual effect, but in reality we can start request
  };

  const executeCodeActually = async () => {
    setLoading(true);
    setOutput("");
    setIsThinking(false);

    try {
      const res = await axios.post(
        "http://localhost:5051/api/compiler/run",
        { code, language, input },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      let result = res.data.output;

      // 💡 Smart Errors Logic
      if (result.includes("Segmentation fault")) {
        result += "\n\n💡 Hint: You are trying to access memory that doesn't belong to you. Check array indices or pointers.";
      } else if (result.includes("Time Limit Exceeded") || result.includes("timed out")) {
        result += "\n\n💡 Hint: Infinite loop suspected. Check your loops and exit conditions.";
      }

      setOutput(result);
      setRefreshStats(prev => prev + 1); // Trigger sidebar refresh

    } catch (err) {
      setOutput("Error running code");
    } finally {
      setLoading(false);
    }
  };

  const themeStyle = THEMES[currentTheme];

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      backgroundColor: themeStyle.bg,
      color: themeStyle.accent
    }}>

      {/* LEFT: Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: focusMode ? "0" : "20px" }}>

        {/* Header - Hidden in Focus Mode */}
        {!focusMode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "20px" }}>
            <h2 style={{ margin: 0, color: "#fff" }}>User Dashboard</h2>

            <div style={{ display: "flex", gap: "10px" }}>
              <select
                onChange={(e) => setCurrentTheme(e.target.value)}
                style={{ background: "#161b22", color: "#fff", border: "1px solid #30363d", borderRadius: "4px" }}
              >
                {Object.keys(THEMES).map(t => <option key={t} value={t}>{THEMES[t].name}</option>)}
              </select>

              <button onClick={() => setFocusMode(true)}>🧘 Focus Mode</button>
              <button onClick={() => navigate('/history')}>📜 History</button>
            </div>
          </div>
        )}

        {/* Focus Mode Exit Button */}
        {focusMode && (
          <button
            onClick={() => setFocusMode(false)}
            style={{ position: "absolute", top: "10px", right: "10px", zIndex: 1000, opacity: 0.5 }}
          >
            Exit Focus
          </button>
        )}

        {/* Editor Area */}
        <div style={{ display: "flex", gap: "20px", flex: 1, position: "relative" }}>

          {/* Code Editor */}
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            {!focusMode && (
              <LanguageSelector
                languages={languages}
                selected={language}
                onSelect={handleLanguageChange}
              />
            )}

            <div style={{ flex: 1, border: `1px solid ${themeStyle.border}`, marginTop: "10px", borderRadius: "8px", overflow: "hidden" }}>
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  padding: { top: 20 }
                }}
              />
            </div>
          </div>

          {/* Input & Output Column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Input */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <h4 style={{ margin: "0 0 5px 0", color: "#8b949e" }}>Input</h4>
              <textarea
                style={{
                  flex: 1,
                  background: "#161b22",
                  color: "#fff",
                  border: `1px solid ${themeStyle.border}`,
                  borderRadius: "8px",
                  resize: "none"
                }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Standard input..."
              />
            </div>

            {/* Output or Thinking */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              <h4 style={{ margin: "0 0 5px 0", color: "#8b949e" }}>Output</h4>

              {isThinking ? (
                <ThinkingLoader onComplete={executeCodeActually} />
              ) : (
                <pre style={{
                  flex: 1,
                  background: "#0d1117",
                  color: output.includes("Error") ? "#ff6b6b" : "#7ee787",
                  border: `1px solid ${themeStyle.border}`,
                  padding: "10px",
                  borderRadius: "8px",
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  overflow: "auto"
                }}>
                  {output || "// Output will appear here"}
                </pre>
              )}

              <button
                onClick={runCode}
                disabled={loading || isThinking}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "12px",
                  fontSize: "16px",
                  background: isThinking ? "#333" : "#238636"
                }}
              >
                {isThinking ? "Thinking..." : "▶ Run Code"}
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT: Timeline Sidebar (Hidden in Focus Mode) */}
      {!focusMode && (
        <div style={{ width: "250px", borderLeft: `1px solid ${themeStyle.border}` }}>
          <TimelineSidebar
            refreshTrigger={refreshStats}
            onSelect={(item) => {
              setCode(item.code);
              setLanguage(item.language);
              setOutput(item.output);
            }}
          />
          <div style={{ padding: "0 15px 15px 15px" }}>
            <StatsWidget refreshTrigger={refreshStats} />
          </div>
        </div>
      )}

    </div>
  );
}

export default UserDashboard;
