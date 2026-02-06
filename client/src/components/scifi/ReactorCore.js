import React, { useRef, useEffect, useState } from 'react';
import Editor from "@monaco-editor/react";
import { Hexagon, Maximize2, Minimize2, Trash2, Copy, Check, Play } from 'lucide-react';

import { Rnd } from 'react-rnd';

const ReactorCore = ({ code, language, onChange, isError, isThinking, ignitionHover, isMaximized, onToggleMaximize, onClear, onRun }) => {
    const editorRef = useRef(null);
    const containerRef = useRef(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        // Force layout check on mount to prevent blank editor
        setTimeout(() => {
            if (editor) editor.layout();
        }, 100);
    };

    const handleClear = () => {
        // onChange(''); // Handled by parent via onClear if provided, or we can keep it for safety but parent logic is cleaner
        if (onClear) {
            onClear();
        } else {
            onChange(''); // Fallback
        }

        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy keys', err);
        }
    };

    // Robust Layout Trigger using ResizeObserver
    useEffect(() => {
        const handleResize = () => {
            if (editorRef.current) {
                editorRef.current.layout();
            }
        };

        // Window resize fallback
        window.addEventListener('resize', handleResize);

        // Container Resize Observer
        let resizeObserver = null;
        if (containerRef.current) {
            resizeObserver = new ResizeObserver(() => {
                handleResize();
            });
            resizeObserver.observe(containerRef.current);
        }

        // Trigger layout update when maximized state changes
        const timer = setTimeout(() => {
            handleResize();
        }, 50);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) resizeObserver.disconnect();
            clearTimeout(timer);
        };
    }, [isMaximized]);

    // Inner Core Content (The Editor UI)
    const renderCoreContent = () => (
        <div ref={containerRef} className={`relative w-full h-full flex flex-col overflow-hidden bg-[#050510] border border-[#30363d]
            ${isMaximized ? 'rounded-2xl border-neon-cyan/50 shadow-[0_0_100px_rgba(0,0,0,0.9)]' : 'rounded-2xl'}`}>

            {/* Header for Core */}
            <div className={`flex items-center justify-between px-4 py-2 bg-[#0a0a1a] border-b border-[#30363d] ${isMaximized ? 'cursor-move' : ''} drag-handle`}>
                <div className="flex items-center gap-2 text-neon-cyan">
                    <Hexagon size={16} className="animate-pulse" />
                    <span className="text-xs tracking-[0.2em] font-bold">COMPILER</span>
                </div>

                <div className="flex items-center gap-4">
                    {isThinking && <span className="text-xs text-neon-magenta animate-flicker">PROCESSING...</span>}
                    {isError && <span className="text-xs text-neon-red animate-flicker">CRITICAL INSTABILITY</span>}

                    <button
                        onClick={onRun}
                        className="flex items-center gap-2 bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-black px-3 py-1 rounded transition-all font-bold text-xs border border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] mr-2"
                        title="Run Code"
                    >
                        <Play size={12} fill="currentColor" /> RUN
                    </button>

                    <button
                        onClick={handleCopy}
                        className="text-gray-400 hover:text-neon-cyan transition-colors p-1 rounded hover:bg-white/10"
                        title="Copy Code"
                    >
                        {isCopied ? <Check size={16} className="text-neon-green" /> : <Copy size={16} />}
                    </button>

                    <button
                        onClick={handleClear}
                        className="text-gray-400 hover:text-neon-red transition-colors p-1 rounded hover:bg-white/10"
                        title="Clear Code"
                    >
                        <Trash2 size={16} />
                    </button>

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
                    fontSize: isMaximized ? 17 : 14, // Slightly larger font when maximized
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
    );

    return (
        <>
            {/* 1. MAXIMIZED STATE (Resizable Portal) */}
            {isMaximized && (
                <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                    <Rnd
                        default={{
                            x: window.innerWidth * 0.1,
                            y: window.innerHeight * 0.1,
                            width: '80%',
                            height: '80%',
                        }}
                        minWidth={500}
                        minHeight={400}
                        bounds="window"
                        className="pointer-events-auto z-[70]"
                        dragHandleClassName="drag-handle"
                    >
                        {renderCoreContent()}
                    </Rnd>
                </div>
            )}

            {/* 2. NORMAL STATE (Embedded) */}
            {!isMaximized && (
                <div className="relative w-full h-full flex items-center justify-center p-8">
                    {/* Outer Hexagonal Frame */}
                    <div className={`absolute inset-0 border-2 ${isError ? 'border-neon-red' : 'border-[#00f3ff40]'} 
                        rounded-[30px] shadow-[0_0_50px_rgba(0,243,255,0.1)] transition-all duration-500`}>
                        <div className="absolute inset-0 bg-panel opacity-80 backdrop-blur-md rounded-[28px] -z-10"></div>
                    </div>
                    {/* Rotating Reactor Ring */}
                    <div className={`absolute inset-[-10px] border border-dashed ${isError ? 'border-neon-red' : 'border-neon-cyan'} 
                        rounded-[40px] opacity-30 animate-rotate-slow pointer-events-none`}></div>

                    {renderCoreContent()}
                </div>
            )}
        </>
    );
};

export default ReactorCore;

