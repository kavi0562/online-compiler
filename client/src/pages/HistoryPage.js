import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";

function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to view history");
                return;
            }

            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
            setError("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this entry?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(history.filter(item => item._id !== id));
        } catch (err) {
            alert("Failed to delete entry");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Code Execution History</h2>
                <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </div>

            {loading && <p>Loading history...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div style={{ display: "grid", gap: "20px" }}>
                {history.map((item) => (
                    <div key={item._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "#f9f9f9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <strong>Language: {item.language}</strong>
                            <small>{new Date(item.timestamp).toLocaleString()}</small>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <div>
                                <strong>Code:</strong>
                                <Editor
                                    height="150px"
                                    language={item.language}
                                    theme="vs-light"
                                    value={item.code}
                                    options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false }}
                                />
                            </div>
                            <div>
                                <strong>Output:</strong>
                                <pre style={{
                                    background: "#1e1e1e",
                                    color: "#0f0",
                                    padding: "10px",
                                    borderRadius: "4px",
                                    height: "130px",
                                    overflow: "auto",
                                    marginTop: "0"
                                }}>
                                    {item.output}
                                </pre>
                            </div>
                        </div>

                        <div style={{ marginTop: "10px", textAlign: "right" }}>
                            <button
                                onClick={() => handleDelete(item._id)}
                                style={{ background: "red", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && history.length === 0 && <p>No execution history found.</p>}
            </div>
        </div>
    );
}

export default HistoryPage;
