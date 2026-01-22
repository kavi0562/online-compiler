
import { useState, useEffect, useRef } from "react";
import { Lock, Mail, ChevronRight, Github, Chrome, Cpu, ShieldCheck, Link } from "lucide-react";

function Login({ onLogin, onManualLogin, onManualSignup, onPasswordReset, onAccountLinking, loading }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showLinkOption, setShowLinkOption] = useState(false);

  // Use ref to track if we've already tried auto-triggering
  const hasAutoTriggered = useRef(false);

  // Auto-trigger social login if requested via URL
  useEffect(() => {
    if (hasAutoTriggered.current) return;

    const params = new URLSearchParams(window.location.search);
    const trigger = params.get('auto_trigger');

    if (trigger === 'github' && !loading) {
      hasAutoTriggered.current = true;
      // Best effort auto-click
      onLogin('github');
    }
  }, [loading, onLogin]);

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    if (!email) {
      setError("ENTER_NET_ADDRESS_FIRST");
      return;
    }
    const result = await onPasswordReset(email);
    if (result.success) {
      setSuccess(result.message);
    } else {
      setError(result.message);
    }
  };

  const handleLinkAccount = async () => {
    setError("");
    setSuccess("");
    const result = await onAccountLinking(email, password);
    if (result.success) {
      setSuccess(result.message);
      setShowLinkOption(false);
    } else {
      setError(result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowLinkOption(false);

    let authError = null;
    if (!isRegistering) {
      // Call Manual Login
      authError = await onManualLogin(email, password);
      // Success is handled by App.js (redirects to /admin or /user via auth listener)
    } else {
      // Call Manual Signup
      authError = await onManualSignup(email, password);

      // Smart Mode Switch: If email exists, switch to login automatically
      if (authError === "auth/email-already-in-use") {
        setError(">> ACCOUNT_EXISTS: LINK_PASSWORD_TO_GOOGLE?");
        setShowLinkOption(true); // Show the Link Button
        return;
      }
    }

    if (authError) {
      // Map Firebase/System errors to UI messages
      let displayError = authError;
      if (authError === "auth/wrong-password") displayError = "INVALID_SECURITY_KEY";
      if (authError === "auth/user-not-found") displayError = "UNKNOWN_IDENTITY";
      if (authError === "auth/weak-password") displayError = "SECURITY_KEY_TOO_WEAK";
      if (authError === "auth/invalid-email") displayError = "MALFORMED_ADDRESS";

      setError(displayError);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError("");
    setShowLinkOption(false);
    // Keep email populated for convenience
    // setPassword(""); 
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
              SECURE_ACCESS_PORTAL // V.4.0.0
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 bg-neon-red/10 border border-neon-red/50 rounded flex flex-col gap-2 text-xs text-neon-red font-mono animate-flicker">
              <div className="flex items-center gap-2">
                <Cpu size={14} />
                <span>SYSTEM_ERROR: {error}</span>
              </div>

              {/* Account Linking Button inside Error Box */}
              {showLinkOption && (
                <button
                  onClick={handleLinkAccount}
                  type="button"
                  className="mt-2 w-full py-2 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 rounded flex items-center justify-center gap-2 transition-all font-bold"
                >
                  <Link size={14} /> YES, LINK TO GOOGLE
                </button>
              )}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 bg-neon-green/10 border border-neon-green/50 rounded flex items-center gap-2 text-xs text-neon-green font-mono animate-pulse">
              <ShieldCheck size={14} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Signup Name Field - Only show if Registering */}
            {isRegistering && (
              <div className="space-y-1 group">
                <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} ENTER_IDENTITY:</label>
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
                    required={isRegistering}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1 group">
              <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} NET_ADDRESS:</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                  <Mail size={16} />
                </div>
                <input
                  type="text"
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
              <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} SECURITY_KEY:</label>
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

            {/* Forgot Password Link - Only show if NOT registering */}
            {!isRegistering && (
              <div className="flex justify-end -mt-4">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] text-neon-cyan/60 hover:text-neon-cyan tracking-widest font-mono hover:underline"
                >
                  FORGOT_ACCESS_KEY?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-bold py-3 rounded-lg tracking-[0.2em] hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                <Lock size={14} /> {loading ? "PROCESSING..." : (isRegistering ? "REGISTER" : "LOGIN")}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6 opacity-50">
            <div className="h-px bg-gray-600 flex-1"></div>
            <span className="text-[10px] text-neon-cyan font-bold tracking-widest">BIOMETRIC_UPLINK</span>
            <div className="h-px bg-gray-600 flex-1"></div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                console.log('Button clicked: github');
                onLogin('github');
              }}
              className="flex items-center justify-center gap-2 py-3 border border-neon-cyan/50 rounded bg-[#050510]/80 hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all text-white text-xs tracking-wider cursor-pointer"
            >
              <Github size={16} className="text-neon-cyan" />
              {loading ? "ESTABLISHING..." : "GITHUB"}
            </button>
            <button
              onClick={() => {
                console.log('Button clicked: google');
                onLogin('google');
              }}
              className="flex items-center justify-center gap-2 py-3 border border-neon-cyan/50 rounded bg-[#050510]/80 hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all text-white text-xs tracking-wider cursor-pointer"
            >
              <Chrome size={16} className="text-neon-cyan" />
              {loading ? "ESTABLISHING..." : "GOOGLE"}
            </button>
          </div>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <button
              onClick={toggleMode}
              className="text-xs text-gray-500 hover:text-neon-cyan transition-colors flex items-center justify-center gap-1 mx-auto group cursor-pointer"
            >
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              {isRegistering ? ">> EXISTING_USER? LOGIN_IDENTITY" : ">> NEW_USER? REGISTER_IDENTITY"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
