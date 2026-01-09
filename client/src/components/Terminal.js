import React, { useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Copy } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Terminal = ({ output, onClose, onClear }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const isError = output && (output.includes("Error") || output.includes("Exception") || output.includes("Traceback"));

    return (
        <div className="h-full flex flex-col bg-[#0d1117] border-t border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface/30 backdrop-blur-sm">
                <div className="flex items-center text-sm font-semibold text-gray-300">
                    <TerminalIcon size={14} className="mr-2 text-accent" />
                    <span>CONSOLE</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        title="Copy Output"
                    >
                        <Copy size={13} />
                    </button>
                    <button
                        onClick={onClear}
                        className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                        title="Clear Console"
                    >
                        <X size={13} />
                    </button>
                </div>
            </div>

            {/* Output Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-auto p-4 font-mono text-sm"
            >
                {output ? (
                    <pre className={twMerge(
                        "whitespace-pre-wrap break-words",
                        isError ? "text-error" : "text-success"
                    )}>
                        {output}
                    </pre>
                ) : (
                    <div className="text-gray-600 italic">
                        {/* Output will appear here... */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;
