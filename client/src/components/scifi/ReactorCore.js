import React, { useRef, useEffect } from 'react';
import Editor from "@monaco-editor/react";
import { Hexagon, Maximize2, Minimize2 } from 'lucide-react';

const ReactorCore = ({ code, language, onChange, isError, isThinking, ignitionHover, isMaximized, onToggleMaximize }) => {
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    // Manual Layout Trigger on Resize/Maximize
    useEffect(() => {
        const handleResize = () => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        };

        // Add listener
        window.addEventListener('resize', handleResize);

        // Trigger layout update when maximized state changes
        // Use a small timeout to wait for CSS transitions if any
        const timer = setTimeout(() => {
            handleResize();
        }, 50);

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [isMaximized]);

    return (
        <div className={`relative w-full h-full flex items-center justify-center ${isMaximized ? 'p-0' : 'p-8'}`}>
            {/* Outer Hexagonal Frame (Hidden when maximized) */}
            {!isMaximized && (
                <>
                    <div className={`absolute inset-0 border-2 ${isError ? 'border-neon-red' : 'border-[#00f3ff40]'} 
                        rounded-[30px] shadow-[0_0_50px_rgba(0,243,255,0.1)] transition-all duration-500`}>
                        <div className="absolute inset-0 bg-panel opacity-80 backdrop-blur-md rounded-[28px] -z-10"></div>
                    </div>
                    {/* Rotating Reactor Ring */}
                    <div className={`absolute inset-[-10px] border border-dashed ${isError ? 'border-neon-red' : 'border-neon-cyan'} 
                        rounded-[40px] opacity-30 animate-rotate-slow pointer-events-none`}></div>
                </>
            )}

            {/* Inner Core (Editor) */}
            <div className={`relative w-full z-10 flex flex-col overflow-hidden bg-[#050510] border border-[#30363d]
                ${isMaximized ? 'h-screen fixed inset-0 z-[999999] rounded-none' : 'h-full rounded-2xl'}`}>

                {/* Header for Core */}
                <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a1a] border-b border-[#30363d]">
                    <div className="flex items-center gap-2 text-neon-cyan">
                        <Hexagon size={16} className="animate-pulse" />
                        <span className="text-xs tracking-[0.2em] font-bold">COMPILER</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {isThinking && <span className="text-xs text-neon-magenta animate-flicker">PROCESSING...</span>}
                        {isError && <span className="text-xs text-neon-red animate-flicker">CRITICAL INSTABILITY</span>}

                        <button
                            onClick={onToggleMaximize}
                            className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                            title={isMaximized ? "Minimize" : "Maximize"}
                        >
                            {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>

                <Editor
                    height="100%"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    options={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: isMaximized ? 16 : 14, // Larger font when maximized
                        lineHeight: 24,
                        minimap: { enabled: isMaximized }, // Enable minimap when maximized
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        automaticLayout: false, // DISABLED to prevent ResizeObserver loop errors
                        cursorBlinking: "phase",
                        smoothScrolling: true,
                        renderLineHighlight: "none",
                        guides: { indentation: true },
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
