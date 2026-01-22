import { useState } from 'react';
import { LogOut, ShieldAlert, Menu, X, LayoutDashboard, BookOpen, LogIn, CreditCard } from "lucide-react";
import ReactorLogo from "./scifi/ReactorLogo";
import { Link, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user, role, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = role === 'admin';

  // Handling internal logout if passed or default
  const handleLogoutInternal = async () => {
    if (onLogout) {
      onLogout();
    } else {
      try {
        await signOut(auth);
        localStorage.clear();
        window.location.href = "/";
      } catch (error) {
        console.error("LOGOUT_FAILURE:", error);
      }
    }
  };

  const navLinks = user ? [
    { name: 'DASHBOARD', path: '/', icon: <LayoutDashboard size={16} /> },
    { name: 'SYLLABUS', path: '/syllabus', icon: <BookOpen size={16} /> }
  ] : []; // No nav links for guests except brand

  return (
    <>
      <div className="absolute top-0 w-full p-4 md:p-6 z-[9999] flex items-center justify-between pointer-events-none">

        {/* Brand Identity (Left) */}
        <div className="flex items-center gap-3 pointer-events-auto bg-glass/20 border border-glass rounded-full px-4 py-2 backdrop-blur-md z-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-neon-cyan/10 rounded-full border border-neon-cyan/20">
              <ReactorLogo className="w-6 h-6 text-neon-cyan animate-spin-slow" />
            </div>
            <span className="text-sm font-bold tracking-[0.2em] text-white hidden md:block">
              REACTOR<span className="text-neon-cyan">.IO</span>
            </span>
          </Link>
        </div>

        {/* CENTER GROUP: Persistent Navigation */}
        <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-glass/20 border border-glass rounded-full px-2 py-1 backdrop-blur-md z-50 absolute left-1/2 -translate-x-1/2">
          {user && [
            { name: 'DASHBOARD', path: '/', icon: <LayoutDashboard size={16} /> },
            { name: 'SYLLABUS', path: '/syllabus', icon: <BookOpen size={16} /> },
            { name: 'PRICING', path: '/pricing', icon: <CreditCard size={16} /> }
          ].map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => `
                        flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-300
                        ${isActive
                  ? 'bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)] border border-neon-cyan/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                    `}
            >
              {link.icon}
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* RIGHT GROUP: Navigation + Auth (Right) */}
        <div className="flex items-center gap-4 pointer-events-auto z-50">

          {/* Desktop Navigation Links - MOVED TO DASHBOARD AS REQUESTED */}
          {/* <div className="hidden md:flex items-center gap-2 bg-glass/20 border border-glass rounded-full px-2 py-1 backdrop-blur-md"> ... </div> */}

          {/* Guest Login Button */}
          {!user && (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/50 rounded-full text-neon-cyan hover:bg-neon-cyan/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
            >
              <LogIn size={16} />
              <span className="text-xs font-bold tracking-widest">LOGIN</span>
            </Link>
          )}

          {/* Admin Link */}
          {user && isAdmin && (
            <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all group">
              <ShieldAlert size={14} className="text-red-500 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-red-500 group-hover:text-red-400 font-mono">[ ADMIN_CORE ]</span>
            </Link>
          )}

          {/* User Profile (Desktop) */}
          {user && (
            <div className="hidden md:flex items-center gap-3 bg-glass border border-glass rounded-full px-4 py-2 hover:border-neon-cyan/50 transition-all group backdrop-blur-md">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-neon-cyan blur-sm opacity-50 group-hover:opacity-100 animate-pulse"></div>
                <img
                  src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Detector"} // Fallback
                  alt="User"
                  className="w-8 h-8 rounded-full border border-neon-cyan/50 relative z-10"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-neon-cyan font-bold tracking-widest">{user.displayName ? user.displayName.toUpperCase().split(' ')[0] : 'UNIT'}</span>
                <span className="text-[8px] text-gray-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></span>
                  LINK_ACTIVE
                </span>
              </div>
            </div>
          )}

          {/* Logout (Desktop) */}
          {user && (
            <button
              onClick={handleLogoutInternal}
              className="hidden md:flex p-2 bg-neon-red/10 border border-neon-red/30 rounded-full text-neon-red hover:bg-neon-red/20 hover:shadow-[0_0_15px_rgba(255,50,50,0.4)] transition-all cursor-pointer"
              title="DISCONNECT SESSION"
            >
              <LogOut size={16} />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 bg-glass border border-glass rounded-full text-neon-cyan pointer-events-auto backdrop-blur-md active:scale-95 transition-transform"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9990] bg-[#050510]/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center p-8 animate-in fade-in duration-200 pointer-events-auto">
          <div className="flex flex-col gap-6 w-full max-w-sm">

            {/* Guest Mobile Links */}
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold tracking-widest bg-neon-cyan/10 text-neon-cyan border border-neon-cyan transition-all"
              >
                <LogIn size={20} />
                LOGIN
              </Link>
            )}

            {user && navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                                flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold tracking-widest transition-all duration-300 border
                                ${isActive
                    ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.2)]'
                    : 'bg-[#0a0a1a] text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white'}
                            `}
              >
                {link.icon}
                {link.name}
              </NavLink>
            ))}

            <div className="w-full h-px bg-gray-800 my-2"></div>

            {user && isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold tracking-widest bg-red-500/10 text-red-500 border border-red-500/30">
                <ShieldAlert size={20} />
                ADMIN CORE
              </Link>
            )}

            {user && (
              <button
                onClick={handleLogoutInternal}
                className="flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-bold tracking-widest bg-neon-red/10 text-neon-red border border-neon-red/30 hover:bg-neon-red/20 transition-all"
              >
                <LogOut size={20} />
                DISCONNECT
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
