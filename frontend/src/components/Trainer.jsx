import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import uploadFile from "../helper/UploadFile";
import { FaUserTie, FaUserGraduate, FaEdit, FaTrashAlt, FaCloudUploadAlt, FaTimes, FaChevronLeft, FaChevronRight, FaFingerprint, FaBriefcase, FaEnvelope, FaPhone, FaCheckCircle, FaGlobe } from "react-icons/fa";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [page, setPage] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const trainersPerPage = 5;

  // ------------------ LOAD TRAINERS ------------------
  const loadTrainers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/user-details");
      setTrainers(data?.users?.trainers || []);
      setTotalStudents(data?.totalStudents || 0);
      setTotalTrainers(data?.totalTrainers || 0);
    } catch (err) {
      toast.error("Systems offline: Failed to synchronize faculty data");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  // ------------------ DELETE TRAINER ------------------
  const deleteTrainer = async (id) => {
    if (!window.confirm("Confirm protocol: Permanent deletion of faculty record?")) return;

    try {
      await api.delete(`/api/admin/delete/${id}`);
      toast.success("Personnel record expunged");
      loadTrainers();
    } catch (err) {
      toast.error("Protocol failure: Deletion rejected");
    }
  };

  // ------------------ UPDATE TRAINER ------------------
   const updateTrainer = async (e) => {
    e.preventDefault();

    if (!editingTrainer.name || !editingTrainer.email) {
      return toast.error("Identity metrics required (Name & Email)");
    }

    if (String(editingTrainer.phone).length !== 10) {
      return toast.error("Communication vector must be 10 digits");
    }

    try {
      setIsUpdating(true);
      await api.post(`/api/admin/update-user/${editingTrainer._id}`, {
          name: editingTrainer.name,
          email: editingTrainer.email,
          phone: editingTrainer.phone,
          experience: editingTrainer.experience,
          company: editingTrainer.company,
          profile_pic: editingTrainer.profile_pic
      });

      toast.success("Identity profile updated");
      setEditingTrainer(null);
      await loadTrainers();
    } catch (err) {
      toast.error("Systems error: Profile update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  // ------------------ PAGINATION ------------------
  const start = (page - 1) * trainersPerPage;
  const paginatedTrainers = trainers.slice(start, start + trainersPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 opacity-30 animate-pulse">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-[2.5rem] animate-spin mb-8"></div>
         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Accessing Faculty Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-fade-in">
      
      {/* -------------------------------- Overview Cards ------------------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] flex flex-col items-center text-center group hover:border-blue-600 hover:shadow-[0_50px_150px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mt-10 -mr-10 group-hover:bg-blue-600/10 transition-colors"></div>
             <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-900 mb-8 group-hover:scale-110 transition-transform duration-700 shadow-inner relative z-10">
                <FaFingerprint size={32}/>
             </div>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 relative z-10 italic">Lead Faculty Nodes</h2>
             <p className="text-6xl font-black text-slate-900 italic relative z-10">{totalTrainers}</p>
          </div>

          <div className="bg-slate-900 p-12 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col items-center text-center group hover:bg-blue-600 transition-all duration-700 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mb-10 -ml-10"></div>
             <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform duration-700 relative z-10">
                <FaUserGraduate size={32}/>
             </div>
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 relative z-10 italic">Total Cadets</h2>
             <p className="text-6xl font-black text-white italic relative z-10">{totalStudents}</p>
          </div>
        </div>

        {/* Students Per Trainer */}
        <div className="lg:col-span-8 bg-white rounded-[4rem] p-12 border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -mt-32 -mr-32 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-12 relative z-10">
             <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Distribution Matrix</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Faculty Load Matrix</h2>
                <p className="text-slate-500 text-xs font-medium mt-2 uppercase tracking-widest italic">Student assignment distribution across active mentors.</p>
             </div>
             <div className="flex gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed shadow-sm"
                >
                  <FaChevronLeft size={16}/>
                </button>
                <button
                  disabled={start + trainersPerPage >= trainers.length}
                  onClick={() => setPage(page + 1)}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed shadow-sm"
                >
                  <FaChevronRight size={16}/>
                </button>
             </div>
          </div>

          <div className="overflow-hidden relative z-10">
              <table className="w-full">
                <tbody className="divide-y divide-slate-50">
                  {paginatedTrainers.map((t) => (
                    <tr key={t._id} className="group hover:bg-slate-50/50 transition-all duration-500">
                      <td className="py-8 pr-6">
                        <div className="flex items-center gap-6">
                           <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-4 border-white shadow-xl group-hover:border-blue-100 transition-all duration-500">
                              {t.profile_pic ? (
                                <img src={t.profile_pic} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/>
                              ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200 font-black uppercase text-2xl italic">
                                  {t.name[0]}
                                </div>
                              )}
                           </div>
                           <div>
                              <p className="text-lg font-black text-slate-900 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">{t.name}</p>
                              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-1 italic">SECTOR CMD: {t.trainerId}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-8 text-right">
                        <div className="inline-flex items-center gap-4 bg-white text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-all shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                          {t.teachingCourses?.reduce((acc, c) => acc + (c.students?.length || 0), 0)} Assigned Cadets
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedTrainers.length === 0 && (
                    <tr>
                      <td colSpan={2} className="py-24 text-center opacity-30 italic font-black text-slate-300 uppercase tracking-[0.4em]">Sector Empty: No faculty detected</td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>
      </div>

      {/* --------------------------------- Trainers Full Table ------------------------- */}
      <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/30 rounded-full blur-[120px] -mb-40 -ml-40 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 relative z-10">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl shadow-slate-900/10">
                    <FaUserTie size={18}/>
                 </div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Personnel Directory</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Faculty Archives</h1>
              <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.2em] text-[10px] italic max-w-xl leading-relaxed">Audit and manage professional faculty curriculum assignments. Comprehensive neural sync monitoring active.</p>
           </div>
        </div>

        <div className="overflow-x-auto no-scrollbar rounded-[2.5rem] border border-slate-50 relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] italic">Personnel Node</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] italic">Designated Tracks</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] italic text-center">Cadet Load</th>
                  <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.4em] italic text-right">Management</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {trainers.map((trainer) => (
                  <tr key={trainer._id} className="group hover:bg-slate-50 transition-all duration-500">
                    <td className="px-10 py-10">
                        <div className="flex items-center gap-8">
                           <div className="w-20 h-20 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl group-hover:border-blue-100 transition-all duration-700 bg-white">
                              {trainer.profile_pic ? (
                                <img src={trainer.profile_pic} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/>
                              ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200 font-black text-3xl uppercase italic">
                                  {trainer.name[0]}
                                </div>
                              )}
                           </div>
                           <div>
                              <div className="text-slate-900 font-black text-xl group-hover:text-blue-600 transition-colors uppercase italic tracking-tight leading-none">{trainer.name}</div>
                              <div className="font-bold text-[9px] text-slate-300 mt-2 uppercase tracking-[0.3em] italic">{trainer.trainerId}</div>
                           </div>
                        </div>
                    </td>
                    <td className="px-10 py-10">
                       <div className="flex flex-wrap gap-3">
                          {trainer.teachingCourses.length > 0 ? (
                            trainer.teachingCourses.map((course, idx) => (
                              <span key={idx} className="bg-white text-slate-900 px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border border-slate-100 group-hover:border-blue-100 transition-colors shadow-sm">
                                {course.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-200 italic text-[10px] font-black uppercase tracking-[0.4em]">Unassigned Sector</span>
                          )}
                       </div>
                    </td>
                    <td className="px-10 py-10 text-center">
                      <div className="inline-block px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-blue-100 transition-all">
                         <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors italic">{trainer.teachingCourses?.reduce((acc, c) => acc + (c.students?.length || 0), 0)}</span>
                      </div>
                    </td>
                    <td className="px-10 py-10 text-right">
                        <div className="flex gap-4 justify-end">
                            <button
                                className="w-14 h-14 bg-white text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm group/btn"
                                onClick={() => setEditingTrainer(trainer)}
                                title="Edit Identity"
                            >
                                <FaEdit size={18} className="group-hover/btn:rotate-12 transition-transform"/>
                            </button>
                            <button
                                className="w-14 h-14 bg-white text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm group/btn"
                                onClick={() => deleteTrainer(trainer._id)}
                                title="Expunge Personnel"
                            >
                                <FaTrashAlt size={18} className="group-hover/btn:scale-110 transition-transform"/>
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {/* ------------------------------------ EDIT MODAL -------------------------------- */}
      {editingTrainer && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xl flex justify-center items-center p-6 z-[100] animate-fade-in">
          <div className="bg-white p-12 md:p-16 rounded-[4rem] w-full max-w-2xl border border-white shadow-2xl relative overflow-hidden animate-scale-in max-h-[95vh] flex flex-col">
            
            <button 
              onClick={() => setEditingTrainer(null)}
              className="absolute top-12 right-12 text-slate-300 hover:text-slate-900 transition-all hover:rotate-90 duration-500"
            >
               <FaTimes size={28}/>
            </button>

            <div className="text-center mb-12 shrink-0">
               <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-[2rem] mb-6 text-slate-900 shadow-inner">
                  <FaEdit size={28}/>
               </div>
               <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Modify Credentials</h2>
               <p className="text-slate-500 font-medium mt-3 uppercase tracking-[0.2em] text-[10px] italic">Update authorized faculty identity parameters.</p>
            </div>

            <div className="flex flex-col items-center mb-12 shrink-0">
               <div className="relative group cursor-pointer">
                 <div className="w-40 h-40 rounded-[3.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl group-hover:border-blue-100 transition-all duration-700 bg-white">
                    {editingTrainer.profile_pic ? (
                      <img src={editingTrainer.profile_pic} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/>
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200 text-5xl font-black uppercase italic">
                        {editingTrainer.name?.charAt(0)}
                      </div>
                    )}
                 </div>
                 <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    <FaCloudUploadAlt size={24}/>
                 </div>
                 <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploaded = await uploadFile(file);
                      setEditingTrainer({
                        ...editingTrainer,
                        profile_pic: uploaded?.secure_url,
                      });
                      toast.success("Identity visual synchronized");
                    }}
                  />
               </div>
            </div>

            <form onSubmit={updateTrainer} className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Registry Name</label>
                    <input
                        className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic placeholder:text-slate-200"
                        value={editingTrainer.name}
                        onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Secure Comms</label>
                    <div className="relative">
                        <input
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic placeholder:text-slate-200"
                            value={editingTrainer.email}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, email: e.target.value })}
                        />
                        <FaEnvelope className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Mobile Uplink</label>
                    <div className="relative">
                        <input
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic placeholder:text-slate-200"
                            value={editingTrainer.phone}
                            maxLength={10}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, phone: e.target.value.replace(/\D/g, "") })}
                        />
                        <FaPhone className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Battle Exp.</label>
                    <div className="relative">
                        <input
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic placeholder:text-slate-200"
                            value={editingTrainer.experience || ""}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, experience: e.target.value })}
                        />
                        <FaGlobe className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                    </div>
                </div>
              </div>

              <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Current Sector</label>
                  <div className="relative">
                      <input
                          className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic placeholder:text-slate-200"
                          value={editingTrainer.company || ""}
                          onChange={(e) => setEditingTrainer({ ...editingTrainer, company: e.target.value })}
                      />
                      <FaBriefcase className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                  </div>
              </div>

              <div className="pt-8">
                <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group"
                >
                    {isUpdating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <FaCheckCircle size={18} className="group-hover:rotate-12 transition-transform"/>
                    )}
                    {isUpdating ? "Synchronizing Matrix..." : "Commence Authorization Protocol"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
