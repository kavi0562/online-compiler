import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Trash2 } from 'lucide-react';

const ControlDeck = ({ onRun, onClear, isThinking, onHoverChange }) => {
    return (
        <div className="relative flex items-center justify-center gap-8 p-4 z-20">
            {/* Base Plate */}
            <div className="absolute inset-0 bg-panel border-t border-glass backdrop-blur-md rounded-t-[40px] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"></div>

            {/* Left Side: Cache Status */}
            <div className="relative z-10 hidden sm:flex flex-col items-center">
                <span className="text-[10px] text-gray-500 tracking-widest">CACHE MEMORY</span>
                <button
                    onClick={onClear}
                    className="flex items-center gap-2 px-3 py-1 mt-1 border border-[#30363d] rounded-lg
                             text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest text-[10px]"
                >
                    <Trash2 size={10} /> PURGE
                </button>
            </div>

            {/* Ignition Switch (Primary) */}
            <div className="relative z-10 group">
                <motion.button
                    onClick={onRun}
                    onMouseEnter={() => onHoverChange && onHoverChange(true)}
                    onMouseLeave={() => onHoverChange && onHoverChange(false)}
                    disabled={isThinking}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-48 h-12 flex items-center justify-center gap-3 
                        ${isThinking ? 'bg-gray-800' : 'bg-[#00f3ff10]'} 
                        border border-neon-cyan/50 text-neon-cyan font-bold tracking-[0.2em]
                        rounded-full overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.2)]
                        group-hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all`}
                >
                    {/* Background Sweep Animation */}
                    <div className="absolute inset-0 bg-neon-cyan/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

                    {isThinking ? (
                        <>
                            <Zap size={18} className="animate-flicker" />
                            <span>INITIALIZING...</span>
                        </>
                    ) : (
                        <>
                            <Play size={18} fill="currentColor" />
                            <span>IGNITE</span>
                        </>
                    )}
                </motion.button>

                {/* Decorative Elements under switch */}
                <div className="flex justify-center gap-1 mt-1">
                    <div className="w-16 h-1 bg-neon-cyan/30 rounded-full"></div>
                    <div className="w-2 h-1 bg-neon-magenta/50 rounded-full"></div>
                </div>
            </div>

            {/* Right Side: System Status (Restored) */}
            <div className="relative z-10 hidden sm:flex flex-col items-center">
                <span className="text-[10px] text-gray-500 tracking-widest">SYSTEM STATUS</span>
                <span className="text-xs text-neon-green flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
                    OPTIMAL
                </span>
            </div>

        </div>
    );
};

export default ControlDeck;
