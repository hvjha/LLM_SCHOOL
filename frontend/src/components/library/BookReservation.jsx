import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaBook, FaUserCircle, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaBoxOpen, FaLayerGroup, FaShieldAlt } from "react-icons/fa";

export default function BookReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/library/book/reservation/all");
      setReservations(data.reservations || []);
    } catch (err) {
      toast.error("Systems Failure: Reservation retrieval failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Advanced Reservations</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Monitor and authorize asset reservation requests from tactical personnel.</p>
      </div>

      <div className="relative z-10 h-[600px] overflow-y-auto pr-4 no-scrollbar custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead className="sticky top-0 bg-white z-20">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Asset Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Requester</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Reserved</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Expires</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-right">Directives</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r._id} className="group/row">
                <td className="px-8 py-6 bg-slate-50 rounded-l-[2.5rem] group-hover/row:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-6">
                    {r.book?.coverImage ? (
                      <div className="w-12 h-16 rounded-xl border-2 border-white shadow-xl group-hover/row:scale-110 transition-transform duration-500 bg-cover bg-center" style={{ backgroundImage: `url(${r.book.coverImage})` }}></div>
                    ) : (
                      <div className="w-12 h-16 bg-white rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-200">
                        <FaBook size={20} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-black text-slate-900 text-sm uppercase italic leading-tight truncate tracking-tighter group-hover/row:text-blue-600 transition-colors">{r.book?.title}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">ISBN: {r.book?.isbn}</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                       <FaUserCircle size={20}/>
                    </div>
                    <div>
                       <p className="font-black text-slate-900 text-[11px] uppercase italic tracking-tight">{r.student?.name}</p>
                       <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mt-1">Personnel ID Lock</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                   <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{new Date(r.reservationDate).toLocaleDateString()}</p>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                   <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{new Date(r.expiryDate).toLocaleDateString()}</p>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${
                      r.status === "fulfilled"
                        ? "bg-green-50 text-green-600"
                        : r.status === "cancelled"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${r.status === "fulfilled" ? "bg-green-500" : r.status === "cancelled" ? "bg-red-500" : "bg-amber-500 animate-pulse"}`}></div>
                    {r.status}
                  </span>
                </td>

                <td className="px-8 py-6 bg-slate-50 rounded-r-[2.5rem] group-hover/row:bg-slate-100 transition-colors text-right">
                  {r.status === 'pending' && (
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={async () => {
                          const dueDate = prompt("ESTABLISH RETURN CYCLE (YYYY-MM-DD):", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                          if (!dueDate) return;
                          try {
                            await api.post(`/api/library/book/reservation/fulfill/${r._id}`, { dueDate });
                            toast.success("Protocol Success: Asset authorized");
                            loadReservations();
                          } catch (err) {
                            toast.error(err.response?.data?.message || "Authorization Failed");
                          }
                        }}
                        className="bg-white text-green-600 p-4 rounded-xl border border-green-100 hover:bg-green-600 hover:text-white hover:shadow-xl hover:shadow-green-900/10 transition-all active:scale-90"
                        title="Authorize Deployment"
                      >
                        <FaCheckCircle size={14} />
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm("Cancel this reservation?")) return;
                          try {
                            await api.delete(`/api/library/book/reservation/cancel/${r._id}`);
                            toast.success("Protocol: Reservation canceled");
                            loadReservations();
                          } catch (err) {
                            toast.error("Protocol Failure: Termination failed");
                          }
                        }}
                        className="bg-white text-red-600 p-4 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-xl hover:shadow-red-900/10 transition-all active:scale-90"
                        title="Cancel Reservation"
                      >
                        <FaTimesCircle size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
           <div className="flex flex-col items-center justify-center py-24 gap-6 animate-pulse">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Requests...</p>
           </div>
        )}
        
        {!loading && reservations.length === 0 && (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center">
            <FaBoxOpen size={48} className="text-slate-300 mb-8"/>
            <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Reservations Clear</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">NO ACTIVE REQUESTS DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
}
