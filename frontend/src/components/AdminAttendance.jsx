import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch } from "react-icons/fa";

export default function AdminAttendance({ students }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Personnel Roster</h2>
          <p className="text-slate-500 font-medium mt-1">Manage and audit attendance records across sectors.</p>
        </div>
        <div className="relative group">
           <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <FaSearch size={14}/>
           </div>
           <input 
              type="text" 
              placeholder="Search personnel..." 
              className="bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all w-full md:w-80"
           />
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar max-h-[60vh] border border-slate-100 rounded-[2rem]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel Name</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tactical ID</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Comms Channel</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Protocol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map((s) => (
              <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-8 py-6">
                  <span className="text-slate-900 font-black text-sm uppercase italic group-hover:text-blue-600 transition-colors">{s.name}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-mono text-[10px] font-black uppercase tracking-tighter border border-slate-200">
                    {s.studentId}
                  </span>
                </td>
                <td className="px-8 py-6 text-[11px] font-bold text-slate-500 tracking-tight lowercase">
                  {s.email}
                </td>
                <td className="px-8 py-6 text-center">
                  <button
                    onClick={() => navigate(`/student-attendance?studentId=${s.studentId}`)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-lg shadow-slate-900/10 transition-all active:scale-95 group/btn"
                  >
                    <FaEye size={10} className="group-hover/btn:scale-125 transition-transform"/>
                    Audit Log
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {students.length === 0 && (
        <div className="p-20 text-center space-y-4 opacity-30 bg-slate-50 rounded-[2rem] mt-6 border border-dashed border-slate-200">
           <p className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Roster Empty</p>
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No active personnel detected in this sector.</p>
        </div>
      )}
    </div>
  );
}

