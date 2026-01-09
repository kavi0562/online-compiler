import React from 'react';
import { Brain, AlertTriangle, CheckCircle2 } from 'lucide-react';

const CoreAiPanel = ({ isError, errorMessage, isThinking }) => {
    return (
        <div className="flex-1 bg-glass border border-glass rounded-2xl p-4 flex flex-col shadow-lg relative overflow-hidden group">

            {/* Header */}
            <div className="flex items-center gap-2 mb-3 relative z-10">
                <div className={`p-1.5 rounded-lg border ${isError ? 'border-neon-red bg-neon-red/10' : 'border-neon-cyan bg-neon-cyan/10'}`}>
                    <Brain size={16} className={`${isError ? 'text-neon-red' : 'text-neon-cyan'} ${isThinking ? 'animate-pulse' : ''}`} />
                </div>
                <span className={`text-[10px] font-bold tracking-widest ${isError ? 'text-neon-red' : 'text-neon-cyan'}`}>
                    CORE_AI // NEURAL_LINK
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative rounded-xl bg-[#050510]/50 border border-[#30363d] p-3 overflow-hidden">
                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[length:100%_4px]"></div>

                <div className="relative z-10 h-full flex flex-col justify-center">
                    {isThinking ? (
                        <div className="space-y-2">
                            <div className="text-neon-cyan text-xs font-mono animate-pulse">>> ANALYSING_SYNTAX...</div>
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-neon-cyan w-full animate-[scanline_1s_linear_infinite]"></div>
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 text-neon-red text-[10px] font-bold tracking-wider">
                                <AlertTriangle size={12} /> CRITICAL ERROR DETECTED
                            </div>
                            <div className="text-gray-400 text-[10px] font-mono leading-relaxed border-l-2 border-neon-red pl-2">
                                {errorMessage || "Unknown exception in runtime."}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1 text-gray-500">
                            <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider opacity-60">
                                <CheckCircle2 size={12} /> SYSTEM IDLE
                            </div>
                            <div className="text-[10px] font-mono leading-relaxed opacity-50">
                                 >> Awaiting code execution for analysis...
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoreAiPanel;
