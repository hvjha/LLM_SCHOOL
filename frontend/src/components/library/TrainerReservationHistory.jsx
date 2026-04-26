// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import { toast } from "react-toastify";
// import { FaBook, FaCalendarAlt } from "react-icons/fa";

// export default function TrainerReservationHistory() {
//   const [reservations, setReservations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchMyReservations = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get("/api/library/book/reservation/trainer");
//       setReservations(data.reservations || []); 
//     } catch (err) {
//       toast.error("Failed to load your reservations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMyReservations();
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
//     try {
//       await api.delete(`/api/library/book/reservation/cancel/${id}`);
//       toast.success("Reservation cancelled");
//       fetchMyReservations();
//     } catch (err) {
//       toast.error("Failed to cancel reservation");
//     }
//   };

//   // Removing the fetchFixed redundant test function
  
//   return (
//     <div className="bg-white p-6 rounded shadow min-h-[50vh]">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
//         <FaCalendarAlt className="text-blue-600" /> My Book Reservations
//       </h2>

//       {loading ? (
//         <div className="flex justify-center py-10">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {reservations.length === 0 ? (
//             <p className="text-center py-20 text-gray-500 italic bg-gray-50 rounded border border-dashed">
//               You haven't reserved any books yet.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left border-collapse">
//                 <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//                   <tr>
//                     <th className="p-4 rounded-tl-lg">Book Details</th>
//                     <th className="p-4">Reserved On</th>
//                     <th className="p-4">Expiry Date</th>
//                     <th className="p-4 text-center">Status</th>
//                     <th className="p-4 text-right rounded-tr-lg">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {reservations.map((res) => (
//                     <tr key={res._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="p-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-14 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
//                             {res.book?.coverImage ? (
//                                 <img src={res.book.coverImage} className="w-full h-full object-cover" />
//                             ) : (
//                                 <FaBook className="text-gray-400" />
//                             )}
//                           </div>
//                           <div>
//                             <p className="font-bold text-gray-800 uppercase text-[10px] tracking-tight">{res.book?.category}</p>
//                             <p className="font-semibold text-sm">{res.book?.title}</p>
//                             <p className="text-xs text-gray-500">{res.book?.isbn}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="p-4 text-gray-600">
//                         {new Date(res.reservationDate || res.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="p-4 text-red-500 font-medium">
//                         {new Date(res.expiryDate).toLocaleDateString()}
//                       </td>
//                       <td className="p-4 text-center">
//                         <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
//                           res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
//                           res.status === 'fulfilled' ? 'bg-green-100 text-green-700' :
//                           'bg-red-100 text-red-700'
//                         }`}>
//                           {res.status}
//                         </span>
//                       </td>
//                       <td className="p-4 text-right">
//                         {res.status === 'pending' && (
//                           <button 
//                             onClick={() => handleCancel(res._id)}
//                             className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1 rounded text-xs font-bold transition-all shadow-sm"
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
      
//       <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded-lg">
//         <h4 className="font-bold text-blue-800 mb-2 text-sm uppercase tracking-wide">💡 Reservation Rules:</h4>
//         <ul className="text-xs text-blue-700 list-disc ml-5 space-y-1">
//           <li>You can reserve a maximum of <strong>3 books</strong> at any given time.</li>
//           <li>Each reserved book must belong to a <strong>different category</strong>.</li>
//           <li>Reservations are valid for <strong>3 days</strong>, after which they expire automatically.</li>
//         </ul>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaBook, FaCalendarAlt, FaShieldAlt, FaBoxOpen, FaLayerGroup, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaBookOpen } from "react-icons/fa";

export default function TrainerReservationHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyReservations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/library/book/reservation/trainer");
      setReservations(data.reservations || []);
    } catch (err) {
      toast.error("Systems Failure: Archive retrieval failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReservations();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await api.delete(`/api/library/book/reservation/cancel/${id}`);
      toast.success("Protocol: Reservation canceled");
      fetchMyReservations();
    } catch {
      toast.error("Protocol Failure: Termination failed");
    }
  };

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Reservation Archives</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Reviewing your tactical asset reservation history and status.</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-6 animate-pulse relative z-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Archives...</p>
        </div>
      )}

      {!loading && reservations.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center relative z-10">
          <FaBoxOpen size={48} className="text-slate-300 mb-8"/>
          <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Archives Clear</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">NO ACTIVE REQUESTS DETECTED</p>
        </div>
      )}

      {reservations.length > 0 && (
        <div className="relative z-10 h-[500px] overflow-y-auto pr-4 no-scrollbar custom-scrollbar">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead className="sticky top-0 bg-white z-20">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Intelligence Asset</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Reserved</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Expiry</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-center">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic text-right">Directives</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((res) => (
                <tr key={res._id} className="group/row">
                  <td className="px-8 py-6 bg-slate-50 rounded-l-[2.5rem] group-hover/row:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-16 bg-white rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-200 overflow-hidden shadow-sm">
                        {res.book?.coverImage ? (
                          <img src={res.book.coverImage} className="w-full h-full object-cover" />
                        ) : (
                          <FaBookOpen size={20} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest italic mb-1">{res.book?.category}</p>
                        <p className="font-black text-slate-900 text-sm uppercase italic leading-tight truncate tracking-tighter group-hover/row:text-blue-600 transition-colors">{res.book?.title}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{res.book?.isbn}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest italic">
                      {new Date(res.reservationDate || res.createdAt).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                    <p className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest italic">
                      {new Date(res.expiryDate).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${
                        res.status === "pending"
                          ? "bg-amber-50 text-amber-600"
                          : res.status === "fulfilled"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${res.status === "pending" ? "bg-amber-500 animate-pulse" : res.status === "fulfilled" ? "bg-green-500" : "bg-red-500"}`}></div>
                      {res.status}
                    </span>
                  </td>

                  <td className="px-8 py-6 bg-slate-50 rounded-r-[2.5rem] group-hover/row:bg-slate-100 transition-colors text-right">
                    {res.status === "pending" && (
                      <button
                        onClick={() => handleCancel(res._id)}
                        className="bg-white text-red-600 p-4 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white hover:shadow-xl hover:shadow-red-900/10 transition-all active:scale-90"
                        title="Cancel Reservation"
                      >
                        <FaTimesCircle size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PROTOCOL OVERLAY */}
      <div className="mt-12 bg-slate-50 border border-slate-100 p-10 rounded-[3rem] relative overflow-hidden group/rules relative z-10">
        <div className="flex items-center gap-4 mb-6">
           <FaShieldAlt className="text-blue-600" size={18}/>
           <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.4em] italic">Reservation Protocol</h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">Maximum of <strong>3 intelligence assets</strong> may be locked simultaneously.</p>
           </li>
           <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">Each asset must belong to a <strong>unique operational category</strong>.</p>
           </li>
           <li className="flex gap-4">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed">Reservations auto-expire after <strong>72 hours</strong> of inactivity.</p>
           </li>
        </ul>
        
        {/* Visual Accent */}
        <FaInfoCircle className="absolute -right-8 -bottom-8 text-slate-200 opacity-20 group-hover:scale-110 transition-transform duration-1000" size={120}/>
      </div>
    </div>
  );
}

