import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Zap } from "lucide-react";

const LanguageSelector = ({ languages, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Find current language object
    const selectedLang = languages.find((lang) => lang.key === selected) || {};

    return (
        <div className="relative w-full" ref={wrapperRef}>

            {/* Sci-Fi Header */}
            <div className="flex items-center justify-between mb-2">
                {/* Title handled by parent for layout flexibility, but included here optionally if standalone usage needed */}
            </div>

            {/* Dropdown Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 
                   bg-[#0a0a1a]/80 border ${isOpen ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'border-[#30363d]'} 
                   rounded-xl backdrop-blur-md transition-all duration-300 hover:border-neon-cyan/50 group`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors`}>
                        <Zap size={14} className="text-neon-cyan" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 tracking-widest font-bold">CURRENT_MODULE</span>
                        <span className="text-sm font-bold text-white tracking-wide">{selectedLang.name || "Select..."}</span>
                    </div>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-neon-cyan transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Animated Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                    {/* Glassmorphic Container */}
                    <div className="bg-[#050510]/95 border border-neon-cyan/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] 
                          backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Decorative Tech Header */}
                        <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan opacity-50"></div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang.key}
                                    onClick={() => {
                                        onSelect(lang.key);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-all
                                ${selected === lang.key
                                            ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs opacity-50">0{languages.indexOf(lang) + 1}</span>
                                        <span className="font-bold tracking-wide">{lang.name}</span>
                                    </div>

                                    {selected === lang.key && <Check size={14} className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
