import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaHistory, FaCheckCircle, FaExclamationTriangle, FaBoxOpen, FaLayerGroup, FaCalendarAlt, FaShieldAlt, FaBookOpen } from "react-icons/fa";

export default function StudentLibraryHistory({ studentId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!studentId) return;
      setLoading(true);
      try {
        const { data } = await api.get(`/api/library/history/student/${studentId}`);
        setHistory(data.history || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Systems Failure: History retrieval failed");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [studentId]);

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Personal Library Archives</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Accessing your tactical intelligence circulation history.</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 animate-pulse relative z-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Synchronizing Logs...</p>
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center relative z-10">
          <FaBoxOpen size={48} className="text-slate-300 mb-8"/>
          <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Archives Clear</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">NO OPERATION LOGS DETECTED</p>
        </div>
      )}

      <div className="space-y-12 relative z-10">
        {history.map((batch) => (
          <div key={batch._id} className="bg-slate-50 rounded-[3rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-700 group/batch">
            <div className="bg-white p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                   <FaCalendarAlt size={18}/>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Deployment Date</p>
                   <p className="font-black text-slate-900 text-lg italic tracking-tighter mt-1">
                     {new Date(batch.issueDate).toLocaleDateString()}
                   </p>
                </div>
              </div>
              <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 shadow-sm ${
                batch.batchCompleted 
                ? "bg-green-50 text-green-600 border border-green-100" 
                : "bg-blue-50 text-blue-600 border border-blue-100"
              }`}>
                <div className={`w-2 h-2 rounded-full ${batch.batchCompleted ? "bg-green-500" : "bg-blue-500 animate-pulse"}`}></div>
                {batch.batchCompleted ? "Protocol: Mission Complete" : "Protocol: Active Engagement"}
              </div>
            </div>

            <div className="p-0 overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead className="bg-slate-100/50 text-slate-400">
                  <tr>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] italic">Intelligence Asset</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] italic">Deadline</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] italic">Returned</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] italic text-center">Status</th>
                    <th className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.4em] italic text-right">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batch.books.map((item, idx) => (
                    <tr key={idx} className="group/row hover:bg-white transition-colors">
                      <td className="px-8 py-6 font-black text-slate-900 text-sm uppercase italic tracking-tighter group-hover/row:text-blue-600 transition-colors flex items-center gap-4">
                        <FaBookOpen className="text-slate-200 group-hover/row:text-blue-200 transition-colors" size={14}/>
                        {item.title}
                      </td>
                      <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{new Date(batch.dueDate).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                        {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] uppercase font-black tracking-widest italic ${
                          item.status === 'returned' 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-blue-600 bg-blue-50'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${item.status === 'returned' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-slate-900 text-sm italic tracking-tighter">
                        {item.fine > 0 ? `₹${item.fine}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white border-t border-slate-100">
                  <tr>
                    <td colSpan="4" className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Total Batch Penalty</td>
                    <td className="px-8 py-6 text-right font-black text-red-600 text-lg italic tracking-tighter">₹{batch.totalFine}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
