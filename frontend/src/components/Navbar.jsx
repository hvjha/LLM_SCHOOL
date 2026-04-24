import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaGraduationCap, FaUserCircle, FaSignOutAlt, FaBars, FaTimes, FaArrowRight } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleRoleClick = () => {
    if (!user) return;
    if (user.role === "superadmin") navigate("/admin");
    else if (user.role === "trainer") navigate("/trainer");
    else if (user.role === "student") navigate("/student");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
      scrolled ? "py-4" : "py-8"
    }`}>
      <div className={`container mx-auto px-6 md:px-12 flex items-center justify-between transition-all duration-700 ${
        scrolled ? "bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 py-4 border border-white/20" : "bg-transparent py-0"
      }`}>
        <div className="flex items-center gap-16">
          {/* Brand/Logo */}
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl group-hover:bg-blue-600 group-hover:rotate-[15deg] transition-all duration-700">
              <FaGraduationCap size={26} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">
              EDU<span className="text-blue-600">Hub</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all hover:text-blue-600 relative group ${
                  location.pathname === link.path ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 h-[3px] bg-blue-600 rounded-full transition-all duration-500 ${
                  location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                }`}></span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <button
              onClick={() => navigate("/auth")}
              className="hidden md:flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group"
            >
              Get Started <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={handleRoleClick}
                className="flex items-center gap-3 px-6 py-3.5 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-100 shadow-sm"
              >
                <FaUserCircle size={18} />
                <span>{user.role === 'superadmin' ? 'Admin' : user.role}</span>
              </button>
              <button
                onClick={logout}
                className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center border border-slate-100 group shadow-sm"
              >
                <FaSignOutAlt className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Mobile Toggle */}
          <button 
            className="md:hidden w-12 h-12 flex items-center justify-center bg-white text-slate-900 border border-slate-100 rounded-2xl shadow-xl active:scale-90 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-0 left-0 w-full h-screen bg-slate-900/40 backdrop-blur-2xl z-[90] md:hidden transition-all duration-700 ${
        mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="bg-white w-full pt-32 pb-16 px-10 rounded-b-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-b border-slate-100 flex flex-col gap-10">
          <div className="space-y-4">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4 pl-2 italic">Navigation</p>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                className="text-4xl font-black text-slate-900 text-left hover:text-blue-600 transition-all uppercase italic tracking-tighter"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="h-px bg-slate-100 w-full"></div>
          
          {!user ? (
            <button
              onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              Unlock Access
            </button>
          ) : (
            <div className="flex flex-col gap-6">
              <button
                onClick={handleRoleClick}
                className="flex items-center justify-center gap-4 w-full py-6 bg-blue-50 text-blue-600 rounded-[2rem] font-black text-lg uppercase tracking-widest border border-blue-100 active:scale-95 transition-all"
              >
                <FaUserCircle size={22} /> Operations Center
              </button>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="flex items-center justify-center gap-4 w-full py-5 bg-red-50 text-red-500 rounded-[2rem] font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
              >
                <FaSignOutAlt /> Terminate Session
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

