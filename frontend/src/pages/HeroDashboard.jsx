import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";
import AllCourseCard from "../cards/AllCourseCard";
import TrainerCard from "../cards/TrainerCard";
import { FaUsers, FaChalkboardTeacher, FaBookOpen, FaBell, FaTimes, FaExternalLinkAlt, FaArrowRight, FaGem, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function HeroDashboard() {
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourse, setNewCourse] = useState(null);

  const coursesContainerRef = useRef(null);
  const trainersContainerRef = useRef(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/course/courses");
      const fetchedCourses = res.data.courses || [];
      setCourses(fetchedCourses);

      const now = new Date();
      const recentThreshold = 20 * 60 * 1000;
      const newlyAdded = fetchedCourses
        .map((c) => ({ ...c, createdAtDiff: now - new Date(c.createdAt) }))
        .filter((c) => c.createdAtDiff >= 0 && c.createdAtDiff <= recentThreshold)
        .sort((a, b) => a.createdAtDiff - b.createdAtDiff)[0];

      if (newlyAdded) setNewCourse(newlyAdded);
    } catch (e) {
      console.error("Protocol Error: Course synchronization failed", e);
    }
  };

  useEffect(() => {
    fetchCourses();
    const interval = setInterval(fetchCourses, 15000);
    return () => clearInterval(interval);
  }, []);

  // Fetch stats and trainers (Public)
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/admin/public/stats");
        setTrainers(res.data.trainers || []);
        setStudents({ length: res.data.studentCount || 0 }); // Mock length for stat card
      } catch (e) {
        console.error("Protocol Error: Stats synchronization failed", e);
      }
    })();
  }, []);

  const useAutoScroll = (ref) => {
    useEffect(() => {
      const container = ref.current;
      if (!container) return;
      let scrollAmount = 0;
      const scrollStep = 300;
      const interval = setInterval(() => {
        if (scrollAmount + container.clientWidth >= container.scrollWidth) {
          scrollAmount = 0;
        } else {
          scrollAmount += scrollStep;
        }
        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }, 13000);
      return () => clearInterval(interval);
    }, [ref]);
  };

  useAutoScroll(coursesContainerRef);
  useAutoScroll(trainersContainerRef);

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden pt-32 pb-24 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-blue-50 rounded-full blur-[150px] opacity-60 -translate-y-1/2 translate-x-1/4"></div>
         <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-slate-50 rounded-full blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-28">
        
        {/* Header Section */}
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mb-4 shadow-xl shadow-slate-900/10">
             <FaShieldAlt className="text-blue-500" /> System Metrics Node
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            EDU<span className="text-blue-600">DASH</span><span className="text-slate-200">.v4</span>
          </h1>
          <p className="text-slate-500 font-bold text-xl max-w-2xl mx-auto leading-relaxed">
            Real-time insights and strategic metrics from our centralized <span className="text-slate-900">academic ecosystem</span>.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: "Active Cadets", value: students.length, icon: <FaUsers />, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
            { label: "Elite Faculty", value: trainers.length, icon: <FaChalkboardTeacher />, color: "text-slate-900", bg: "bg-slate-50", trend: "+4%" },
            { label: "Live Tracks", value: courses.length, icon: <FaBookOpen />, color: "text-blue-600", bg: "bg-blue-50", trend: "+8%" }
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-12 rounded-[4rem] border border-slate-100 flex flex-col justify-between hover:border-blue-600 transition-all duration-700 group animate-fade-in-up shadow-2xl shadow-slate-200/40 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mt-10 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="flex justify-between items-start relative z-10">
                 <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                    {stat.icon}
                 </div>
                 <div className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                    <FaChartLine size={10}/> {stat.trend}
                 </div>
              </div>

              <div className="mt-10 relative z-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                <p className={`text-6xl font-black ${stat.color} tracking-tighter leading-none italic`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Notification Area */}
        {newCourse && (
          <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-900/20 relative overflow-hidden group animate-scale-in">
            <div className="absolute top-0 right-0 w-full h-full bg-blue-600/5 mix-blend-overlay"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
            
            <div className="flex items-center gap-10 relative z-10">
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/40 border-b-4 border-blue-700">
                <FaBell size={32} />
              </div>
              <div>
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 border border-blue-500/30">LATEST DEPLOYMENT</div>
                <h4 className="text-3xl font-black tracking-tight uppercase italic leading-none">New Curriculum Online</h4>
                <p className="text-slate-400 text-lg font-medium mt-2">Explore <span className="text-white font-black italic underline decoration-blue-500 decoration-4 underline-offset-4">{newCourse.name}</span> by Senior Faculty</p>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10 w-full md:w-auto">
              <button 
                onClick={() => setSelectedCourse(newCourse)}
                className="flex-1 md:flex-none px-12 py-5 bg-blue-600 hover:bg-white hover:text-slate-900 rounded-3xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Access Track
              </button>
              <button 
                onClick={() => setNewCourse(null)}
                className="w-16 h-16 bg-white/5 hover:bg-red-500 rounded-3xl transition-all border border-white/10 flex items-center justify-center text-white"
              >
                <FaTimes size={20}/>
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Sections */}
        <div className="space-y-40">
          
          {/* Trainers Showcase */}
          <section className="space-y-16 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-blue-600">
                    <FaGem size={14}/> <span className="text-[10px] font-black uppercase tracking-[0.4em]">Elite Faculty</span>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Senior Mentors</h2>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] max-w-xs text-right italic">Global leaders in technology and innovation instruction.</p>
            </div>
            <div className="overflow-x-auto no-scrollbar pb-10" ref={trainersContainerRef}>
              <div className="flex gap-12 w-max px-4">
                {trainers.map((t) => (
                  <div key={t._id} className="w-[340px] flex h-full">
                    <TrainerCard trainer={t} />
                  </div>
                ))}
                {trainers.length === 0 && (
                  <div className="py-20 text-center w-full opacity-20 italic font-black text-slate-400 uppercase">Sector isolated: No faculty detected</div>
                )}
              </div>
            </div>
          </section>

          {/* Featured Courses */}
          <section className="space-y-16 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px] max-w-xs italic">High-impact curriculums designed for industry dominance.</p>
              <div className="space-y-2 text-right">
                 <div className="flex items-center gap-2 text-blue-600 justify-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Curated Content</span> <FaBookOpen size={14}/>
                 </div>
                 <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Master Tracks</h2>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar pb-16" ref={coursesContainerRef}>
              <div className="flex gap-12 w-max px-4">
                {courses.map((c) => (
                  <div key={c._id} className="w-[400px] flex h-full">
                    <AllCourseCard course={c} onSelect={setSelectedCourse} />
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="py-20 text-center w-full opacity-20 italic font-black text-slate-400 uppercase">Sector isolated: No curriculums detected</div>
                )}
              </div>
            </div>
          </section>

        </div>

        {/* Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-2xl transition-all duration-500 animate-fade-in">
            <div className="bg-white rounded-[4rem] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
              
              {/* Modal Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mt-20 -mr-20"></div>

              <div className="p-12 md:p-16 space-y-12 relative z-10 overflow-y-auto no-scrollbar">
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-10 right-10 w-12 h-12 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-blue-50 rounded-2xl transition-all flex items-center justify-center shadow-sm"
                >
                  <FaTimes size={20} />
                </button>

                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] border border-blue-100">
                    PREMIUM DEPLOYMENT
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 leading-none tracking-tighter uppercase italic">{selectedCourse.name}</h2>
                  <p className="text-slate-500 text-lg font-medium leading-relaxed italic">Strategic curriculum designed for high-performance professional growth.</p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 group">
                    <div className="space-y-1">
                       <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Access Protocol</p>
                       <p className="text-blue-500 font-black text-3xl tracking-tighter uppercase italic group-hover:text-white transition-colors">{selectedCourse.courseId}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:bg-blue-600 transition-all">
                       <FaExternalLinkAlt size={24}/>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                       <FaChalkboardTeacher className="text-blue-600" size={18}/>
                       <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Commanding Faculty</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedCourse.trainers?.map((t) => (
                        <div key={t.trainerId} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-blue-600 hover:bg-white transition-all shadow-sm">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-500/20">{t.name[0]}</div>
                             <div>
                                <span className="text-lg font-black text-slate-900 uppercase italic tracking-tight block leading-none">{t.name}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">ID: {t.trainerId}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                      {(!selectedCourse.trainers || selectedCourse.trainers.length === 0) && (
                        <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-3xl opacity-30 italic font-black text-[10px] uppercase">No faculty assigned</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                        <FaUsers size={22} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest leading-none">Cadet Load</p>
                         <p className="text-xl font-black text-slate-900 leading-none italic">{selectedCourse.students?.length || 0} Learners</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-4 px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] group overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      Initiate Enrollment <FaArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Decorative Brand Tag */}
      <div className="fixed bottom-10 right-10 opacity-20 pointer-events-none group hover:opacity-100 transition-opacity">
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em] vertical-rl rotate-180">Strategic Learning Systems // 2026</p>
      </div>
    </div>
  );
}


