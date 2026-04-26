import React, { useContext } from "react";
import { FaEnvelope, FaBriefcase, FaUserGraduate, FaPhone, FaLock, FaShieldAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function TrainerCard({ trainer }) {
  const { user } = useContext(AuthContext);
  const canViewContact = !!user;

  return (
    <div
      key={trainer.trainerId}
      className="group bg-white rounded-[4rem] p-10 flex flex-col items-center text-center transition-all duration-700 min-h-[640px] h-auto w-full max-w-[360px] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] hover:shadow-[0_50px_150px_rgba(59,130,246,0.1)] hover:-translate-y-4 relative overflow-hidden shrink-0"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mt-16 -mr-16 group-hover:bg-blue-600/5 transition-colors duration-700"></div>

      {/* Avatar Section */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-blue-600/5 rounded-full scale-125 group-hover:scale-150 transition-transform duration-1000 blur-3xl opacity-50"></div>
        <div className="relative w-44 h-44 rounded-[3.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl group-hover:border-blue-50 transition-colors duration-700">
          {trainer.profile_pic ? (
            <img
              src={trainer.profile_pic}
              alt={trainer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-black text-5xl italic">
              {trainer.name?.[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-white rounded-2xl border-4 border-slate-50 flex items-center justify-center text-blue-600 shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
           <FaShieldAlt size={24} />
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-8 flex-1 w-full relative z-10">
        <div>
          <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tighter uppercase italic leading-none">{trainer.name}</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">Lead Personnel Authority</p>
        </div>

        <div className="pt-8 grid grid-cols-2 gap-8 border-t border-slate-100">
          <div className="space-y-2 text-left">
            <span className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest italic"><FaBriefcase size={10}/> Company</span>
            <span className="text-slate-900 text-sm font-black uppercase italic tracking-tight truncate block">{trainer.company || "CORPORATE"}</span>
          </div>
          <div className="space-y-2 text-left border-l border-slate-50 pl-8">
            <span className="flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest italic"><FaUserGraduate size={10}/> Experience</span>
            <span className="text-slate-900 text-sm font-black uppercase italic tracking-tight block">{trainer.experience || 0} YEARS</span>
          </div>
        </div>

        <div className="space-y-4">
          {canViewContact ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4 p-5 bg-slate-50 rounded-2xl text-slate-500 text-[11px] font-black uppercase italic tracking-tight transition-all group-hover:bg-blue-50 border border-slate-100 group-hover:text-blue-600 group-hover:border-blue-100">
                <FaEnvelope className="text-blue-600/50 group-hover:text-blue-600" size={14}/> {trainer.email}
              </div>
              <div className="flex items-center justify-center gap-4 p-5 bg-slate-50 rounded-2xl text-slate-500 text-[11px] font-black uppercase italic tracking-tight transition-all group-hover:bg-blue-50 border border-slate-100 group-hover:text-blue-600 group-hover:border-blue-100">
                <FaPhone className="text-blue-600/50 group-hover:text-blue-600" size={14}/> +91 {trainer.phone || "SECURE"}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 opacity-60 group-hover:opacity-100 transition-opacity">
              <FaLock className="text-blue-600/30 mb-4" size={28} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-tight italic">
                Uplink Encrypted<br/>
                <span className="text-[8px] text-blue-600 font-bold mt-2 inline-block">AUTHENTICATION REQUIRED</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

