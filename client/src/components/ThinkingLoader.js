import { useState, useEffect } from "react";
import { Check, Loader2, Circle } from "lucide-react";

const STEPS = [
    "🧠 Analyzing Syntax...",
    "📦 Allocating Resources...",
    "⚙️ Compiling Code...",
    "🚀 Executing Binary...",
    "📊 Gathering Results..."
];

function ThinkingLoader({ onComplete }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (step < STEPS.length) {
            const timeout = setTimeout(() => {
                setStep(prev => prev + 1);
            }, 600);
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [step, onComplete]);

    return (
        <div className="p-5 bg-black/30 backdrop-blur-sm rounded-lg border border-[#30363d] text-accent-color font-mono w-64 shadow-xl">
            {STEPS.map((s, i) => (
                <div key={i} className={`flex items-center gap-3 mb-2 transition-opacity duration-300 ${i <= step ? "opacity-100" : "opacity-30"}`}>
                    <span className="w-4 flex justify-center">
                        {i < step ? (
                            <Check size={16} className="text-green-500" />
                        ) : i === step ? (
                            <Loader2 size={16} className="animate-spin text-blue-400" />
                        ) : (
                            <Circle size={12} className="text-gray-600" />
                        )}
                    </span>
                    <span className="text-sm">{s}</span>
                </div>
            ))}
        </div>
    );
}

export default ThinkingLoader;
