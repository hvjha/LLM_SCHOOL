import React, { useEffect, useState } from 'react';
import api from '../api/api';
import AllCourseCard from '../cards/AllCourseCard';
import { FaTimes, FaUserTie, FaBuilding, FaClock } from 'react-icons/fa';

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/course/courses');
        setCourses(res.data.courses || []);
      } catch (e) {
        console.error("Failed to load courses", e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Explore <span className="text-blue-600">Curriculums</span></h2>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">High-impact courses designed for the next generation of tech leaders.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in-up delay-200">
          {courses.map((c) => (
            <AllCourseCard
              key={c._id}
              course={c}
              onSelect={setSelectedCourse}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl flex justify-center items-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 md:p-14 w-full max-w-xl relative shadow-2xl animate-in zoom-in duration-500">
            <button
              className="absolute top-8 right-8 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-all hover:rotate-90"
              onClick={() => setSelectedCourse(null)}
            >
              <FaTimes size={20} />
            </button>

            <div className="space-y-8">
              <div>
                <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">Track Details</span>
                <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{selectedCourse.name}</h2>
              </div>

              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Code</p>
                <p className="text-2xl font-black text-blue-600 tracking-tighter uppercase">{selectedCourse.courseId}</p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1">Primary Mentors</p>
                {selectedCourse.trainers?.map((t) => (
                  <div key={t.trainerId} className="space-y-4 p-6 bg-white border border-slate-100 rounded-3xl group hover:border-blue-200 transition-all shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">{t.name[0]}</div>
                      <div className="flex-1">
                        <h4 className="font-black text-slate-800 text-lg leading-none mb-1">{t.name}</h4>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mentor ID: {t.trainerId}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-blue-600" /> {t.company}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock className="text-blue-600" /> {t.experience} Years Exp.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

