import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaHistory, FaCheckCircle, FaExclamationTriangle, FaCoins, FaBoxOpen, FaLayerGroup, FaUserShield, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

export default function LibraryHistory() {
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/library/history/library");
      setHistory(data.report || []);
      setSummary(data.summary || null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Systems Failure: History retrieval aborted");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Operation Logs & Archives</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Comprehensive audit trail of asset circulation and penalty resolution.</p>
      </div>

      {/* SUMMARY MATRIX */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 relative z-10">
          <SummaryCard label="Total Missions" value={summary.totalIssues} icon={<FaHistory />} color="blue" />
          <SummaryCard label="Active Deployments" value={summary.totalIssued} icon={<FaShieldAlt />} color="amber" />
          <SummaryCard label="Completed Returns" value={summary.totalReturned} icon={<FaCheckCircle />} color="green" />
          <SummaryCard label="Fine Revenue" value={`₹${summary.totalFineCollected}`} icon={<FaCoins />} color="slate" />
        </div>
      )}

      {/* LOG TABLE */}
      <div className="relative z-10 h-[600px] overflow-y-auto pr-4 no-scrollbar custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead className="sticky top-0 bg-white z-20">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Intelligence Asset</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Personnel</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Deployment</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Deadline</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Penalty</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => (
              <tr key={h._id} className="group/row">
                <td className="px-8 py-6 bg-slate-50 rounded-l-[2rem] group-hover/row:bg-slate-100 transition-colors">
                  <p className="font-black text-slate-900 text-sm uppercase italic tracking-tighter group-hover/row:text-blue-600 transition-colors">{h.book?.title}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ID: {h.book?.isbn}</p>
                </td>
                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                       <FaUserShield size={12}/>
                    </div>
                    <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{h.student?.name}</p>
                  </div>
                </td>
                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                   <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{new Date(h.issueDate).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                   <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{new Date(h.dueDate).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${
                      h.status === "returned"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${h.status === "returned" ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}></div>
                    {h.status}
                  </span>
                </td>
                <td className="px-8 py-6 bg-slate-50 rounded-r-[2rem] group-hover/row:bg-slate-100 transition-colors text-center font-black text-slate-900 text-sm italic tracking-tighter">
                   {h.fine > 0 ? `₹${h.fine}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
           <div className="flex flex-col items-center justify-center py-24 gap-6 animate-pulse">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Archives...</p>
           </div>
        )}
        
        {!loading && history.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center">
            <FaBoxOpen size={48} className="text-slate-300 mb-8"/>
            <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Archives Clear</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">NO OPERATION LOGS DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
}

const SummaryCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    green: "text-green-600 bg-green-50 border-green-100",
    slate: "text-slate-900 bg-slate-50 border-slate-200",
  };
  
  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner border ${colors[color] || colors.slate}`}>
         {React.cloneElement(icon, { size: 20 })}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-3 italic">{label}</p>
      <p className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">{value}</p>
      
      {/* Decorative */}
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:scale-150 transition-transform duration-700`}>
         {React.cloneElement(icon, { size: 80 })}
      </div>
    </div>
  );
};
