import { useState, useEffect } from "react";
import axios from "axios";

function StatsWidget({ refreshTrigger }) {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [refreshTrigger]);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const res = await axios.get("http://localhost:5051/api/history", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const history = res.data;
            if (history.length === 0) return;

            // Calculate Favorite Language
            const langCounts = {};
            history.forEach(h => {
                langCounts[h.language] = (langCounts[h.language] || 0) + 1;
            });
            const favLang = Object.keys(langCounts).reduce((a, b) => langCounts[a] > langCounts[b] ? a : b);

            // Calculate Success Rate (Naive check for "Error" string)
            const successCount = history.filter(h => !h.output.includes("Error") && !h.output.includes("Traceback")).length;
            const successRate = Math.round((successCount / history.length) * 100);

            setStats({
                totalRuns: history.length,
                favLang,
                successRate
            });

        } catch (err) {
            console.error("Failed to fetch stats", err);
        }
    };

    if (!stats) return null;

    return (
        <div style={{
            marginTop: "20px",
            padding: "15px",
            background: "#161b22",
            borderRadius: "8px",
            border: "1px solid #30363d"
        }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#c9d1d9" }}>🧬 Your Coding DNA</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px", color: "#8b949e" }}>
                <div>
                    <div style={{ color: "#58a6ff", fontSize: "18px", fontWeight: "bold" }}>{stats.favLang}</div>
                    <div>Fav Language</div>
                </div>
                <div>
                    <div style={{ color: "#238636", fontSize: "18px", fontWeight: "bold" }}>{stats.totalRuns}</div>
                    <div>Total Runs</div>
                </div>
                <div style={{ gridColumn: "span 2" }}>
                    <div style={{ background: "#30363d", height: "4px", borderRadius: "2px", marginTop: "5px" }}>
                        <div style={{ background: "#238636", width: `${stats.successRate}%`, height: "100%", borderRadius: "2px" }}></div>
                    </div>
                    <div style={{ marginTop: "3px" }}>{stats.successRate}% Success Rate</div>
                </div>
            </div>
        </div>
    );
}

export default StatsWidget;
