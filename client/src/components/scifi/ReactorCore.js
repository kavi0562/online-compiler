import React from 'react';
import Editor from "@monaco-editor/react";
import { Hexagon } from 'lucide-react';

const ReactorCore = ({ code, language, onChange, isError, isThinking, ignitionHover }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Outer Hexagonal Frame (Simulated with rotating borders/glow) */}
            <div className={`absolute inset-0 border-2 ${isError ? 'border-neon-red' : 'border-[#00f3ff40]'} 
                rounded-[30px] shadow-[0_0_50px_rgba(0,243,255,0.1)] transition-all duration-500`}>
                <div className="absolute inset-0 bg-panel opacity-80 backdrop-blur-md rounded-[28px] -z-10"></div>
            </div>

            {/* Rotating Reactor Ring */}
            <div className={`absolute inset-[-10px] border border-dashed ${isError ? 'border-neon-red' : 'border-neon-cyan'} 
                rounded-[40px] opacity-30 animate-rotate-slow pointer-events-none`}></div>

            {/* Inner Core (Editor) */}
            <div className="relative w-full h-full z-10 flex flex-col overflow-hidden rounded-2xl bg-[#050510] border border-[#30363d]">
                {/* Header for Core */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a1a] border-b border-[#30363d]">
                    <div className="flex items-center gap-2 text-neon-cyan">
                        <Hexagon size={16} className="animate-pulse" />
                        <span className="text-xs tracking-[0.2em] font-bold">REACTOR CORE // MAIN.SOURCE</span>
                    </div>
                    {isThinking && <span className="text-xs text-neon-magenta animate-flicker">PROCESSING...</span>}
                    {isError && <span className="text-xs text-neon-red animate-flicker">CRITICAL INSTABILITY</span>}
                </div>

                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={onChange}
                    options={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: 14,
                        lineHeight: 24,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        automaticLayout: true,
                        cursorBlinking: "phase",
                        smoothScrolling: true,
                        renderLineHighlight: "none",
                        guides: { indentation: false },
                    }}
                />

                {/* Core Unstable Overlay (Red Flash on Error) */}
                {isError && (
                    <div className="absolute inset-0 bg-red-500/10 pointer-events-none animate-pulse z-20 mix-blend-overlay"></div>
                )}
            </div>
        </div>
    );
};

export default ReactorCore;
