import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, Zap } from "lucide-react";

const LanguageSelector = ({ languages, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef(null);

    // Update portal position
    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 8, // 8px gap
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen]);

    // Close on click outside (Simulated for Portal)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (buttonRef.current && !buttonRef.current.contains(e.target) && !e.target.closest('.portal-dropdown')) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);


    const selectedLang = languages.find((lang) => lang.key === selected) || {};

    return (
        <div className="relative w-full">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 
                   bg-[#0a0a1a]/80 border ${isOpen ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'border-[#30363d]'} 
                   rounded-xl backdrop-blur-md transition-all duration-300 hover:border-neon-cyan/50 group`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-1 rounded bg-neon-cyan/10 group-hover:bg-neon-cyan/20 transition-colors`}>
                        <Zap size={14} className="text-neon-cyan" />
                    </div>
                    <div className="flex flex-col items-start text-left">
                        <span className="text-[10px] text-gray-500 tracking-widest font-bold">CURRENT_MODULE</span>
                        <span className="text-sm font-bold text-white tracking-wide truncate max-w-[100px] md:max-w-none">
                            {selectedLang.name || "Select..."}
                        </span>
                    </div>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-neon-cyan transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && createPortal(
                <div
                    className="portal-dropdown fixed z-[99999]"
                    style={{
                        top: position.top,
                        left: position.left,
                        width: position.width,
                        maxHeight: '400px' // Taller max-height for better visibility
                    }}
                >
                    <div className="bg-[#050510]/95 border border-neon-cyan/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] 
                          backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Decorative Tech Header */}
                        <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-cyan opacity-50"></div>

                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
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
                                        <span className="font-mono text-xs opacity-50 w-6">
                                            {(languages.indexOf(lang) + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className="font-bold tracking-wide">{lang.name}</span>
                                    </div>

                                    {selected === lang.key && <Check size={14} className="text-neon-cyan drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default LanguageSelector;
