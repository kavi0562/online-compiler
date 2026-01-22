import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Users,
  Activity,
  Wifi,
  Terminal,
  ShieldAlert,
  Power,
  RefreshCw,
  ServerOff
} from "lucide-react";

// NASA Mission Control Theme
// Colors: Deep Black (#000000), Emergency Amber (#FFBF00), Neon Red (#FF0033)

function AdminDashboard() {
  const [logs, setLogs] = useState([
    ">> SYSTEM_BOOT_SEQUENCE_INITIATED...",
    ">> ESTABLISHING_SECURE_UPLINK...",
    ">> VERIFYING_ADMIN_CREDENTIALS...",
    ">> ACCESS_GRANTED: COMMANDER_MODE_ACTIVE."
  ]);
  const [users, setUsers] = useState([]); // Store fetched users
  const [view, setView] = useState("USERS"); // Toggle views: 'USERS' | 'TERMINAL'
  const [loading, setLoading] = useState(false); // New Loading State
  const [fetchError, setFetchError] = useState(null); // New Error State

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    uplinkStatus: "STABLE"
  });

  const [isOffline, setIsOffline] = useState(false);
  const logEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Fetch Users & Stats
  const fetchData = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      setLogs(prev => [...prev, ">> INITIATING_DATA_REFRESH_PROTOCOL..."]);

      // 1. GET TOKEN
      const token = localStorage.getItem("token");
      console.log(">> ADMIN_DASH: TOKEN_READ_FROM_STORAGE:", token ? "FOUND" : "MISSING");

      if (!token) {
        console.error('No token found in localStorage!');
        setLogs(prev => [...prev, ">> AUTH_ERROR: TOKEN_MISSING. REDIRECTING..."]);
        setFetchError("AUTH_TOKEN_MISSING: PLEASE_LOGIN");
        setLoading(false);
        return;
      }

      // 2. Fetch System Health (Port 5051)
      try {
        await axios.get("http://localhost:5051/api/status");
        // Don't set ONLINE yet, wait for user data
      } catch (healthErr) {
        console.warn("M1_STATUS_CHECK_FAILED:", healthErr);
      }

      // 3. Fetch User Data (With Auth Header)
      try {
        console.log(">> ATTEMPTING_FETCH: /api/admin/users");

        // CLEAN TOKEN: Remove potential extra quotes
        const rawToken = localStorage.getItem('token');
        const cleanToken = rawToken?.replace(/^"(.*)"$/, '$1');

        console.log('Sending Token:', cleanToken ? 'YES' : 'NO');

        const res = await axios.get("http://localhost:5051/api/admin/users", {
          headers: {
            Authorization: `Bearer ${cleanToken}`
          }
        });

        console.log(">> FETCH_SUCCESS: Users Found:", res.data.length);

        // 4. Update State & Status
        setUsers(res.data); // Save full list
        setStats(prev => ({
          ...prev,
          totalUsers: res.data.length,
          activeUsers: res.data.filter(u => !u.isBlocked).length,
          uplinkStatus: "ONLINE" // GREEN LIGHT
        }));

        setLogs(prev => [...prev, `>> DATA_SYNC_COMPLETE: ${res.data.length} RECORDS_RETRIEVED.`]);
        setIsOffline(false);

      } catch (userErr) {
        console.error("M2_USER_SYNC_FAILED:", userErr);
        const status = userErr.response ? userErr.response.status : "NET_ERR";
        const errMsg = userErr.response?.data?.message || userErr.message;
        setFetchError(`SYNC_FAILED: ${status} - ${errMsg}`);
        setLogs(prev => [...prev, `>> DATA_ACCESS_DENIED (STATUS: ${status}): ${errMsg}`]);
      }

    } catch (criticalError) {
      console.error("CRITICAL_SYSTEM_FAILURE:", criticalError);
      setFetchError("CRITICAL_SYSTEM_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulate incoming logs (Background Noise)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // Only show logs occasionally
        const messages = [
          ">> MONITORING_NODES... [STABLE]",
          ">> INCOMING_PACKET_DETECTED (PORT 5051)",
          ">> SECURITY_SCAN: NO_THREATS_FOUND",
          ">> DATABASE_LATENCY: 12ms"
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setLogs(prev => [...prev.slice(-20), randomMsg]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (action) => {
    if (action === "REFRESH_DATA") {
      fetchData();
      return;
    }
    setLogs(prev => [...prev, `>> EXECUTING_COMMAND: ${action}...`]);
    setTimeout(() => {
      setLogs(prev => [...prev, `>> COMMAND_SUCCESSFUL: ${action}_COMPLETE.`]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-[#FFBF00] font-mono p-6 flex flex-col gap-6 overflow-hidden relative">

      {/* Background Grid & Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,191,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,191,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>

      {/* HEADER */}
      <header className="flex items-center justify-between border-b border-[#FFBF00]/30 pb-4 z-10 bg-black/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-[#FF0033] animate-pulse" size={32} />
          <div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white">MISSION_CONTROL</h1>
            <p className="text-xs text-[#FFBF00]/70">SECURE_ADMIN_NEXUS // LEVEL_5_CLEARANCE</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleAction("REFRESH_DATA")}
            className="flex items-center gap-2 text-xs border border-[#FFBF00]/50 px-3 py-1 rounded bg-[#FFBF00]/10 hover:bg-[#FFBF00]/20 transition-all cursor-pointer"
          >
            <RefreshCw size={12} className={stats.uplinkStatus === "OPTIMAL" ? "" : "animate-spin"} />
            REFRESH_DATA
          </button>
          <div className={`flex items-center gap-2 text-xs border border-[#FFBF00]/30 px-3 py-1 rounded ${isOffline ? 'bg-red-900/20 text-red-500' : 'bg-[#FFBF00]/5'}`}>
            <div className={`w-2 h-2 rounded-full ${stats.uplinkStatus === 'OPTIMAL' || stats.uplinkStatus === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            SYSTEM_{stats.uplinkStatus}
          </div>
        </div>
      </header>

      {/* TOP STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-10">

        {/* Card 1: TOTAL USERS */}
        <div className="bg-[#050505] border border-[#FFBF00]/30 p-4 rounded flex items-center justify-between shadow-[0_0_15px_rgba(255,191,0,0.1)]">
          <div>
            <p className="text-xs text-[#FFBF00]/60 mb-1 tracking-widest">TOTAL_USERS</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
          </div>
          <Users size={24} className="text-[#FFBF00]" />
        </div>

        {/* Card 2: ACTIVE SESSIONS (Approximated by Active Users) */}
        <div className="bg-[#050505] border border-[#FF0033]/30 p-4 rounded flex items-center justify-between shadow-[0_0_15px_rgba(255,0,51,0.1)]">
          <div>
            <p className="text-xs text-[#FF0033]/60 mb-1 tracking-widest">ACTIVE_NODES</p>
            <h3 className="text-3xl font-bold text-[#FF0033]">{stats.activeUsers}</h3>
          </div>
          <Activity size={24} className="text-[#FF0033]" />
        </div>

        {/* Card 3: UPLINK STATUS */}
        <div className={`bg-[#050505] border ${isOffline ? 'border-red-500/30' : 'border-green-500/30'} p-4 rounded flex items-center justify-between shadow-[0_0_15px_rgba(0,255,0,0.1)]`}>
          <div>
            <p className={`text-xs ${isOffline ? 'text-red-500/60' : 'text-green-500/60'} mb-1 tracking-widest`}>UPLINK_STATUS</p>
            <h3 className={`text-xl font-bold ${isOffline ? 'text-red-500' : 'text-green-500'}`}>{stats.uplinkStatus}</h3>
          </div>
          {isOffline ? <ServerOff size={24} className="text-red-500" /> : <Wifi size={24} className="text-green-500" />}
        </div>

      </div>

      {/* MAIN CONTENT Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden z-10">

        {/* MAIN DISPLAY AREA (Left - 2/3 width) */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#FFBF00]/30 rounded flex flex-col shadow-lg overflow-hidden relative min-h-[400px]">

          {/* TABS HEADER */}
          <div className="bg-[#FFBF00]/10 p-2 border-b border-[#FFBF00]/20 flex items-center gap-4">
            <button
              onClick={() => setView("USERS")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-all ${view === 'USERS' ? 'bg-[#FFBF00] text-black shadow-[0_0_10px_rgba(255,191,0,0.4)]' : 'text-[#FFBF00]/60 hover:text-[#FFBF00] hover:bg-[#FFBF00]/5'}`}
            >
              <Users size={14} /> PERSONNEL_DATABASE
            </button>
            <button
              onClick={() => setView("TERMINAL")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold tracking-widest transition-all ${view === 'TERMINAL' ? 'bg-[#FFBF00] text-black shadow-[0_0_10px_rgba(255,191,0,0.4)]' : 'text-[#FFBF00]/60 hover:text-[#FFBF00] hover:bg-[#FFBF00]/5'}`}
            >
              <Terminal size={14} /> SYSTEM_LOGS
            </button>
          </div>

          {/* VIEW CONTENT */}
          <div className="flex-1 overflow-hidden relative">

            {/* VIEW: USERS TABLE */}
            {view === "USERS" && (
              <div className="h-full overflow-y-auto custom-scrollbar p-0">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0a0a0a] z-10 shadow-md">
                    <tr className="text-[#FFBF00]/70 border-b border-[#FFBF00]/20 text-[10px] tracking-[0.2em] uppercase">
                      <th className="p-4 font-normal">Identity</th>
                      <th className="p-4 font-normal">Role</th>
                      <th className="p-4 font-normal">Auth_Method</th>
                      <th className="p-4 font-normal">Last_Active</th>
                      <th className="p-4 font-normal text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300 text-xs font-mono">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-[#FFBF00] animate-pulse italic">
                          &gt;&gt; ESTABLISHING_UPLINK... // DOWNLOADING_ROSTER...
                        </td>
                      </tr>
                    ) : fetchError ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-red-500 font-bold">
                          &gt;&gt; UPLINK_FAILED: {fetchError} <br />
                          <span className="text-xs font-normal opacity-70">CHECK_CONNECTION // RETRY_PROTOCOL</span>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 italic">
                          &gt;&gt; NO_RECORDS_FOUND // DATABASE_EMPTY
                        </td>
                      </tr>
                    ) : users.map((u) => (
                      <tr key={u._id} className="border-b border-[#FFBF00]/10 hover:bg-[#FFBF00]/5 transition-colors group">
                        {/* Identity */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-[#FFBF00]/10 border border-[#FFBF00]/20 flex items-center justify-center text-[#FFBF00] overflow-hidden">
                              {u.profilePic ? (
                                <img src={u.profilePic} alt="av" className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold">{u.name?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-[#FFBF00] transition-colors">{u.name}</div>
                              <div className="text-[10px] text-gray-500">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${u.role === 'admin' ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-gray-700 text-gray-500'}`}>
                            {u.role ? u.role.toUpperCase() : 'USER'}
                          </span>
                        </td>

                        {/* Provider */}
                        <td className="p-4 text-gray-500">
                          {u.provider ? u.provider.toUpperCase() : 'UNKNOWN'}
                        </td>

                        {/* Last Login */}
                        <td className="p-4 text-gray-500">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Status (Blocked/Active) */}
                        <td className="p-4 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${u.isBlocked ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-green-500/50 text-green-500 bg-green-500/10'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${u.isBlocked ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                            {u.isBlocked ? 'RESTRICTED' : 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW: TERMINAL LOGS */}
            {view === "TERMINAL" && (
              <div className="h-full p-4 overflow-y-auto font-mono text-xs space-y-1 text-[#FFBF00]/80">
                {logs.map((log, index) => (
                  <div key={index} className="break-all">{log}</div>
                ))}
                <div ref={logEndRef} />
                <div className="animate-pulse">_</div>
              </div>
            )}

          </div>
        </div>

        {/* ACTION PANEL (Right - 1/3 width) */}
        <div className="flex flex-col gap-4">

          <div className="bg-[#0a0a0a] border border-[#FFBF00]/30 rounded p-4 flex-1">
            <h3 className="text-sm font-bold border-b border-[#FFBF00]/20 pb-2 mb-4 text-white">CRITICAL_ACTIONS</h3>

            <div className="space-y-4">
              <button
                onClick={() => handleAction("TERMINATE_ALL_SESSIONS")}
                className="w-full py-4 border border-[#FF0033] text-[#FF0033] bg-[#FF0033]/5 hover:bg-[#FF0033]/10 hover:shadow-[0_0_20px_rgba(255,0,51,0.2)] transition-all flex items-center justify-center gap-2 font-bold tracking-wider rounded cursor-pointer"
              >
                <Power size={18} /> TERMINATE_SESSIONS
              </button>

              <button
                onClick={() => handleAction("CORE_SYSTEM_REBOOT")}
                className="w-full py-4 border border-[#FFBF00] text-[#FFBF00] bg-[#FFBF00]/5 hover:bg-[#FFBF00]/10 hover:shadow-[0_0_20px_rgba(255,191,0,0.2)] transition-all flex items-center justify-center gap-2 font-bold tracking-wider rounded cursor-pointer"
              >
                <RefreshCw size={18} /> REBOOT_CORE
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#FFBF00]/20 rounded p-4 text-[10px] text-gray-500">
            <p>SERVER_IP: 192.168.X.X</p>
            <p>LOCATION: [REDACTED]</p>
            <p>UPTIME: 42h 15m 33s</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
