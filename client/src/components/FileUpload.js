import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

const FileUpload = ({ onFileUpload }) => {
    const fileInputRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const fileName = file.name;
            const extension = fileName.split('.').pop().toLowerCase();

            if (onFileUpload) {
                onFileUpload({ content, fileName, extension });
            }
        };
        reader.readAsText(file);
        // Reset so the same file can be selected again if needed
        event.target.value = '';
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="relative group">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.h,.html,.css,.json,.md"
            />
            <button
                onClick={handleButtonClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative flex items-center justify-center p-3 md:p-2
                           bg-neon-cyan/10 border border-neon-cyan/50 
                           rounded-lg backdrop-blur-md transition-all duration-300 
                           hover:bg-neon-cyan/20 
                           hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]
                           shadow-[0_0_10px_rgba(0,243,255,0.15)]
                           group z-10"
                title="Upload Code"
            >
                {/* Pulse Ring for Highlight */}
                <span className="absolute inset-0 rounded-lg border border-neon-cyan opacity-20 animate-pulse pointer-events-none"></span>

                <div className="flex items-center gap-2">
                    <Upload size={20} className="text-neon-cyan transition-colors" />
                </div>
            </button>

            {/* Custom Popup / Tooltip */}
            <div className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 
                            bg-neon-cyan/90 text-black text-[10px] font-bold tracking-widest rounded
                            transform transition-all duration-200 pointer-events-none
                            ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                UPLOAD
                {/* Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neon-cyan/90"></div>
            </div>
        </div>
    );
};

export default FileUpload;
