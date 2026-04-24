import React from "react";
import { FaGraduationCap } from "react-icons/fa";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md">
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-3xl">
      <div className="relative mb-12">
        <div className="w-32 h-32 rounded-[3rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 animate-pulse">
          <FaGraduationCap size={64} />
        </div>
        <div className="absolute inset-0 rounded-[3rem] border-8 border-blue-600/10 animate-ping"></div>
        <div className="absolute -inset-4 rounded-[3.5rem] border-2 border-slate-900/5 animate-spin"></div>
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
          EDU<span className="text-blue-600">HUB</span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic mt-4">
          Synchronizing Core Databases...
        </p>
      </div>
    </div>
  );
}
