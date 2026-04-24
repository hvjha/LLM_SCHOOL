import React from "react";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import { FaLayerGroup, FaTags, FaArrowRight } from "react-icons/fa";

export default function AllCourseCard({ course, onSelect }) {
  return (
    <div
      key={course._id}
      className="group glass-card rounded-[2.5rem] border-slate-100 overflow-hidden hover-lift transition-all duration-500 flex flex-col h-full w-full shadow-lg shadow-slate-200/50"
    >
      {/* Upper part: Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {course.course_img ? (
          <img
            src={course.course_img}
            alt={course.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MdOutlinePhotoSizeSelectActual size={64} className="text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-5 left-5 bg-blue-600/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl border border-blue-400/30">
          <FaTags className="text-white text-[10px]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Premium</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">{course.courseId}</span>
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available</span>
          </div>
          <h3 className="font-black text-2xl text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">{course.name}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
            {(course.trainers || []).slice(0, 2).map((t, i) => (
                <span key={i} className="text-[11px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                   {t.name}
                </span>
            ))}
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tuition Fee</span>
            <span className="text-2xl font-black text-slate-900">₹{course.price}</span>
          </div>
          <button
            onClick={() => onSelect(course)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            Details <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

