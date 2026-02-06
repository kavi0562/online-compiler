import React, { useState } from 'react';
import { Github, UploadCloud, Wifi } from 'lucide-react';

const GithubSyncPanel = ({
    onUplink,
    isLinked = true,
    subscriptionPlan = 'free',
    usageCount = 0,
    onConnectGithub,
    userRole,
    repo,
    onRepoChange,
    isAutoPushEnabled,
    onToggleAutoPush
}) => {
    const [message, setMessage] = useState('');
    const [isUplinking, setIsUplinking] = useState(false);

    const isAdmin = userRole === 'admin';

    const isDisabled = isUplinking || !isLinked; // Removed trial expiry check

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
                        GITHUB SYNC
                    </span>
                    {/* Trial Badge Removed */}
                    {/* {!isAdmin && (subscriptionPlan === 'free') && (
                        <span className={`ml-2 px-1.5 py-0.5 text-[8px] border rounded font-mono ${usageCount >= 3 ? 'bg-red-500/10 text-red-500 border-red-500/50' : 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50'}`}>
                            {usageCount >= 3 ? "TRIAL EXPIRED" : `TRIAL: ${usageCount}/3`}
                        </span>
                    )} */}
                    {isAdmin && (
                        <span className="ml-2 px-1.5 py-0.5 text-[8px] border rounded font-mono bg-neon-magenta/10 text-neon-magenta border-neon-magenta/50">
                            ADMIN_UNLIMITED
                        </span>
                    )}
                </div>
                {isLinked ? (
                    <div className="flex items-center gap-1">
                        <span className="text-[9px] text-neon-green font-mono">LINK_ESTABLISHED</span>
                        <Wifi size={10} className="text-neon-green animate-pulse" />
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <span className="text-[9px] text-red-500 font-mono">DISCONNECTED</span>
                        <Wifi size={10} className="text-red-500 opacity-50" />
                    </div>
                )}
            </div>

            {/* Content or Auth Overlay */}
            {!isLinked ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050510]/95 backdrop-blur-sm p-4 text-center">
                    <Github size={32} className="text-gray-500 mb-2" />
                    <h3 className="text-neon-cyan font-bold tracking-widest text-xs mb-1">AUTHENTICATION REQUIRED</h3>
                    <p className="text-[9px] text-gray-400 font-mono mb-3">
                        To utilize Neural Uplink (Sync), you must authenticate with valid GitHub Credentials.
                    </p>
                    <button onClick={onConnectGithub} className="px-4 py-2 bg-gray-800 border border-gray-600 rounded text-[10px] font-bold text-white hover:bg-gray-700 hover:border-gray-500 transition-all cursor-pointer">
                        CONNECT GITHUB ACCOUNT
                    </button>
                </div>
            ) : null}

            {/* Inputs & Controls Grid */}
            <div className={`grid grid-cols-2 gap-4 relative z-10 w-full ${!isLinked ? 'opacity-20 pointer-events-none' : ''}`}>

                {/* Left Column: Inputs */}
                <div className="flex flex-col gap-y-4">
                    <div className="relative w-full">
                        <span className="absolute top-1.5 left-2 text-[9px] text-gray-500 font-mono">TARGET_REPO</span>
                        <input
                            type="text"
                            value={repo}
                            onChange={(e) => onRepoChange(e.target.value)}
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

                {/* Right Column: Actions */}
                <div className="flex flex-col gap-y-4 justify-end">
                    {/* Auto-Push Toggle */}
                    <div className="flex items-center justify-between bg-[#050510]/40 p-2 rounded-lg border border-[#30363d] h-[48px]">
                        <div className="flex flex-col justify-center">
                            <span className="text-[10px] text-neon-cyan/80 font-bold tracking-wider">AUTO-PUSH</span>
                            <span className="text-[8px] text-gray-500">Sync on run</span>
                        </div>

                        <button
                            onClick={() => onToggleAutoPush(!isAutoPushEnabled)}
                            className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isAutoPushEnabled ? 'bg-neon-cyan/20 border border-neon-cyan' : 'bg-gray-800 border border-gray-600'}`}
                        >
                            <div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all duration-300 ${isAutoPushEnabled ? 'left-[18px] bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,0.8)]' : 'left-0.5 bg-gray-500'}`}></div>
                        </button>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleUplink}
                        disabled={isDisabled || !repo || !message}
                        className={`w-full h-[48px] rounded-lg font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all
                            ${isDisabled
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
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
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(0,243,255,0.1)_25%,rgba(0,243,255,0.1)_50%,transparent_50%,transparent_75%,rgba(0,243,255,0.1)_75%,rgba(0,243,255,0.1)_100%)] bg-[length:10px_10px]"></div>
        </div>
    );
};

export default GithubSyncPanel;
