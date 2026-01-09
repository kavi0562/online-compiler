import React from 'react';

const ReactorLogo = ({ className = "w-12 h-12 text-cyan-400" }) => {
    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-full h-full overflow-visible"
            >
                {/* Central Core */}
                <circle
                    cx="50"
                    cy="50"
                    r="12"
                    className="animate-pulse fill-current opacity-80"
                    stroke="none"
                >
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Inner Core Glow */}
                <circle cx="50" cy="50" r="6" className="fill-white opacity-90 animate-pulse" stroke="none" />

                {/* Orbiting Brackets (Left - Counter-Clockwise) */}
                {/* Using a group to handle rotation */}
                <g className="origin-center animate-[spin_4s_linear_infinite]" style={{ animationDirection: 'reverse' }}>
                    <path d="M 40 25 Q 15 50 40 75" className="opacity-90" />
                </g>

                {/* Orbiting Brackets (Right - Clockwise) */}
                <g className="origin-center animate-[spin_4s_linear_infinite]">
                    <path d="M 60 25 Q 85 50 60 75" className="opacity-90" />
                </g>

                {/* Outer Orbits (Slower, Thinner) */}
                <g className="origin-center animate-[spin_8s_linear_infinite]" style={{ animationDirection: 'reverse' }}>
                    <path d="M 50 10 Q 5 50 50 90" className="opacity-40" strokeWidth="2" />
                </g>

                <g className="origin-center animate-[spin_8s_linear_infinite]">
                    <path d="M 50 10 Q 95 50 50 90" className="opacity-40" strokeWidth="2" />
                </g>

                {/* Horizontal Ring Effect */}
                <g className="origin-center animate-[spin_12s_linear_infinite]">
                    <ellipse cx="50" cy="50" rx="45" ry="10" className="opacity-20" strokeWidth="1" />
                </g>

            </svg>

            {/* Central Glow Effect (Blur) */}
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-pulse z-[-1]"></div>
        </div>
    );
};

export default ReactorLogo;
