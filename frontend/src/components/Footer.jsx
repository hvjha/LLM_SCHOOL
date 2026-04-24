import React from "react";
import { FaGraduationCap, FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaArrowRight, FaShieldAlt, FaFingerprint, FaGlobe } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 pt-48 pb-20 border-t border-slate-100 overflow-hidden relative">
      
      {/* Premium Decorative Accents */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-50/40 rounded-full blur-[140px] -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-slate-50 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <div className="container mx-auto max-w-[1600px] px-10 grid md:grid-cols-12 gap-24 mb-32 relative z-10">
        {/* Brand Architecture */}
        <div className="md:col-span-4 space-y-12">
          <div className="flex items-center gap-5 group">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-700">
              <FaGraduationCap size={32} />
            </div>
            <span className="text-3xl font-black tracking-tighter uppercase italic leading-none">
              EDU<span className="text-blue-600">Hub</span>.OS
            </span>
          </div>
          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-sm italic uppercase tracking-tighter">
            Empowering the next generation of digital pioneers through high-precision learning protocols and autonomous management systems.
          </p>
          <div className="flex gap-6">
            {[FaTwitter, FaLinkedin, FaGithub, FaInstagram].map((Icon, i) => (
              <a key={i} href="#" className="w-14 h-14 bg-white border border-slate-100 rounded-2xl hover:bg-slate-900 transition-all duration-700 text-slate-300 hover:text-white flex items-center justify-center hover:-translate-y-2 shadow-xl shadow-slate-900/5 group">
                <Icon size={20} className="group-hover:rotate-12 transition-transform"/>
              </a>
            ))}
          </div>
        </div>

        {/* Operational Vectors */}
        <div className="md:col-span-2 space-y-12">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 italic">Operational</h4>
          <ul className="space-y-6 text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">
            <li><a href="/courses" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Active Tracks</a></li>
            <li><a href="/about" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Genesis Core</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Intel Hub</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Faculty Node</a></li>
          </ul>
        </div>

        {/* Security Protocols */}
        <div className="md:col-span-2 space-y-12">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 italic">Security</h4>
          <ul className="space-y-6 text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Support Node</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Terms of Ops</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Privacy Data</a></li>
            <li><a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-4 group"><span className="w-0 group-hover:w-6 h-px bg-blue-600 transition-all duration-700"></span> Encryption</a></li>
          </ul>
        </div>

        {/* Neural Sync */}
        <div className="md:col-span-4 space-y-12">
          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] mb-6 italic">Neural Sync</h4>
          <p className="text-slate-500 text-xl font-medium italic uppercase tracking-tighter">Synchronize with our latest protocol changes and track deployments.</p>
          <div className="flex flex-col gap-6">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="SECURE COMMS ID" 
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-[2rem] px-10 py-6 text-[11px] font-black focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all uppercase tracking-widest placeholder:text-slate-200 italic"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/20 active:scale-95 group/btn">
                <FaArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-blue-50/50 rounded-full border border-blue-50 w-fit">
               <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
               <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Operational Sync Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Matrix */}
      <div className="container mx-auto max-w-[1600px] px-10 pt-16 border-t border-slate-100 flex flex-col xl:flex-row justify-between items-center gap-12 relative z-10">
        <div className="flex items-center gap-6">
           <FaShieldAlt className="text-slate-200" size={24}/>
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] italic">&copy; {new Date().getFullYear()} EDUHUB.OS // CORE ARCHITECTURE V.4.0</p>
        </div>
        <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 italic">
          <a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-3 group"><FaFingerprint size={14} className="group-hover:text-blue-600"/> Security</a>
          <a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-3 group"><FaGlobe size={14} className="group-hover:text-blue-600"/> Nodes</a>
          <a href="#" className="hover:text-blue-600 transition-all duration-500 flex items-center gap-3 group"><FaShieldAlt size={14} className="group-hover:text-blue-600"/> Privacy</a>
        </div>
      </div>
    </footer>
  );
}

