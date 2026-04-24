import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { FaUserGraduate, FaEnvelope, FaPhone, FaBook, FaEdit, FaTrashAlt, FaTimes, FaChalkboardTeacher, FaCheckCircle } from "react-icons/fa";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load students from API
  const loadStudents = async () => {
    try {
      const { data } = await api.get("/api/admin/user-details");
      setStudents(data?.users?.students || []);
    } catch (err) {
      toast.error("Systems Offline: Failed to fetch cadet records");
    }
  };

  // Load trainers from API
  const loadTrainers = async () => {
    try {
      const { data } = await api.get("/api/admin/get-all-trainers");
      setTrainers(data.trainers || []);
    } catch (err) {
      toast.error("Systems Offline: Failed to fetch faculty records");
    }
  };

  useEffect(() => {
    loadStudents();
    loadTrainers();
  }, []);

  // Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Confirm Protocol: Permanent deletion of cadet record?")) return;
    try {
      await api.delete(`/api/admin/delete/${id}`);
      toast.success("Cadet record expunged");
      await loadStudents();
    } catch (err) {
      toast.error("Protocol Failure: Deletion rejected");
    }
  };

  // Remove course from student
  const removeCourseFromStudent = async (studentId, courseId) => {
    if (!window.confirm("Confirm Action: Revoke cadet track access?")) return;

    try {
      await api.put(`/api/course/remove-course-from-student`, {
        studentId,
        courseId,
      });

      toast.success("Track access revoked");

      // Optimistic update in edit modal
      if (editingStudent?.studentId === studentId) {
        setEditingStudent((prev) => ({
          ...prev,
          enrolledCourses: prev.enrolledCourses.filter((c) => c.courseId !== courseId),
        }));
      }

      await loadStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol Failure: Operation rejected");
    }
  };

  // Update student info and assign trainers
  const updateStudent = async (e) => {
    e.preventDefault();

    try {
      setIsUpdating(true);
      // Update basic info
      await api.post(`/api/admin/update-user/${editingStudent._id}`, {
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone
      });

      // Assign trainers for courses that have trainerIdToAssign
      await Promise.all(
        (editingStudent.enrolledCourses || [])
          .filter((c) => c.trainerIdToAssign)
          .map((c) =>
            api.put("/api/course/assign-trainer", {
              courseId: c.courseId,
              trainerId: c.trainerIdToAssign,
            })
          )
      );

      toast.success("Cadet parameters synchronized");
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Systems Error: Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(JSON.parse(JSON.stringify(student))); 
  };

  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Cadet Network</h1>
            <p className="text-slate-500 font-medium mt-3 italic uppercase tracking-widest text-[10px]">Audit and manage active student tracks and assignments.</p>
         </div>
      </div>

      <div className="grid gap-10 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {students.length > 0 ? (
          students.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-[3.5rem] border border-slate-100 p-10 flex flex-col justify-between shadow-2xl shadow-slate-200/50 group hover:border-blue-600 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mt-10 -mr-10 group-hover:bg-blue-600/10 transition-colors"></div>

              <div>
                <div className="flex items-center gap-6 mb-10 relative z-10">
                   <div className="w-20 h-20 rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-xl group-hover:border-blue-600 transition-all duration-500">
                      {s.profile_pic ? (
                        <img src={s.profile_pic} alt="" className="w-full h-full object-cover"/>
                      ) : (
                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 font-black text-2xl uppercase">
                          {s.name[0]}
                        </div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{s.name}</h2>
                      <div className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        RANK: CADET #{s.studentId}
                      </div>
                   </div>
                </div>
                
                <div className="space-y-4 mb-10 relative z-10">
                    <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <FaEnvelope className="text-blue-600" size={12}/>
                        <span className="truncate">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-[11px] font-bold bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                        <FaPhone className="text-blue-600" size={12}/>
                        <span>{s.phone || "Comm Link Offline"}</span>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-3 px-2">
                     <FaBook className="text-slate-300" size={14}/>
                     <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Tracks</h3>
                  </div>
                  <div className="max-h-[250px] overflow-y-auto no-scrollbar space-y-3">
                    {s.enrolledCourses?.length > 0 ? (
                      s.enrolledCourses.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-5 bg-slate-50/50 border border-slate-100 rounded-3xl flex flex-col gap-2 group-hover:bg-white transition-all group/course"
                        >
                            <p className="text-sm font-black text-slate-900 uppercase italic leading-none group-hover/course:text-blue-600 transition-colors">{c.name}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{c.courseId}</span>
                                <div className="flex items-center gap-2">
                                   <FaChalkboardTeacher className="text-blue-400" size={10}/>
                                   <span className="text-[9px] font-black text-slate-600 uppercase italic">{c.trainer?.name || "Pending CMD"}</span>
                                </div>
                            </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unassigned Sector</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10 pt-8 border-t border-slate-50 relative z-10">
                <button
                  onClick={() => handleEdit(s)}
                  className="flex-1 h-14 bg-white text-slate-900 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <FaEdit className="group-hover/btn:scale-110 transition-transform" size={14}/> Modify
                </button>
                <button
                  onClick={() => deleteStudent(s._id)}
                  className="flex-1 h-14 bg-white text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl border border-slate-100 shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <FaTrashAlt className="group-hover/btn:scale-110 transition-transform" size={14}/> Expunge
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 text-center opacity-30 flex flex-col items-center">
              <FaUserGraduate size={64} className="text-slate-900 mb-6"/>
              <p className="text-4xl font-black text-slate-900 uppercase italic tracking-tight">Sector Isolated</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">No cadet personnel detected in current grid.</p>
          </div>
        )}
      </div>

      {/* ------------------------------------ EDIT MODAL -------------------------------- */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex justify-center items-center p-6 z-[100] animate-fade-in">
          <div className="bg-white p-12 rounded-[3.5rem] w-full max-w-xl border border-white shadow-2xl relative overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
            
            <button 
              onClick={() => setEditingStudent(null)}
              className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"
            >
               <FaTimes size={24}/>
            </button>

            <div className="text-center mb-10 shrink-0">
               <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Identity Overhaul</h2>
               <p className="text-slate-500 font-medium mt-1">Recalibrate cadet personnel parameters and deployment vectors.</p>
            </div>

            <form onSubmit={updateStudent} className="space-y-8 flex-1 overflow-y-auto no-scrollbar pr-2">
              <div className="grid gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Designation</label>
                   <input
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editingStudent.name || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      required
                    />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Comms ID</label>
                   <input
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editingStudent.email || ""}
                      onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                      required
                    />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Mobile Vector</label>
                   <input
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-3xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      value={editingStudent.phone || ""}
                      maxLength={10}
                      onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value.replace(/\D/g, "") })}
                    />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3 px-2 mb-6">
                   <FaBook className="text-blue-600" size={16}/>
                   <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Track Recalibration</h3>
                </div>
                
                <div className="space-y-4">
                  {editingStudent.enrolledCourses?.map((c, idx) => (
                    <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                           <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{c.name}</span>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">COURSE: {c.courseId}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCourseFromStudent(editingStudent.studentId, c.courseId)}
                          className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center border border-slate-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          title="Revoke Track"
                        >
                          <FaTrashAlt size={12}/>
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          FACULTY: <span className="text-slate-900 font-black">{c.trainer ? c.trainer.name : "UNASSIGNED"}</span>
                        </div>

                        {!c.trainer && (
                          <div className="relative">
                            <select
                              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none"
                              value={c.trainerIdToAssign || ""}
                              onChange={(e) => {
                                const updated = [...editingStudent.enrolledCourses];
                                updated[idx].trainerIdToAssign = e.target.value;
                                const name = trainers.find((t) => t.trainerId === e.target.value)?.name || "";
                                if (name) updated[idx].trainer = { name, trainerId: e.target.value };
                                setEditingStudent({ ...editingStudent, enrolledCourses: updated });
                              }}
                            >
                              <option value="">Appoint Faculty CMD</option>
                              {trainers.map((t) => (
                                <option key={t._id} value={t.trainerId}>
                                  {t.name} ({t.trainerId})
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               <FaChalkboardTeacher size={12}/>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!editingStudent.enrolledCourses || editingStudent.enrolledCourses.length === 0) && (
                    <p className="text-center py-10 text-[10px] font-black text-slate-300 uppercase italic">No active track assignments</p>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-50 shrink-0">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-3xl shadow-2xl shadow-slate-900/20 hover:bg-blue-600 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <FaCheckCircle size={16}/> {isUpdating ? "Synchronizing Cadet Matrix..." : "Apply Overhaul"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

