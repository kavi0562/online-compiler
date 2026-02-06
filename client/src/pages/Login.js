
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Lock, Mail, ChevronRight, Github, Chrome, Cpu, ShieldCheck, Link, MessageSquare, Key } from "lucide-react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  updatePassword
} from "firebase/auth";

function Login({ onLogin, onManualLogin, onManualSignup, onPasswordReset, onAccountLinking, loading }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // AUTH V3: FIREBASE STATE
  const [resetStep, setResetStep] = useState(0); // 0: Choice, 1: Email, 2: Mobile, 3: OTP, 4: New Password
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [phoneUser, setPhoneUser] = useState(null); // The signed-in user object after OTP

  // Legacy/Other State
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [tempUserId, setTempUserId] = useState(null);

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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

  // --- FIREBASE RESET HANDLERS ---

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("RECAPTCHA_SOLVED");
        }
      });
    }
  };

  const handleEmailReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("RESET_LINK_SENT_IF_EXISTS");
      setTimeout(() => toggleMode(), 3000);
    } catch (err) {
      // Generic error for security
      console.error(err);
      setSuccess("RESET_LINK_SENT_IF_EXISTS");
    } finally {
      setResetLoading(false);
    }
  };

  const handleMobileInput = async (e) => {
    e.preventDefault();
    setError("");
    setResetLoading(true);

    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      // Format mobile: Ensure +Prefix. Assuming user types local or full.
      // For simplicity, assuming user enters full international or we prepend default.
      // Let's assume input has + or we add it. 
      // Note: Standard Firebase requires E.164 (e.g. +16505553434)
      const phoneNumber = mobile.startsWith('+') ? mobile : `+91${mobile}`; // Default to +91 just in case, or force user.

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setResetStep(3); // Go to OTP
    } catch (err) {
      console.error(err);
      setError("SMS_SEND_FAILED: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setResetLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      setPhoneUser(user);
      setResetStep(4); // Go to New Password
    } catch (err) {
      setError("INVALID_OTP");
    } finally {
      setResetLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setResetLoading(true);
    try {
      if (!phoneUser) throw new Error("NO_USER");
      await updatePassword(phoneUser, newPassword);
      setSuccess("PASSWORD_UPDATED. PLEASE_LOGIN.");
      // Cleanup
      setResetStep(0);
      setNewPassword("");
      setOtp("");
      setIsResetting(false);
    } catch (err) {
      setError("UPDATE_FAILED: " + err.message);
    } finally {
      setResetLoading(false);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // In V3, Reset forms handle their own submit.
    if (isResetting) return;

    setError("");
    setShowLinkOption(false);

    let authError = null;
    if (!isRegistering) {
      // Call Manual Login
      authError = await onManualLogin(email, password);
      // Success is handled by App.js (redirects to /admin or /user via auth listener)
    } else {
      // Call Manual Signup
      authError = await onManualSignup(email, password, mobile);

      // Smart Mode Switch: If email exists, switch to login automatically
      if (authError === "auth/email-already-in-use") {
        setError(">> ACCOUNT_EXISTS: LINK_PASSWORD_TO_GOOGLE?");
        setShowLinkOption(true); // Show the Link Button
        return;
      }
    }

    // CHECK FOR FIRST LOGIN SIGNAL FROM APP.JS WRAPPER
    // Note: onManualLogin in Login.js calls the prop. Use a local wrapper logic?
    // Actually, onManualLogin likely returns an error string or null.
    // We need to modify how onManualLogin is CALLED or how it RETURNS data.
    // But since onManualLogin is a prop, we should check what it returns.
    // If it returns a user object with firstLogin: true, we intercept.

    // For now, let's assume App.js handles the API call. We might need to lift this logic or pass a callback.
    // WAIT: Login.js calls onManualLogin(email, password). App.js implementation:
    // const onManualLogin = ... (calls signInWithEmailAndPassword).
    // BUT we are using our OWN backend for auth now in some places?
    // User requested "Login using email + password" but App.js uses Firebase.
    // The "Authentication System" requested is custom backend based?
    // "User logs in using email + password." -> This implies we might bypass Firebase for this specific college flow?
    // Or we sync?
    // The "Admin manually creates a user... System generates temp password."
    // This is a custom auth flow, NOT Firebase.
    // So onManualLogin should probably call our backend `/api/auth/login`.

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
    setSuccess("");
    setShowLinkOption(false);

    // Auth V3 Reset
    setResetStep(0);
    setNewPassword("");
    setOtp("");
    setIsResetting(false); // If called from within Reset

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
              N <span className="text-neon-cyan">COMPILER</span> ACCESS
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

            {/* FORM FIELDS - DYNAMIC RENDERING */}

            {/* 1. RESET PASSWORD MODE (V3: FIREBASE) */}
            {isResetting && (
              <>
                <div id="recaptcha-container"></div>

                {/* STEP 0: CHOICE */}
                {resetStep === 0 && (
                  <div className="space-y-4 animate-slide-in">
                    <p className="text-xs text-neon-cyan tracking-widest font-mono mb-2">{'>> '} SELECT_RECOVERY_METHOD:</p>

                    <button type="button" onClick={() => setResetStep(1)} className="w-full p-4 border border-neon-cyan/30 rounded bg-[#0a0a1a] hover:bg-neon-cyan/10 flex items-center justify-between text-white transition-all">
                      <span className="flex items-center gap-3 font-mono text-sm"><Mail size={16} /> RESET_VIA_EMAIL</span>
                      <ChevronRight size={14} className="text-gray-500" />
                    </button>

                    <button type="button" onClick={() => setResetStep(2)} className="w-full p-4 border border-neon-cyan/30 rounded bg-[#0a0a1a] hover:bg-neon-cyan/10 flex items-center justify-between text-white transition-all">
                      <span className="flex items-center gap-3 font-mono text-sm"><MessageSquare size={16} /> RESET_VIA_MOBILE (OTP)</span>
                      <ChevronRight size={14} className="text-gray-500" />
                    </button>
                  </div>
                )}

                {/* STEP 1: EMAIL RESET */}
                {resetStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-1 group">
                      <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} ENTER_EMAIL_ADDRESS:</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors"><Mail size={16} /></div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan"
                          placeholder="name@example.com"
                          autoFocus
                        />
                      </div>
                    </div>
                    <button type="button" onClick={handleEmailReset} disabled={resetLoading} className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30">
                      {resetLoading ? "SENDING_LINK..." : "SEND_RESET_LINK"}
                    </button>
                  </div>
                )}

                {/* STEP 2: MOBILE INPUT */}
                {resetStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-1 group">
                      <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} ENTER_MOBILE_NUMBER:</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors"><MessageSquare size={16} /></div>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan"
                          placeholder="+91..."
                          autoFocus
                        />
                      </div>
                    </div>
                    <button type="button" onClick={handleMobileInput} disabled={resetLoading} className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30">
                      {resetLoading ? "SENDING_OTP..." : "SEND_OTP_CODE"}
                    </button>
                  </div>
                )}

                {/* STEP 3: OTP VERIFY */}
                {resetStep === 3 && (
                  <div className="space-y-4">
                    <div className="space-y-1 group">
                      <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} ENTER_VERIFICATION_CODE:</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors"><ShieldCheck size={16} /></div>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan tracking-widest"
                          placeholder="######"
                          autoFocus
                        />
                      </div>
                    </div>
                    <button type="button" onClick={handleVerifyOTP} disabled={resetLoading} className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30">
                      {resetLoading ? "VERIFYING..." : "CONFIRM_CODE"}
                    </button>
                  </div>
                )}

                {/* STEP 4: NEW PASSWORD */}
                {resetStep === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-1 group">
                      <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} SET_NEW_PASSWORD:</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors"><Key size={16} /></div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan"
                          placeholder="MIN_6_CHARS"
                          autoFocus
                        />
                      </div>
                    </div>
                    <button type="button" onClick={handleUpdatePassword} disabled={resetLoading} className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30">
                      {resetLoading ? "UPDATING..." : "UPDATE_CREDENTIALS"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* 2. REGULAR LOGIN/REGISTER MODE */}
            {!isResetting && (
              <>
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

                {/* Mobile Field - Register Only */}
                {isRegistering && (
                  <div className="space-y-1 group">
                    <label className="text-[10px] text-neon-cyan tracking-widest font-mono ml-1">{'>> '} COMM_UPLINK (MOBILE):</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors">
                        <MessageSquare size={16} />
                      </div>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="w-full bg-[#050510]/50 border border-[#30363d] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_10px_rgba(0,243,255,0.2)] transition-all"
                        placeholder="+91 99999 99999"
                      />
                    </div>
                  </div>
                )}

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

                {/* Forgot Password Link */}
                <div className="flex justify-end -mt-4">
                  <button
                    type="button"
                    onClick={() => setIsResetting(true)}
                    className="text-[10px] text-neon-cyan/60 hover:text-neon-cyan tracking-widest font-mono hover:underline"
                  >
                    FORGOT_ACCESS_KEY?
                  </button>
                </div>
              </>
            )}

            {/* Submit Button (Hide during Reset as it has own buttons) */}
            {!isResetting && (
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden bg-neon-cyan/10 border border-neon-cyan/50 text-neon-cyan font-bold py-3 rounded-lg tracking-[0.2em] hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  <Lock size={14} />
                  {loading ? "PROCESSING..." : (
                    isRegistering ? "REGISTER_IDENTITY" : "LOGIN_ACCESS"
                  )}
                </span>
              </button>
            )}
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
              onClick={async () => {
                console.log('Button clicked: github');
                const error = await onLogin('github');
                if (error) {
                  let msg = error.message || "GITHUB_AUTH_FAILED";

                  if (error.code === 'auth/popup-closed-by-user') msg = "ACCESS_DENIED_BY_USER";
                  if (error.code === 'auth/network-request-failed') msg = "UPLINK_OFFLINE_CHECK_NET";

                  setError(msg);
                }
              }}
              className="flex items-center justify-center gap-2 py-3 border border-neon-cyan/50 rounded bg-[#050510]/80 hover:bg-neon-cyan/10 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all text-white text-xs tracking-wider cursor-pointer"
            >
              <Github size={16} className="text-neon-cyan" />
              {loading ? "ESTABLISHING..." : "GITHUB"}
            </button>
            <button
              onClick={async () => {
                console.log('Button clicked: google');
                const error = await onLogin('google');
                if (error) {
                  let msg = error.message || "GOOGLE_AUTH_FAILED";

                  if (error.code === 'auth/popup-closed-by-user') msg = "ACCESS_DENIED_BY_USER";
                  if (error.code === 'auth/network-request-failed') msg = "UPLINK_OFFLINE_CHECK_NET";

                  setError(msg);
                }
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
              onClick={() => {
                if (isResetting) {
                  setIsResetting(false);
                  setResetStep(0);
                } else {
                  toggleMode();
                }
              }}
              className="text-xs text-gray-500 hover:text-neon-cyan transition-colors flex items-center justify-center gap-1 mx-auto group cursor-pointer"
            >
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              {isResetting
                ? "<< ABORT_RESET_SEQUENCE"
                : (isRegistering ? ">> EXISTING_USER? LOGIN_IDENTITY" : ">> NEW_USER? REGISTER_IDENTITY")
              }
            </button>
          </div>

        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {isFirstLogin && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a1a] border border-neon-cyan rounded-xl p-6 w-full max-w-md shadow-[0_0_50px_rgba(0,243,255,0.2)]">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="text-neon-cyan" /> SECURITY_UPDATE_REQUIRED
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              {">>"} FIRST_LOGIN_DETECTED: PLEASE_UPDATE_CREDENTIALS
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5051";
                const res = await axios.post(`${apiBase}/api/auth/change-password`, {
                  userId: tempUserId,
                  newPassword
                });
                if (res.data.success) {
                  alert("SUCCESS: PASSWORD_UPDATED. PLEASE_LOGIN_AGAIN.");
                  setIsFirstLogin(false);
                  setTempUserId(null);
                  setNewPassword("");
                  setPassword(""); // Clear old password
                }
              } catch (err) {
                alert("ERROR: " + (err.response?.data?.message || "UPDATE_FAILED"));
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-neon-cyan tracking-widest font-mono">NEW_SECURITY_KEY</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#050510] border border-[#30363d] rounded p-3 text-white focus:border-neon-cyan outline-none font-mono mt-1"
                    placeholder="MIN_6_CHARS"
                  />
                </div>
                <button type="submit" className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30 transition-all">
                  CONFIRM_NEW_CREDENTIALS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
