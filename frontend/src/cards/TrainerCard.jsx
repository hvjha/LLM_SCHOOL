import React, { useContext } from "react";
import { FaEnvelope, FaBriefcase, FaUserGraduate, FaPhone, FaLock } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export default function TrainerCard({ trainer }) {
  const { user } = useContext(AuthContext);
  // Show contact info if user is logged in
  const canViewContact = !!user;

  return (
    <div
      key={trainer.trainerId}
      className="group glass-card rounded-[2.5rem] p-8 flex flex-col items-center text-center hover-lift transition-all duration-500 h-[520px] w-80 border-slate-100 shadow-lg shadow-slate-200/50 shrink-0"
    >
      {/* Avatar Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-700 blur-2xl opacity-50"></div>
        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
          {trainer.profile_pic ? (
            <img
              src={trainer.profile_pic}
              alt={trainer.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-black text-4xl">
              {trainer.name?.[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-blue-600 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl rotate-12">
           <FaUserGraduate size={20} />
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-6 flex-1 w-full">
        <div>
          <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">{trainer.name}</h3>
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Senior Mentor</p>
        </div>

        <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest">
          <div className="space-y-1.5">
            <span className="flex items-center justify-center gap-2 text-blue-600"><FaBriefcase /> Focus</span>
            <span className="text-slate-900 truncate block">{trainer.company || "Mentorship"}</span>
          </div>
          <div className="space-y-1.5">
            <span className="flex items-center justify-center gap-2 text-blue-600"><FaUserGraduate /> Mastery</span>
            <span className="text-slate-900 block">{trainer.experience || 0} Years</span>
          </div>
        </div>

        <div className="space-y-3">
          {canViewContact ? (
            <>
              <div className="flex items-center justify-center gap-3 p-3.5 bg-slate-50 rounded-2xl text-slate-600 text-[11px] font-bold transition-all group-hover:bg-blue-50 border border-slate-100">
                <FaEnvelope className="text-blue-600" /> {trainer.email}
              </div>
              <div className="flex items-center justify-center gap-3 p-3.5 bg-slate-50 rounded-2xl text-slate-600 text-[11px] font-bold transition-all group-hover:bg-blue-50 border border-slate-100">
                <FaPhone className="text-blue-600" /> +91 {trainer.phone || "HIDDEN"}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 opacity-60 group-hover:opacity-100 transition-opacity">
              <FaLock className="text-blue-600/30 mb-2" size={24} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                Contact Data Encrypted<br/>
                <span className="text-[8px] text-blue-600 font-bold">(Login Required)</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

