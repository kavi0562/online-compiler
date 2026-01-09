import React from 'react';
import { History, FileCode, Clock, RotateCcw, Trash2 } from 'lucide-react';

const TemporalLogs = ({ history, onRestore, onClear, activeLogId }) => {
    return (
        <div className="flex-[1.5] bg-glass border border-glass rounded-2xl p-4 flex flex-col shadow-lg mt-6 min-h-0 relative overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <History size={14} className="text-neon-magenta" />
                    <span className="text-[10px] font-bold tracking-widest text-gray-300">
                        TEMPORAL_LOGS
                    </span>
                </div>
                {history.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-[9px] text-red-400 hover:text-red-300 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={10} /> CLEAR
                    </button>
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                {history.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-50">
                        <Clock size={20} />
                        <span className="text-[10px] font-mono">NO_DATA_LOGGED</span>
                    </div>
                ) : (
                    history.map((log) => (
                        <button
                            key={log.id}
                            onClick={() => onRestore(log)}
                            className={`w-full group relative flex items-center justify-between p-2 rounded-lg border transition-all text-left overflow-hidden
                                ${activeLogId === log.id
                                    ? 'bg-neon-cyan/5 border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                                    : 'bg-[#050510]/40 border-[#30363d] hover:border-neon-cyan hover:shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                                }`}
                        >
                            {/* Active/Hover Scanline */}
                            <div className={`absolute inset-0 bg-neon-cyan/5 transition-transform duration-500 pointer-events-none 
                                ${activeLogId === log.id ? 'translate-x-0 animate-pulse' : 'translate-x-[-100%] group-hover:translate-x-0'}`}>
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                {/* Status Dot */}
                                <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'success' ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.6)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,42,42,0.6)]'}`}></div>

                                {/* Restore Icon (Visible on Hover) or Active Indicator */}
                                <div className={`hidden group-hover:flex absolute left-0 bg-[#050510] rounded-full p-1 border border-neon-cyan/50 animate-in fade-in zoom-in duration-200`}>
                                    <RotateCcw size={12} className="text-neon-cyan" />
                                </div>

                                <div className="flex flex-col group-hover:translate-x-4 transition-transform duration-300">
                                    <span className={`text-[10px] font-bold transition-colors uppercase flex items-center gap-2 ${activeLogId === log.id ? 'text-neon-cyan' : 'text-gray-300 group-hover:text-neon-cyan'}`}>
                                        <FileCode size={10} className="text-gray-500" />
                                        {log.language}
                                    </span>
                                    <span className="text-[9px] text-gray-600 font-mono">
                                        {log.timestamp}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 relative z-10">
                                <span className={`text-[9px] font-mono border px-1 rounded transition-colors
                                     ${activeLogId === log.id
                                        ? 'border-neon-cyan/30 text-neon-cyan bg-neon-cyan/10'
                                        : 'text-gray-500 border-white/5 bg-black/20 group-hover:border-neon-cyan/30 group-hover:text-neon-cyan/80'
                                    }`}>
                                    {log.duration}s
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>

        </div>
    );
};

export default TemporalLogs;
