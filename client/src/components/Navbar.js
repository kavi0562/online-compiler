import { LogOut, ShieldAlert } from "lucide-react";
import ReactorLogo from "./scifi/ReactorLogo";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user, role }) {
  if (!user) return null;

  const isAdmin = role === 'admin';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "/"; // Force hard refresh
    } catch (error) {
      console.error("LOGOUT_FAILURE:", error);
    }
  };

  return (
    <div className="absolute top-0 w-full p-6 z-[9999] flex items-center justify-between pointer-events-none">

      {/* Brand Identity - Pointer events auto to allow interaction if needed, though mostly visual here */}
      <div className="flex items-center gap-3 pointer-events-auto bg-glass/20 border border-glass rounded-full px-4 py-2 backdrop-blur-md">
        <div className="p-1.5 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
          <ReactorLogo className="w-6 h-6 text-neon-cyan animate-spin-slow" />
        </div>
        <span className="text-sm font-bold tracking-[0.2em] text-white hidden md:block">
          REACTOR<span className="text-neon-cyan">.IO</span>
        </span>
      </div>

      <div className="flex items-center gap-4 pointer-events-auto">

        {/* Admin Link */}

        {isAdmin && (
          <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all group">
            <ShieldAlert size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest text-red-500 group-hover:text-red-400 font-mono">[ ADMIN_CORE ]</span>
          </Link>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 bg-glass border border-glass rounded-full px-4 py-2 hover:border-neon-cyan/50 transition-all group backdrop-blur-md">

          {/* Avatar Ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-neon-cyan blur-sm opacity-50 group-hover:opacity-100 animate-pulse"></div>
            <img
              src={user.photoURL}
              alt="User"
              className="w-8 h-8 rounded-full border border-neon-cyan/50 relative z-10"
            />
          </div>

          {/* User Stats */}
          <div className="flex flex-col">
            <span className="text-[10px] text-neon-cyan font-bold tracking-widest">{user.displayName ? user.displayName.toUpperCase() : 'UNKNOWN_UNIT'}</span>
            <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
              LINK_ACTIVE
            </span>
          </div>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleLogout}
          className="p-2 bg-neon-red/10 border border-neon-red/30 rounded-full text-neon-red hover:bg-neon-red/20 hover:shadow-[0_0_15px_rgba(255,50,50,0.4)] transition-all cursor-pointer"
          title="DISCONNECT SESSION"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;
