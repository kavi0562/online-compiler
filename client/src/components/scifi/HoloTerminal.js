import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const HoloTerminal = ({ output, isError }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div className="relative h-full flex flex-col overflow-hidden rounded-b-[40px]">
            {/* Holographic Container */}
            <div className="absolute inset-0 bg-glass border-t border-glass shadow-[0_10px_30px_rgba(0,0,0,0.5)]"></div>

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,243,255,0.1) 50%, transparent 50%)',
                    backgroundSize: '100% 4px'
                }}
            ></div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-6 py-2 border-b border-glass bg-black/20">
                <div className="flex items-center gap-2 text-neon-cyan/70">
                    <Terminal size={14} />
                    <span className="text-[10px] tracking-[0.2em] font-bold">DATA STREAM // OUT</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-neon-cyan/50 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-neon-cyan/50 rounded-full animate-ping delay-75"></div>
                    <div className="w-1 h-1 bg-neon-cyan/50 rounded-full animate-ping delay-150"></div>
                </div>
            </div>

            {/* Terminal Content */}
            <div ref={scrollRef} className="relative z-10 flex-1 overflow-auto p-6 font-mono text-sm leading-relaxed custom-scrollbar bg-grid">
                {output ? (
                    <div className={`${isError ? 'text-neon-red' : 'text-neon-cyan'} shadow-glow`}>
                        {output.split('\n').map((line, i) => (
                            <div key={i} className="mb-1 opacity-90 hover:opacity-100 transition-opacity">
                                <span className="mr-2 opacity-50 select-none">›</span>
                                {line}
                            </div>
                        ))}
                        <div className="h-4 w-2 bg-neon-cyan animate-flicker inline-block align-middle ml-1"></div>
                    </div>
                ) : (
                    <div className="text-gray-600/50 italic flex flex-col items-center justify-center h-full">
                        <span className="animate-pulse">WAITING FOR INPUT STREAM...</span>
                    </div>
                )}
            </div>

            {/* Bottom Curved Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-neon-cyan/20 blur-md rounded-b-[40px]"></div>
        </div>
    );
};

export default HoloTerminal;
