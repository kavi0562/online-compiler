import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Trash2, Copy } from 'lucide-react';

const HoloTerminal = ({ output, input, isError, onClear }) => {
    const scrollRef = useRef(null);
    const [mergedContent, setMergedContent] = useState([]);
    const [copied, setCopied] = useState(false);

    // Heuristic Logic to Merge Output and Input
    useEffect(() => {
        if (!output) {
            setMergedContent([]);
            return;
        }

        const lines = output.split('\n');
        const inputLines = input ? input.split('\n') : [];
        let inputIndex = 0;

        const merged = lines.map((line, index) => {
            // Check if line looks like a prompt (ends with : or ?)
            // And if we have input available to "answer" it
            const isPrompt = (line.trim().endsWith(':') || line.trim().endsWith('?')) && inputIndex < inputLines.length;

            if (isPrompt) {
                const answer = inputLines[inputIndex];
                inputIndex++;
                return { type: 'prompt', text: line, answer: answer };
            }
            return { type: 'line', text: line };
        });

        setMergedContent(merged);
    }, [output, input]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mergedContent]);

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl bg-[#050510] border border-glass shadow-[0_10px_30px_rgba(0,0,0,0.5)]">

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_1px]"></div>
            <div className="absolute inset-0 pointer-events-none z-20 animate-scanline opacity-5 bg-gradient-to-b from-transparent via-neon-cyan/10 to-transparent h-full w-full"></div>

            {/* Header */}
            <div className="relative z-30 flex items-center justify-between px-4 py-2 bg-[#0a0a1a] border-b border-[#30363d]">
                <div className="flex items-center gap-2 text-neon-cyan/80">
                    <Terminal size={14} />
                    <span className="text-[10px] tracking-[0.2em] font-bold font-mono">OUTPUT TERMINAL</span>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white"
                        title="Copy Output"
                    >
                        {copied ? <span className="text-[10px] text-neon-green font-bold">COPIED</span> : <Copy size={14} />}
                    </button>
                    <button
                        onClick={onClear}
                        className="p-1 hover:bg-red-500/20 rounded transition-colors text-gray-400 hover:text-red-400"
                        title="Clear Console"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-auto p-4 font-mono text-xs md:text-sm leading-relaxed custom-scrollbar bg-grid">
                {output ? (
                    <div className="text-gray-300">
                        {mergedContent.map((item, i) => (
                            <div key={i} className="mb-1 break-words">
                                {item.type === 'prompt' ? (
                                    <div className="flex flex-wrap">
                                        <span className="text-white font-bold mr-2">{item.text}</span>
                                        <span className="text-neon-green animate-pulse font-bold drop-shadow-[0_0_8px_rgba(0,255,65,0.8)]">{item.answer}</span>
                                    </div>
                                ) : (
                                    <div className={`${isError && item.text.toLowerCase().includes('error') ? 'text-neon-red' : 'text-neon-cyan'} opacity-90 hover:opacity-100 transition-opacity`}>
                                        <span className="mr-2 opacity-50 select-none text-gray-500">›</span>
                                        {item.text}
                                    </div>
                                )}
                            </div>
                        ))}
                        {/* Blinking Underscore Cursor */}
                        <span className="ml-1 inline-block w-2.5 h-4 bg-transparent border-b-2 border-neon-cyan animate-flicker align-sub"></span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600/50 italic">
                        <span className="animate-pulse">_WAITING_FOR_DATA_STREAM</span>
                    </div>
                )}
            </div>

            {/* Bottom Status Line */}
            <div className="relative z-30 px-4 py-1 bg-[#0a0a1a] border-t border-[#30363d] flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>Ln {mergedContent.length}, Col 1</span>
                <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></span>
                    {isError ? 'ERR' : 'OK'}
                </span>
            </div>
        </div>
    );
};

export default HoloTerminal;
