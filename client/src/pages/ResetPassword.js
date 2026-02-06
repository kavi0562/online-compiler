import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Key } from "lucide-react";

function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("PASSWORDS_DO_NOT_MATCH");
            return;
        }

        if (newPassword.length < 6) {
            setError("PASSWORD_TOO_WEAK_MIN_6_CHARS");
            return;
        }

        setLoading(true);
        try {
            const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5051";
            const res = await axios.post(`${apiBase}/api/auth/reset-password-confirm`, {
                email,
                token,
                newPassword
            });

            if (res.data.success) {
                setSuccess("PASSWORD_RESET_SUCCESSFUL. REDIRECTING...");
                setTimeout(() => navigate("/login"), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "RESET_FAILED_INVALID_TOKEN");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void flex items-center justify-center font-tech text-gray-200">
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-6 bg-[#0a0a1a]/90 border border-neon-cyan/30 rounded-xl backdrop-blur-md shadow-2xl">
                <div className="flex flex-col items-center mb-6">
                    <div className="p-3 bg-neon-cyan/10 rounded-full border border-neon-cyan/50 mb-2">
                        <Key size={24} className="text-neon-cyan" />
                    </div>
                    <h1 className="text-xl font-bold tracking-widest text-white">SECURE_RESET_CHANNEL</h1>
                    <p className="text-[10px] text-gray-500 font-mono mt-1">ESTABLISHING_NEW_CREDENTIALS</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-neon-red/10 border border-neon-red/50 rounded text-xs text-neon-red font-mono">
                        ERROR: {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-neon-green/10 border border-neon-green/50 rounded text-xs text-neon-green font-mono">
                        {success}
                    </div>
                )}

                {!success && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-neon-cyan tracking-widest font-mono">NEW_SECURITY_KEY</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-[#050510]/50 border border-[#30363d] rounded p-3 text-white focus:border-neon-cyan outline-none font-mono"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-neon-cyan tracking-widest font-mono">CONFIRM_SECURITY_KEY</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-[#050510]/50 border border-[#30363d] rounded p-3 text-white focus:border-neon-cyan outline-none font-mono"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan font-bold py-3 rounded hover:bg-neon-cyan/30 transition-all cursor-pointer mt-4 tracking-wider text-xs"
                        >
                            {loading ? "UPDATING_RECORD..." : "OVERWRITE_CREDENTIALS"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
