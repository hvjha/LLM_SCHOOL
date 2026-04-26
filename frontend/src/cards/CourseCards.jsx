
import React from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaGraduationCap, FaChevronRight } from "react-icons/fa";

export default function CourseCard({ course, onSelect }) {
  return (
    <div
      key={course._id}
      className="group bg-white rounded-[3.5rem] w-full max-w-[380px] h-[480px] flex flex-col overflow-hidden transition-all duration-700 border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] hover:shadow-[0_50px_150px_rgba(59,130,246,0.12)] hover:-translate-y-4 relative"
    >
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mt-16 -mr-16 group-hover:bg-blue-100 transition-colors duration-700"></div>

      {/* Upper half: image or placeholder */}
      <div className="w-full h-[45%] relative overflow-hidden bg-slate-50 border-b border-slate-100">
        {course.course_img ? (
          <img
            src={course.course_img}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30">
            <FaGraduationCap size={64} className="text-slate-200 group-hover:text-blue-200 transition-colors duration-700" />
          </div>
        )}
        
        <div className="absolute top-6 left-6 bg-slate-900 px-5 py-2 rounded-xl shadow-xl shadow-slate-900/20 group-hover:bg-blue-600 transition-colors duration-500">
          <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] italic">Course Track</span>
        </div>
      </div>

      {/* Lower half: course info */}
      <div className="p-10 flex-1 flex flex-col justify-between relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
             <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic">{course.courseId}</span>
          </div>
          <h3 className="font-black text-3xl text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-blue-600 transition-colors line-clamp-2">{course.name}</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between items-end">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Mentor Authority</p>
              <p className="text-sm font-black text-slate-900 uppercase italic flex items-center gap-2">
                {course.trainer?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Registration Fee</p>
              <p className="text-2xl font-black text-slate-900 italic tracking-tighter">₹{course.price}</p>
            </div>
          </div>

          <button
            onClick={() => onSelect && onSelect(course)}
            className="w-full py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-900/30 flex items-center justify-center gap-3 group/btn"
          >
            Access Parameters <FaChevronRight size={10} className="group-hover/btn:translate-x-2 transition-transform"/>
          </button>
        </div>
      </div>
    </div>
  );
}
