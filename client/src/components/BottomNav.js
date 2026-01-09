import React from 'react';
import { Code2, FolderOpen, Terminal } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const BottomNav = ({ activeView, setActiveView }) => {
    const items = [
        { id: 'files', icon: FolderOpen, label: 'Files' },
        { id: 'editor', icon: Code2, label: 'Editor' },
        { id: 'output', icon: Terminal, label: 'Output' },
    ];

    return (
        <div className="md:hidden h-16 bg-surface/80 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 z-50 fixed bottom-0 left-0 right-0">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={twMerge(
                        "flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-all duration-200",
                        activeView === item.id
                            ? "text-accent"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <item.icon size={20} />
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                    {activeView === item.id && (
                        <motion.div
                            layoutId="bottom-nav-active"
                            className="absolute top-0 w-8 h-1 bg-accent rounded-b-full"
                        />
                    )}
                </button>
            ))}
        </div>
    );
};



export default BottomNav;
