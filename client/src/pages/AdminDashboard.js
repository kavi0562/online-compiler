import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Moved useEffect below fetchData defined in line 17


  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (activeTab === "stats") {
        const res = await axios.get("http://localhost:5051/api/admin/stats", { headers });
        setStats(res.data);
      } else if (activeTab === "users") {
        const res = await axios.get("http://localhost:5051/api/admin/users", { headers });
        setUsers(res.data);
      } else if (activeTab === "logs") {
        const res = await axios.get("http://localhost:5051/api/admin/logs", { headers });
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBlockUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5051/api/admin/block/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (err) {
      alert("Error updating user status");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5051/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh list
    } catch (err) {
      alert("Error deleting user");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#111", color: "#fff", padding: "20px" }}>
        <h3>Admin Panel</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            onClick={() => setActiveTab("stats")}
            style={{ padding: "10px", background: activeTab === "stats" ? "#333" : "transparent", cursor: "pointer" }}
          >
            Dashboard
          </li>
          <li
            onClick={() => setActiveTab("users")}
            style={{ padding: "10px", background: activeTab === "users" ? "#333" : "transparent", cursor: "pointer" }}
          >
            Users
          </li>
          <li
            onClick={() => setActiveTab("logs")}
            style={{ padding: "10px", background: activeTab === "logs" ? "#333" : "transparent", cursor: "pointer" }}
          >
            Activity Logs
          </li>
          <li
            onClick={() => navigate('/user')}
            style={{ padding: "10px", marginTop: "20px", cursor: "pointer", borderTop: "1px solid #444" }}
          >
            Exit to App
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "40px", overflowY: "auto" }}>
        {loading && <p>Loading...</p>}

        {!loading && activeTab === "stats" && stats && (
          <div>
            <h2>Dashboard Overview</h2>
            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <div style={cardStyle}>
                <h3>Total Users</h3>
                <p style={{ fontSize: "2rem" }}>{stats.totalUsers}</p>
              </div>
              <div style={cardStyle}>
                <h3>Active Users</h3>
                <p style={{ fontSize: "2rem" }}>{stats.activeUsers}</p>
              </div>
              <div style={cardStyle}>
                <h3>Blocked Users</h3>
                <p style={{ fontSize: "2rem" }}>{stats.blockedUsers}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === "users" && (
          <div>
            <h2>User Management</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#eee", textAlign: "left" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={tdStyle}>{user.name}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.role}</td>
                    <td style={tdStyle}>
                      <span style={{
                        color: user.isBlocked ? "red" : "green",
                        fontWeight: "bold"
                      }}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {user.role !== "admin" && (
                        <>
                          <button
                            onClick={() => handleBlockUser(user._id)}
                            style={{ marginRight: "10px", cursor: "pointer" }}
                          >
                            {user.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            style={{ color: "red", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && activeTab === "logs" && (
          <div>
            <h2>Activity Logs</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
              <thead>
                <tr style={{ background: "#eee", textAlign: "left" }}>
                  <th style={thStyle}>Admin</th>
                  <th style={thStyle}>Action</th>
                  <th style={thStyle}>Target User</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log._id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={tdStyle}>{log.adminId?.email || "Unknown"}</td>
                    <td style={tdStyle}>{log.action}</td>
                    <td style={tdStyle}>{log.targetUserId?.email || "N/A"}</td>
                    <td style={tdStyle}>{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f4f4f4",
  padding: "20px",
  borderRadius: "8px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
};

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #ddd"
};

const tdStyle = {
  padding: "12px"
};

export default AdminDashboard;
