import { useState, useEffect } from "react";

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
            }, 600); // 600ms per step for effect
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [step, onComplete]);

    return (
        <div style={{
            padding: "20px",
            background: "rgba(0,0,0,0.3)",
            borderRadius: "8px",
            border: "1px solid #30363d",
            color: "#58a6ff",
            fontFamily: "monospace"
        }}>
            {STEPS.map((s, i) => (
                <div key={i} style={{
                    opacity: i <= step ? 1 : 0.3,
                    marginBottom: "8px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <span style={{ marginRight: "10px" }}>
                        {i < step ? "✅" : i === step ? "⏳" : "⭕"}
                    </span>
                    {s}
                </div>
            ))}
        </div>
    );
}

export default ThinkingLoader;
