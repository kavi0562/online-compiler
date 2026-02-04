import React from 'react';
import { History, FileCode, Clock, RotateCcw, Trash2 } from 'lucide-react';

const TemporalLogs = ({ history, onRestore, onClear, onDelete, onRefresh, activeLogId, user, onConnectGithub }) => {
    return (
        <div className="flex-1 h-full bg-glass border border-glass rounded-2xl p-4 flex flex-col shadow-lg min-h-0 relative overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <History size={14} className="text-neon-magenta" />
                    <span className="text-[10px] font-bold tracking-widest text-gray-300">
                        TEMPORAL_LOGS
                    </span>
                </div>
                {user && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRefresh}
                            className="text-[9px] text-neon-cyan/70 hover:text-neon-cyan flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                            title="Refresh History"
                        >
                            <RotateCcw size={10} /> REFRESH
                        </button>
                        {history.length > 0 && (
                            <button
                                onClick={onClear}
                                className="text-[9px] text-red-400 hover:text-red-300 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={10} /> CLEAR
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* List */}
            {!user ? (
                <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-[#050510]/95 backdrop-blur-sm p-4 text-center rounded-lg border border-[#30363d]/50 mx-1 mb-1">
                    <Clock size={32} className="text-gray-500 mb-2" />
                    <h3 className="text-neon-cyan font-bold tracking-widest text-xs mb-1">AUTHENTICATION REQUIRED</h3>
                    <p className="text-[9px] text-gray-400 font-mono mb-3">
                        To access Temporal Logs (History), you must authenticate with valid Credentials.
                    </p>
                    <button onClick={onConnectGithub} className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-[10px] font-bold text-white hover:bg-gray-700 hover:border-gray-500 transition-all cursor-pointer">
                        LOGIN / CONNECT
                    </button>

                    {/* Background Decoration to match Github Panel */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(0,243,255,0.1)_25%,rgba(0,243,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,243,255,0.1)_75%,rgba(0,243,255,0.1)_100%)] bg-[length:10px_10px] z-0"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2 relative">
                    {history.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2 opacity-50">
                            <Clock size={20} />
                            <span className="text-[10px] font-mono">NO_DATA_LOGGED</span>
                        </div>
                    ) : (
                        history.map((log) => (
                            <div
                                key={log.id}
                                onClick={() => onRestore(log)}
                                className={`w-full group relative flex items-center justify-between p-2 rounded-lg border transition-all text-left overflow-hidden cursor-pointer
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

                                    {/* Actions (Visible on Hover) */}
                                    <div className={`hidden group-hover:flex absolute left-0 bg-[#050510] rounded-full p-1 gap-2 border border-neon-cyan/50 animate-in fade-in zoom-in duration-200 items-center z-20`}>
                                        <RotateCcw size={12} className="text-neon-cyan" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm("PERMANENT DELETION WARNING: This log will be lost in the void forever. Confirm deletion?")) {
                                                    onDelete(log.id);
                                                }
                                            }}
                                            className="hover:scale-125 transition-transform"
                                            title="Delete Log"
                                        >
                                            <Trash2 size={12} className="text-red-400 hover:text-red-200" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col group-hover:translate-x-12 transition-transform duration-300">
                                        <span className={`text-[10px] font-bold truncate max-w-[100px] mb-0.5 ${activeLogId === log.id ? 'text-neon-cyan' : 'text-gray-200'}`}>
                                            {log.description || "Quick Run"}
                                        </span>
                                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-mono">
                                            <span className="flex items-center gap-1 uppercase">
                                                <FileCode size={8} /> {log.language}
                                            </span>
                                            <span>•</span>
                                            <span>{log.timestamp}</span>
                                        </div>
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
                            </div>
                        ))
                    )}
                </div>
            )}

        </div>
    );
};

export default TemporalLogs;
