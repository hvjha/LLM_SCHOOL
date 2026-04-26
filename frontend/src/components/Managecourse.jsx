import React, { useState, useEffect } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import uploadFile from "../helper/UploadFile";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaEdit, FaTrashAlt, FaUsers, FaChalkboardTeacher, FaPlus, FaTimes, FaCloudUploadAlt, FaCheckCircle, FaTrash, FaLayerGroup } from "react-icons/fa";

export default function ManageCourses({ onCourseUpdated }) {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [removingStudents, setRemovingStudents] = useState(false);

  /* ================= LOAD COURSES ================= */
  const loadCourses = async () => {
    try {
      const { data } = await api.get("/api/course/courses");
      setCourses(data.courses || data);
    } catch (err) {
      toast.error("Systems Error: Failed to synchronize curriculum database");
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  /* ================= TRAINERS ================= */
  const getAllTrainers = () => {
    const trainerMap = {};
    courses.forEach((c) => {
      (c.trainers || []).forEach((t) => {
        trainerMap[t.trainerId] = t.name;
      });
    });
    return Object.entries(trainerMap).map(([id, name]) => ({
      trainerId: id,
      name,
    }));
  };

  /* ================= EDIT COURSE ================= */
  const startEditCourse = (c) => {
    setEditingCourse({
      id: c._id,
      courseId: c.courseId,
      name: c.name,
      price: c.price,
      course_img: c.course_img,
      trainers: (c.trainers || []).map((t) => ({
        trainerId: t.trainerId,
        name: t.name,
      })),
      students: (c.students || []).map((s) => ({
        _id: s._id,
        name: s.name,
        studentId: s.studentId,
      })),
    });
    setSelectedStudents([]);
  };

  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/course/update-course/${editingCourse.id}`, {
        courseId: editingCourse.courseId,
        name: editingCourse.name,
        price: editingCourse.price,
        course_img: editingCourse.course_img,
        trainerIds: editingCourse.trainers.map((t) => t.trainerId),
      });
      toast.success("Curriculum recalibrated successfully");
      setEditingCourse(null);
      loadCourses();
      onCourseUpdated?.();
    } catch (err) {
      toast.error("Protocol failure: Update rejected by core");
    }
  };

  const deleteCourse = async (id) => {
    if (!confirm("Confirm Protocol: Permanent deletion of curriculum track?")) return;
    try {
      await api.delete(`/api/course/delete-course/${id}`);
      toast.success("Curriculum track deleted");
      loadCourses();
    } catch (err) {
      toast.error("Systems Failure: Data synchronization failed");
    }
  };

  /* ================= TRAINER HANDLING ================= */
  const removeTrainer = (trainerId) => {
    setEditingCourse({
      ...editingCourse,
      trainers: editingCourse.trainers.filter(
        (t) => t.trainerId !== trainerId
      ),
    });
  };

  const addTrainer = (trainerId) => {
    const trainerToAdd = getAllTrainers().find(
      (t) => t.trainerId === trainerId
    );
    if (!trainerToAdd) return;
    if (editingCourse.trainers.some((t) => t.trainerId === trainerId)) return;

    setEditingCourse({
      ...editingCourse,
      trainers: [...editingCourse.trainers, trainerToAdd],
    });
  };

  /* ================= REMOVE STUDENTS ================= */
  const removeSelectedStudents = async () => {
    if (!selectedStudents.length) return;
    if (!confirm("Confirm Protocol: Permanent revocation of access for selected cadets?")) return;

    try {
      setRemovingStudents(true);

      for (const studentId of selectedStudents) {
        await api.put(
          `/api/course/${editingCourse.id}/remove-student`,
          { studentId }
        );
      }

      toast.success("Personnel access revoked");

      // update local state
      setEditingCourse((prev) => ({
        ...prev,
        students: prev.students.filter(
          (s) => !selectedStudents.includes(s.studentId)
        ),
      }));

      setSelectedStudents([]);
      loadCourses();
      onCourseUpdated?.();
    } catch (err) {
      toast.error("Protocol Error: Personnel purging failed");
    } finally {
      setRemovingStudents(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-12 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div>
           <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Sector Intelligence</h1>
           <p className="text-slate-500 font-medium mt-3 uppercase tracking-[0.2em] text-[10px] italic">Audit and re-engineer active curriculum tracks and personnel enrollment.</p>
        </div>
      </div>
      
      <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((c) => (
          <div
            key={c._id}
            className="group bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 flex flex-col overflow-hidden hover:border-blue-600 transition-all duration-700 relative"
          >
            {/* Image Section */}
            <div className="h-56 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-50">
              {c.course_img ? (
                <img
                  src={c.course_img}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={c.name}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-10">
                    <MdOutlinePhotoSizeSelectActual size={64} className="text-slate-900" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">Graphic Offline</span>
                </div>
              )}
              <div className="absolute top-6 right-6 px-5 py-2.5 bg-white/90 backdrop-blur-xl rounded-2xl text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-xl border border-white/50">
                TRACK ID: {c.courseId}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-10 flex-1 flex flex-col space-y-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                {c.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-5">
                 <div className="p-5 bg-slate-50/50 rounded-[1.75rem] border border-slate-100 space-y-2 group-hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FaUsers size={12}/>
                       <span className="text-[9px] font-black uppercase tracking-widest">Enrolled</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 leading-none italic">{c.students?.length || 0}</p>
                 </div>
                 <div className="p-5 bg-slate-50/50 rounded-[1.75rem] border border-slate-100 space-y-2 group-hover:bg-white transition-colors">
                    <div className="flex items-center gap-2 text-slate-400">
                       <FaChalkboardTeacher size={12}/>
                       <span className="text-[9px] font-black uppercase tracking-widest">Faculty</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900 leading-none italic">{c.trainers?.length || 0}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Cost</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter italic">₹{c.price}</span>
                 </div>
                 <div className="flex gap-3">
                    <button
                      onClick={() => startEditCourse(c)}
                      className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm group/btn"
                    >
                      <FaEdit size={16}/>
                    </button>
                    <button
                      onClick={() => deleteCourse(c._id)}
                      className="w-12 h-12 bg-white text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn"
                    >
                      <FaTrashAlt size={16}/>
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}

        {courses.length === 0 && (
          <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 opacity-30 flex flex-col items-center">
              <FaLayerGroup size={64} className="text-slate-900 mb-8 opacity-20"/>
              <p className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Database Isolated</p>
              <p className="text-[10px] font-black text-slate-500 mt-4 uppercase tracking-[0.4em]">No curriculum tracks detected in current sector.</p>
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[150] flex justify-center items-center p-6 animate-fade-in">
             <div className="bg-white rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in border border-white">
                
                {/* Modal Header */}
                <div className="p-12 border-b border-slate-50 flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Track Re-Engineering</h2>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Designation: {editingCourse.courseId}</p>
                  </div>
                  <button onClick={() => setEditingCourse(null)} className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all border border-slate-100">
                    <FaTimes size={20}/>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-12 overflow-y-auto no-scrollbar space-y-12">
                  {/* Image Update */}
                  <div className="relative group rounded-[3rem] overflow-hidden aspect-video bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-600 transition-all">
                    {editingCourse.course_img ? (
                        <img src={editingCourse.course_img} className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" />
                    ) : (
                         <div className="text-center space-y-4 opacity-10">
                             <MdOutlinePhotoSizeSelectActual size={80} className="mx-auto text-slate-900" />
                             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 italic">No Graphic Integrated</p>
                        </div>
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all space-y-4 bg-blue-600/5">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform">
                           <FaCloudUploadAlt size={24}/>
                        </div>
                        <span className="text-blue-600 font-black uppercase text-[10px] tracking-[0.4em] italic">Replace Intelligence Graphic</span>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const uploaded = await uploadFile(file);
                            setEditingCourse({ ...editingCourse, course_img: uploaded.secure_url });
                            toast.success("Intelligence graphic updated");
                        }}
                    />
                  </div>

                  <form onSubmit={updateCourse} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Registry ID</label>
                            <input
                                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic"
                                value={editingCourse.courseId}
                                onChange={(e) => setEditingCourse({ ...editingCourse, courseId: e.target.value })}
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Track Designation</label>
                            <input
                                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic"
                                value={editingCourse.name}
                                onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Operational Cost (INR)</label>
                        <input
                            type="number"
                            className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all italic"
                            value={editingCourse.price}
                            onChange={(e) => setEditingCourse({ ...editingCourse, price: e.target.value })}
                        />
                    </div>

                    {/* Trainers Section */}
                    <div className="space-y-8 pt-8 border-t border-slate-50">
                      <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                           <FaChalkboardTeacher className="text-blue-600" size={18}/>
                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em] italic">Faculty Command</h3>
                        </div>
                        <div className="relative">
                          <select
                              className="bg-slate-900 border border-slate-900 text-white text-[9px] font-black uppercase rounded-2xl px-6 py-3 outline-none cursor-pointer appearance-none pr-12 hover:bg-blue-600 transition-colors shadow-xl"
                              onChange={(e) => addTrainer(e.target.value)}
                              value=""
                          >
                              <option value="" disabled>Deploy Mentor</option>
                              {getAllTrainers().map((t) => (
                                <option key={t.trainerId} value={t.trainerId} className="text-slate-900 bg-white">{t.name} ({t.trainerId})</option>
                              ))}
                          </select>
                          <FaPlus size={10} className="absolute right-4 top-1/2 -translate-y-1/2 text-white pointer-events-none"/>
                        </div>
                      </div>
                    
                      <div className="flex flex-wrap gap-4">
                         {editingCourse.trainers.length === 0 && (
                            <div className="w-full py-8 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-100">
                               <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">Zero faculty deployments active.</p>
                            </div>
                         )}
                         {editingCourse.trainers.map((t) => (
                            <div key={t.trainerId} className="group/tag flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 hover:border-blue-600 transition-all shadow-sm">
                                <span className="text-[11px] font-black text-slate-900 uppercase italic">{t.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeTrainer(t.trainerId)}
                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                ><FaTimes size={12}/></button>
                            </div>
                         ))}
                      </div>
                    </div>

                    {/* Students Section */}
                    <div className="space-y-8 pt-8 border-t border-slate-50">
                        <div className="flex items-center gap-4 px-2">
                           <FaUsers className="text-blue-600" size={18}/>
                           <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Active Cadet Roster</h3>
                        </div>
                        {editingCourse.students.length > 0 ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto no-scrollbar pr-3">
                                  {editingCourse.students.map((s) => (
                                    <div 
                                      key={s._id} 
                                      onClick={() => {
                                        const newSelected = selectedStudents.includes(s.studentId)
                                          ? selectedStudents.filter(id => id !== s.studentId)
                                          : [...selectedStudents, s.studentId];
                                        setSelectedStudents(newSelected);
                                      }}
                                      className={`flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all ${selectedStudents.includes(s.studentId) ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-slate-50 border-slate-50 text-slate-500 hover:border-blue-100'}`}
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className={`w-3 h-3 rounded-full transition-all ${selectedStudents.includes(s.studentId) ? 'bg-blue-600 scale-125' : 'bg-slate-200'}`}></div>
                                          <span className="text-xs font-black uppercase tracking-tight italic">{s.name} <span className="opacity-40 ml-2 tracking-widest text-[9px]">#{s.studentId}</span></span>
                                       </div>
                                    </div>
                                  ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={removeSelectedStudents}
                                    disabled={removingStudents || selectedStudents.length === 0}
                                    className={`w-full py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 ${selectedStudents.length > 0 ? 'bg-red-500 text-white shadow-2xl shadow-red-500/20' : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'}`}
                                >
                                    <FaTrash size={12}/> {removingStudents ? "Purging Cadet Records..." : `Revoke Authorization For ${selectedStudents.length} Personnel`}
                                </button>
                            </div>
                        ) : (
                           <div className="p-16 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-100">
                                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em] italic">Sector Roster Clear</p>
                           </div>
                        )}
                    </div>

                    <div className="pt-10">
                        <button className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4">
                            <FaCheckCircle size={18}/> Commit Protocol Changes
                        </button>
                    </div>
                  </form>
                </div>
             </div>
        </div>
      )}
    </div>
  );
}

