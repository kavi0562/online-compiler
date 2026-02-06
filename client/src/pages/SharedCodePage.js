import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { Copy, Check, ExternalLink } from "lucide-react";

// Sci-Fi Viewer Setup
const SharedCodePage = () => {
    const { id } = useParams();
    const [code, setCode] = useState("// Loading transmission from deep space...");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const [language, setLanguage] = useState("javascript");

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5051";
                const res = await axios.get(`${apiBase}/api/share/${id}`);
                setCode(res.data.sourceCode);
                if (res.data.language) setLanguage(res.data.language);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load code:", err);
                setError("TRANSMISSION_LOST: 404_NOT_FOUND");
                setLoading(false);
            }
        };
        fetchCode();
    }, [id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-neon-cyan font-mono animate-pulse">
                &gt;&gt; RECEIVING_TRANSMISSION...
            </div>
        );
    }



    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">ERROR</h1>
                    <p>{error}</p>
                    <Link to="/" className="mt-8 inline-block px-4 py-2 border border-red-500/50 hover:bg-red-500/10 rounded">
                        RETURN_TO_BASE
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black text-gray-200 font-mono flex flex-col relative overflow-hidden pt-24">
            {/* Header */}
            <header className="border-b border-gray-800 p-4 flex items-center justify-between z-10 bg-black/80 backdrop-blur shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
                    <h1 className="text-neon-cyan font-bold tracking-[0.2em] text-sm">SECURE_CODE_VIEWER</h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-1.5 border border-gray-700 hover:border-neon-cyan hover:text-neon-cyan rounded transition-all text-xs"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        {copied ? "COPIED" : "COPY_CODE"}
                    </button>
                    <Link
                        to="/"
                        state={{ challengeCode: code, language: language }}
                        className="flex items-center gap-2 px-4 py-1.5 bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/20 rounded transition-all text-xs font-bold"
                    >
                        OPEN_COMPILER <ExternalLink size={14} />
                    </Link>
                </div>
            </header>

            {/* Editor */}
            <main className="flex-1 relative">
                <Editor
                    height="100%"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: "'Fira Code', monospace",
                        padding: { top: 20, bottom: 20 },
                        cursorStyle: "line"
                    }}
                />
            </main>
        </div>
    );
};

export default SharedCodePage;
