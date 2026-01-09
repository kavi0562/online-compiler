import { useState, useEffect } from "react";
import axios from "axios";

function TimelineSidebar({ onSelect, refreshTrigger }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:5051/api/history?limit=10", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch timeline", err);
        }
    };

    return (
        <div style={{
            width: "250px",
            background: "#0d1117",
            borderLeft: "1px solid #30363d",
            padding: "15px",
            height: "100%",
            overflowY: "auto"
        }}>
            <h3 style={{ color: "#c9d1d9", fontSize: "16px", marginBottom: "15px" }}>🛑 Live Timeline</h3>

            {history.map((item) => (
                <div
                    key={item._id}
                    onClick={() => onSelect(item)}
                    style={{
                        padding: "10px",
                        marginBottom: "10px",
                        background: "#161b22",
                        border: "1px solid #30363d",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                        <span style={{
                            color: "#58a6ff",
                            fontWeight: "bold",
                            fontSize: "12px",
                            textTransform: "uppercase"
                        }}>
                            {item.language}
                        </span>
                        <span style={{ color: "#8b949e", fontSize: "10px" }}>
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <div style={{
                        fontSize: "12px",
                        color: item.output.includes("Error") ? "#da3633" : "#238636"
                    }}>
                        {item.output.includes("Error") ? "❌ Error" : "✅ Success"}
                    </div>
                </div>
            ))}

            {history.length === 0 && (
                <p style={{ color: "#8b949e", fontSize: "12px" }}>No recent runs.</p>
            )}
        </div>
    );
}

export default TimelineSidebar;
