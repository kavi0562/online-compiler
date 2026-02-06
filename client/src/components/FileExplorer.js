import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Clock, Search, Files, MoreVertical } from 'lucide-react';

const FileExplorer = ({
    currentLanguage,
    history,
    onSelectHistory
}) => {
    const [isFilesOpen, setIsFilesOpen] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#252526] text-gray-300 overflow-hidden">
            {/* Top Icons Toolbar */}
            <div className="h-8 flex items-center px-2 gap-2 border-b border-[#3c3c3c] shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Explorer</span>
                <div className="flex-1" />
                <button className="p-1 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white" title="New File"><Files size={12} /></button>
                <button className="p-1 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white" title="Search"><Search size={12} /></button>
                <button className="p-1 hover:bg-[#3e3e42] rounded text-gray-400 hover:text-white"><MoreVertical size={12} /></button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
                {/* Project Item */}
                <div className="mb-4">
                    <div
                        onClick={() => setIsFilesOpen(!isFilesOpen)}
                        className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] p-1 rounded text-gray-300 select-none"
                    >
                        {isFilesOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span className="font-bold text-xs uppercase tracking-wide">PROJECT</span>
                    </div>
                    {isFilesOpen && (
                        <div className="ml-2">
                            <div className="flex items-center gap-2 py-1 px-4 hover:bg-[#2a2d2e] cursor-pointer text-blue-400 border-l border-transparent hover:border-gray-600">
                                <FileCode size={14} />
                                <span className="text-sm">main.{getExtension(currentLanguage)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Item */}
                <div className="mb-4">
                    <div
                        onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                        className="flex items-center gap-1 cursor-pointer hover:bg-[#2a2d2e] p-1 rounded text-gray-300 select-none"
                    >
                        {isHistoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        <span className="font-bold text-xs uppercase tracking-wide">TIMELINE</span>
                    </div>
                    {isHistoryOpen && (
                        <div className="ml-2">
                            {history.length > 0 ? history.map((h, i) => (
                                <div
                                    key={i}
                                    onClick={() => onSelectHistory(h)}
                                    className="flex items-center gap-2 py-1 px-4 hover:bg-[#2a2d2e] text-gray-400 hover:text-white cursor-pointer text-xs"
                                >
                                    <Clock size={12} />
                                    <span className="truncate">{new Date(h.timestamp).toLocaleTimeString()}</span>
                                </div>
                            )) : (
                                <div className="px-4 py-1 text-xs text-gray-500 italic">No runs yet</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const getExtension = (lang) => {
    const map = {
        python: 'py',
        javascript: 'js',
        typescript: 'ts',
        java: 'java',
        c: 'c',
        cpp: 'cpp',
        go: 'go',
        rust: 'rs',
    };
    return map[lang] || 'txt';
};

export default FileExplorer;
