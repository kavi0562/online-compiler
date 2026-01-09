import { useState, useEffect } from "react";
import axios from "axios";
import ReactorCore from "./scifi/ReactorCore";
import ControlDeck from "./scifi/ControlDeck";
import HoloTerminal from "./scifi/HoloTerminal";
import LanguageSelector from "./LanguageSelector";
import { LayoutTemplate, Cpu, Database, Activity } from "lucide-react";

// Boilerplates
const BOILERPLATES = {
  python: 'print("Hello from the Void!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Systems Operational.");\n    }\n}',
  javascript: 'console.log("Reactor Core Online...");',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Energy Levels Optimal." << std::endl;\n    return 0;\n}',
};

function UserDashboard() {
  const [code, setCode] = useState(BOILERPLATES["python"] || "");
  const [language, setLanguage] = useState("python");
  const [languages, setLanguages] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isError, setIsError] = useState(false);
  const [ignitionHover, setIgnitionHover] = useState(false);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const res = await axios.get("http://localhost:5051/api/compiler/languages");
      setLanguages(res.data);
    } catch (err) {
      setLanguages([
        { key: "python", name: "Python", version: "3.10" },
        { key: "javascript", name: "JavaScript", version: "Node 18" },
        { key: "java", name: "Java", version: "OpenJDK 17" },
        { key: "cpp", name: "C++", version: "GCC 11" },
      ]);
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(BOILERPLATES[newLang] || `// Initialize ${newLang} module...`);
    setIsError(false);
    setOutput("");
  };

  const runCode = async () => {
    setIsThinking(true);
    setIsError(false);
    setTimeout(() => executeCodeActually(), 2000); // Effect delay
  };

  const executeCodeActually = async () => {
    setLoading(true);
    setIsThinking(false);
    try {
      const res = await axios.post(
        "http://localhost:5051/api/compiler/run",
        { code, language, input },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      let result = res.data.output;
      if (result.includes("Error") || result.includes("Exception") || result.includes("Traceback")) {
        setIsError(true);
      }
      setOutput(result);
    } catch (err) {
      setIsError(true);
      setOutput("CRITICAL FAILURE: Node Disconnected.\n" + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const clearConsole = () => {
    setOutput("");
    setInput("");
    setIsError(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-void font-tech text-gray-200">

      {/* Dynamic Starfield Background */}
      <div className="starfield-layer stars-sm"></div>
      <div className="starfield-layer stars-md"></div>

      {/* Bento Grid Layout */}
      <div className="h-full w-full p-6 grid grid-cols-12 grid-rows-12 gap-6 z-10 relative">

        {/* Header / Stats (Top Left) */}
        <div className="col-span-12 md:col-span-3 row-span-2 bg-glass border border-glass rounded-2xl p-4 flex items-center justify-between shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
              <Cpu className="text-neon-cyan" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white">REACTOR<span className="text-neon-cyan">.IO</span></h1>
              <span className="text-[10px] text-gray-400">SYSTEM STATUS: ONLINE</span>
            </div>
          </div>
        </div>

        {/* Language Selector (Top Middle) */}
        <div className="col-span-6 md:col-span-5 row-span-2 bg-glass border border-glass rounded-2xl p-4 flex flex-col justify-center shadow-lg relative group z-50">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-50 transition-opacity pointer-events-none">
            <Database size={40} className="text-neon-magenta" />
          </div>
          <span className="text-[10px] text-neon-magenta tracking-widest mb-1 font-bold">ACTIVE MODULE</span>
          <LanguageSelector languages={languages} selected={language} onSelect={handleLanguageChange} />
        </div>

        {/* Stdin (Top Right) */}
        <div className="col-span-6 md:col-span-4 row-span-4 bg-glass border border-glass rounded-2xl p-4 flex flex-col shadow-lg relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neon-cyan tracking-widest font-bold flex items-center gap-2">
              <LayoutTemplate size={12} /> INPUT_STREAM
            </span>
          </div>
          <textarea
            className="flex-1 bg-[#050510]/50 bg-grid border border-[#30363d] rounded-xl p-3 text-xs font-mono text-gray-300 focus:border-neon-cyan focus:outline-none resize-none transition-all placeholder-gray-600"
            placeholder="// Awaiting input data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* MAIN REACTOR CORE (Center) */}
        <div className="col-span-12 md:col-span-8 row-span-7 relative">
          <div className={`absolute inset-0 bg-glass/20 border ${ignitionHover ? 'border-neon-cyan shadow-[0_0_50px_rgba(0,243,255,0.4)]' : 'border-neon-cyan/20'} rounded-[30px] -z-10 blur-xl transition-all duration-500`}></div>
          <ReactorCore
            code={code}
            language={language}
            onChange={setCode}
            isError={isError}
            isThinking={isThinking}
            ignitionHover={ignitionHover}
          />
          {/* Connection Beam to Terminal */}
          {!isThinking && output && !isError && (
            <div className="absolute bottom-[-20px] left-1/2 w-1 h-20 bg-gradient-to-b from-neon-cyan to-transparent animate-pulse z-0 transform -translate-x-1/2"></div>
          )}
        </div>

        {/* System Logistics / Decor (Right Middle) */}
        <div className="hidden md:flex col-span-4 row-span-3 bg-glass border border-glass rounded-2xl p-4 flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px]">CPU LOAD</span>
            <Activity size={14} className="animate-pulse text-neon-green" />
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-neon-green w-3/4 animate-flicker"></div>
          </div>
          <div className="flex items-center justify-between text-gray-400 mt-2">
            <span className="text-[10px]">MEMORY</span>
            <span className="text-[10px] text-neon-cyan">42%</span>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-neon-cyan w-1/3 animate-pulse"></div>
          </div>
        </div>

        {/* HOLO TERMINAL (Bottom) */}
        <div className="col-span-12 md:col-span-8 row-span-3 min-h-0 relative z-20">
          <HoloTerminal output={output} isError={isError} />
        </div>

        {/* CONTROL DECK (Bottom Right) */}
        <div className="col-span-12 md:col-span-4 row-span-2 flex items-center justify-center">
          <ControlDeck
            onRun={runCode}
            onClear={clearConsole}
            isThinking={isThinking || loading}
            onHoverChange={setIgnitionHover}
          />
        </div>

      </div>
    </div>
  );
}

export default UserDashboard;
