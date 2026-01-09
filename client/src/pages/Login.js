import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ChevronRight, Zap, Github, Chrome, Cpu, ShieldCheck } from "lucide-react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // For signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:5051/api/auth/login"
        : "http://localhost:5051/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name: fullName, email, password, role: "user" }; // Default role user

      const res = await axios.post(endpoint, payload);

      // If signup successful, maybe auto-login or switch to login? 
      // Assuming API returns token on register too, or we switch to login.
      // For now, let's assume register returns token like login or we redirect.

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        // Fallback if register just returns success message
        setIsLogin(true);
        setError("Registration successful. Please initialize session.");
      }

    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Connection refused. Credentials invalid.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  return (
    <div className="relative h-screen w-screen bg-void flex items-center justify-center overflow-hidden font-tech text-gray-200">

      {/* Background Effects */}
      <div className="starfield-layer stars-sm"></div>
      <div className="starfield-layer stars-md"></div>
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

      {/* Main Terminal Container */}
      <div className="relative z-10 w-full max-w-md p-1 animate-[boot-up_0.8s_ease-out_forwards]">

        {/* Holographic Border/Glow */}
        <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-2xl"></div>
        <div className="relative bg-[#0a0a1a]/90 border border-neon-cyan/30 rounded-2xl backdrop-blur-xl shadow-2xl p-8 overflow-hidden">

          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[length:100%_4px]"></div>

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,243,255,0.3)] mb-4 animate-pulse-glow">
              <ShieldCheck size={32} className="text-neon-cyan" />
            </div>
            <h1 className="text-2xl font-bold tracking-[0.2em] text-white text-shadow-glow">
              REACTOR<span className="text-neon-cyan">.IO</span> ACCESS
            </h1>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-neon-magenta tracking-widest font-mono">
              <span className="w-2 h-2 bg-neon-magenta rounded-full animate-pulse"></span>
              SECURE TERMINAL // V.3.0.1
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 bg-neon-red/10 border border-neon-red/50 rounded flex items-center gap-2 text-xs text-neon-red font-mono animate-flicker">
              <Cpu size={14} />
              <span>ERROR: {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Signup Name Field */}
            {!isLogin && (
              <div className="space-y-1 group">
                <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">>> ENTER_IDENTITY:</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                    <Cpu size={16} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                    placeholder="FULL_NAME"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1 group">
              <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">>> NET_ADDRESS:</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                  placeholder="USER@DOMAIN.EXT"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 group">
              <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">>> SECURITY_KEY:</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-bold py-3 rounded-lg tracking-[0.2em] hover:bg-neon-cyan hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <span className="animate-pulse">AUTHENTICATING...</span>
                ) : (
                  <>
                    <Zap size={18} fill="currentColor" />
                    <span>{isLogin ? "INITIATE SESSION" : "REGISTER UNIT"}</span>
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6 opacity-50">
            <div className="h-px bg-gray-600 flex-1"></div>
            <span className="text-[10px] text-gray-400">EXTERNAL LINKS</span>
            <div className="h-px bg-gray-600 flex-1"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-2 border border-[#30363d] rounded bg-[#050510]/50 hover:bg-white/5 hover:border-white/30 transition-all text-gray-400 hover:text-white text-xs tracking-wider">
              <Github size={16} /> GITHUB
            </button>
            <button className="flex items-center justify-center gap-2 py-2 border border-[#30363d] rounded bg-[#050510]/50 hover:bg-white/5 hover:border-white/30 transition-all text-gray-400 hover:text-white text-xs tracking-wider">
              <Chrome size={16} /> GOOGLE
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-xs text-gray-500 hover:text-neon-cyan transition-colors flex items-center justify-center gap-1 mx-auto group"
            >
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              {isLogin ? ">> CREATE NEW ID" : ">> ACCESS EXISTING ID"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
