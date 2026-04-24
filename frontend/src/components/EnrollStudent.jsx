import React, { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { FaUserPlus, FaBook, FaUserGraduate, FaChalkboardTeacher, FaChevronDown, FaCheckCircle } from "react-icons/fa";

export default function EnrollStudent({ students, trainers, courses, onEnroll }) {
  const [enroll, setEnroll] = useState({
    courseId: "",
    studentId: "",
    trainerId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doEnroll = async (e) => {
    e.preventDefault();
    if (!enroll.courseId || !enroll.studentId || !enroll.trainerId) {
      toast.error("Protocol error: All vectors must be defined");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post(`/api/course/enroll/${enroll.courseId}`, {
        studentId: enroll.studentId,
        trainerId: enroll.trainerId
      });
      toast.success("Student integration successful");
      setEnroll({ courseId: "", studentId: "", trainerId: "" });
      if (onEnroll) onEnroll(); 
    } catch (err) {
      toast.error(err?.response?.data?.message || "Integration failure: Database rejected entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in-up">
      <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.08)] w-full max-w-4xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/5 rounded-full blur-[100px] -mb-40 -ml-40 pointer-events-none"></div>
        
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-[2.5rem] mb-8 text-slate-900 shadow-inner border border-slate-100 group">
            <FaUserPlus size={36} className="group-hover:scale-110 transition-transform duration-700"/>
          </div>
          <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Sector Enrollment</h2>
          <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.3em] text-[10px] italic">Link personnel to specific tracks and assign commanding faculty.</p>
        </div>

        <form onSubmit={doEnroll} className="space-y-12 relative z-10">
          
          <div className="space-y-10">
            {/* Course Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Target Curriculum</label>
              <div className="relative group">
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <FaBook size={16}/>
                </div>
                <select
                  className="w-full pl-20 pr-12 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all appearance-none uppercase tracking-[0.2em] text-[10px] italic cursor-pointer"
                  value={enroll.courseId}
                  onChange={(e) => setEnroll({ ...enroll, courseId: e.target.value })}
                >
                  <option value="">Choose Track</option>
                  {courses?.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.courseId})
                    </option>
                  ))}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <FaChevronDown size={14}/>
                </div>
              </div>
            </div>

            {/* Student Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Deploy Personnel (Student)</label>
              <div className="relative group">
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <FaUserGraduate size={16}/>
                </div>
                <select
                  className="w-full pl-20 pr-12 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all appearance-none uppercase tracking-[0.2em] text-[10px] italic cursor-pointer"
                  value={enroll.studentId}
                  onChange={(e) => setEnroll({ ...enroll, studentId: e.target.value })}
                >
                  <option value="">Select Personnel</option>
                  {students?.map(s => (
                    <option key={s._id} value={s.studentId}>
                      {s.name} ({s.studentId})
                    </option>
                  ))}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <FaChevronDown size={14}/>
                </div>
              </div>
            </div>

            {/* Trainer Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Appoint Faculty (Lead)</label>
              <div className="relative group">
                <div className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <FaChalkboardTeacher size={16}/>
                </div>
                <select
                  className="w-full pl-20 pr-12 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all appearance-none uppercase tracking-[0.2em] text-[10px] italic cursor-pointer"
                  value={enroll.trainerId}
                  onChange={(e) => setEnroll({ ...enroll, trainerId: e.target.value })}
                >
                  <option value="">Select Mentor</option>
                  {trainers?.map(t => (
                    <option key={t._id} value={t.trainerId}>
                      {t.name} ({t.trainerId})
                    </option>
                  ))}
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <FaChevronDown size={14}/>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              disabled={isSubmitting}
              className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaCheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
              )}
              {isSubmitting ? "Processing Integration..." : "Execute Enrollment Protocol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
