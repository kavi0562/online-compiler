import React, { useState } from 'react';
import { Github, UploadCloud, Wifi } from 'lucide-react';

const GithubSyncPanel = ({ onUplink, isLinked = true }) => {
    const [repo, setRepo] = useState('');
    const [message, setMessage] = useState('');
    const [isUplinking, setIsUplinking] = useState(false);

    const handleUplink = async () => {
        if (!repo || !message) return;
        setIsUplinking(true);
        await onUplink(repo, message);
        setIsUplinking(false);
        setMessage(''); // Clear message after send
    };

    return (
        <div className="bg-glass border border-glass rounded-2xl p-5 flex flex-col gap-y-4 shadow-lg relative overflow-visible h-auto max-h-min group">

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${isLinked ? 'border-neon-cyan bg-neon-cyan/10' : 'border-gray-700 bg-gray-800'}`}>
                        <Github size={16} className={isLinked ? 'text-neon-cyan' : 'text-gray-500'} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-neon-cyan">
                        NEURAL_UPLINK // GITHUB_SYNC
                    </span>
                </div>
                {isLinked && (
                    <div className="flex items-center gap-1">
                        <span className="text-[9px] text-neon-green font-mono">LINK_ESTABLISHED</span>
                        <Wifi size={10} className="text-neon-green animate-pulse" />
                    </div>
                )}
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-y-4 relative z-10 w-full">
                <div className="relative w-full">
                    <span className="absolute top-1.5 left-2 text-[9px] text-gray-500 font-mono">TARGET_REPO</span>
                    <input
                        type="text"
                        value={repo}
                        onChange={(e) => setRepo(e.target.value)}
                        className="w-full bg-[#050510]/60 border border-[#30363d] rounded-lg pt-5 pb-1.5 px-2 text-xs font-mono text-white placeholder-gray-700 focus:border-neon-cyan focus:outline-none transition-colors"
                        placeholder="username/repo-name"
                    />
                </div>
                <div className="relative w-full">
                    <span className="absolute top-1.5 left-2 text-[9px] text-gray-500 font-mono">COMMIT_MSG</span>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full bg-[#050510]/60 border border-[#30363d] rounded-lg pt-5 pb-1.5 px-2 text-xs font-mono text-white placeholder-gray-700 focus:border-neon-cyan focus:outline-none transition-colors"
                        placeholder="Initial Commit..."
                    />
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={handleUplink}
                disabled={isUplinking || !repo || !message}
                className={`w-full py-2.5 rounded-lg font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all
                    ${isUplinking
                        ? 'bg-neon-cyan/20 text-neon-cyan cursor-wait'
                        : 'bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/50 hover:border-neon-cyan text-neon-cyan hover:shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                    }`}
            >
                {isUplinking ? (
                    <>
                        <UploadCloud size={14} className="animate-bounce" /> UPLINKING...
                    </>
                ) : (
                    <>
                        <UploadCloud size={14} /> INITIATE UPLINK
                    </>
                )}
            </button>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(0,243,255,0.1)_25%,rgba(0,243,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,243,255,0.1)_75%,rgba(0,243,255,0.1)_100%)] bg-[length:10px_10px]"></div>
        </div>
    );
};

export default GithubSyncPanel;
