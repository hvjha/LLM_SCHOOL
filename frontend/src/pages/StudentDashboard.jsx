import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import api from "../api/api";
import UserProfileCard from "../cards/UserProfileCard";
import TrainerCard from "../cards/TrainerCard";
import CourseCard from "../cards/CourseCards";
import { RxHamburgerMenu, RxAvatar } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { 
  FaGraduationCap, FaUserTie, FaBookOpen, 
  FaCalendarCheck, FaFolderOpen, FaVideo, 
  FaFileAlt, FaShieldAlt, FaRocket, FaTerminal, FaChevronRight 
} from "react-icons/fa";
import StudentAttendance from "../components/StudentAttendance";
import StudentLibraryHistory from "../components/library/StudentLibraryHistory";

// Lazy load PDFViewer for better performance
const PDFViewer = lazy(() => import("../helper/PDFViewer"));

export default function LoggedInStudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseVideos, setCourseVideos] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [folder, setFolder] = useState(null);

  const trainersContainerRef = useRef(null);
  
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/course/student/my");
        setCourses(res.data.courses || []);
        setUser(res.data.user || null);
        setUpdatedUser(res.data.user || {});
      } catch (e) {
        console.error("Protocol Failure: Data synchronization failed", e);
      }
    })();
  }, []);

  const trainers = Array.from(
    new Map(courses.map((c) => [c.trainer.trainerId, c.trainer])).values()
  );

  const handleUpdate = async () => {
    if (!user?._id) return;
    try {
      const payload = {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        profile_pic: updatedUser.profile_pic,
      };
      const res = await api.post(`/api/admin/update-user/${user._id}`, payload);
      setUser(res.data.user);
      setEditMode(false);
    } catch (e) {
      console.error("Protocol Failure: Profile update rejected", e);
    }
  };

  const fetchCourseVideos = async (id) => {
    try {
      const res = await api.get(`/api/content/list/${id}`);
      setCourseVideos(res.data.content || []);
    } catch (e) {
      console.error("Protocol Error: Asset pipeline failure");
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: <FaUserTie size={14}/> },
    { id: "userdata", label: "Academics", icon: <FaGraduationCap size={14}/> },
    { id: "content", label: "Knowledge Base", icon: <FaFolderOpen size={14}/> },
    { id: "attendance", label: "Check-ins", icon: <FaCalendarCheck size={14}/> },
    { id: "library", label: "Library", icon: <FaBookOpen size={14}/> },
  ];

  const SidebarItem = ({ icon, label, tab }) => (
    <button
      onClick={() => {
        setSelectedCourse(null);
        setActiveTab(tab);
        setSidebarOpen(false);
      }}
      className={`group relative flex items-center justify-between w-full px-8 py-4 rounded-[1.5rem] transition-all duration-300 font-black text-[10px] uppercase tracking-[0.25em] ${
        activeTab === tab 
          ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20" 
          : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className={`transition-transform duration-500 ${activeTab === tab ? "text-blue-500 scale-110" : "text-slate-300 group-hover:text-blue-500 group-hover:scale-110"}`}>{icon}</span>
        {label}
      </div>
      {activeTab === tab && (
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-white pt-20 overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-blue-50/30 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Mobile Trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-[100] w-16 h-16 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-white active:scale-90 transition-all"
      >
        <RxHamburgerMenu size={24} />
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] transition-all duration-500"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-slate-100 flex flex-col z-[120] transform transition-all duration-700 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="p-10 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            LEARNER<span className="text-blue-600 uppercase italic">Hub</span>
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-6 overflow-y-auto no-scrollbar pb-10">
          <div className="flex items-center gap-2 mb-6 px-4">
             <div className="h-[1px] flex-1 bg-slate-100"></div>
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Navigation</p>
             <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>
          {tabs.map((tab) => (
            <SidebarItem key={tab.id} label={tab.label} tab={tab.id} icon={tab.icon} />
          ))}
        </nav>

        <div className="p-8 mt-auto shrink-0">
           <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full -mt-10 -mr-10 blur-2xl"></div>
              <div className="flex items-center gap-4 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-500/50 transition-colors">
                    {user?.profile_pic ? <img src={user.profile_pic} className="w-full h-full object-cover"/> : <RxAvatar size={36} className="text-slate-600"/>}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-black text-white truncate uppercase italic tracking-tight">{user?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Status: Active</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 lg:px-12 py-10 relative">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          
          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-16">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                       <FaShieldAlt size={10}/> PERSONAL COMMAND CENTER
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                       System Entry: <span className="text-blue-600">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic">Updating your academic and career details...</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center min-w-[120px]">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Academic ID</p>
                       <p className="text-xl font-black text-slate-900 leading-none italic font-mono">{user?.studentId || "0xPEND"}</p>
                    </div>
                 </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-10 bg-slate-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[60px] -mt-10 -mr-10"></div>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500">
                         <FaRocket size={24}/>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Metrics</p>
                         <div className="h-1 w-12 bg-blue-600 ml-auto rounded-full"></div>
                      </div>
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Active Tracks</p>
                   <p className="text-7xl font-black text-white tracking-tighter italic relative z-10 leading-none">{courses.length}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-6 relative z-10">Updated in real-time.</p>
                </div>
                
                <div className="p-10 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-[60px] -mb-10 -ml-10"></div>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                         <FaUserTie size={24}/>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Network</p>
                         <div className="h-1 w-12 bg-slate-100 ml-auto rounded-full group-hover:bg-blue-600 transition-colors"></div>
                      </div>
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Elite Mentors</p>
                   <p className="text-7xl font-black text-slate-900 tracking-tighter italic relative z-10 leading-none">{trainers.length}</p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-6 relative z-10">Direct access to mentors.</p>
                </div>
              </div>

              <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/30 relative">
                <div className="absolute top-0 left-0 w-2 h-20 bg-blue-600 rounded-full mt-16 -ml-[1px]"></div>
                <div className="mb-12">
                   <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Profile Parameters</h2>
                   <p className="text-slate-400 font-medium italic">Update your personal details here.</p>
                </div>
                <UserProfileCard
                  user={user}
                  editMode={editMode}
                  updatedUser={updatedUser}
                  setUpdatedUser={setUpdatedUser}
                  handleUpdate={handleUpdate}
                  setEditMode={setEditMode}
                />
              </div>
            </div>
          )}

          {/* ACADEMICS */}
          {activeTab === "userdata" && (
            <div className="space-y-24">
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-600">
                         <FaShieldAlt size={12}/> <span className="text-[10px] font-black uppercase tracking-[0.4em]">Strategic Assets</span>
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Commanding Faculty</h2>
                   </div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] italic">Assigned Personnel</p>
                </div>
                <div className="flex gap-10 overflow-x-auto no-scrollbar pb-10 px-2">
                  {trainers.map((t) => (
                    <div key={t.trainerId} className="min-w-[340px]">
                      <TrainerCard trainer={t} />
                    </div>
                  ))}
                  {trainers.length === 0 && (
                     <div className="w-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 opacity-40">
                        <p className="text-slate-400 font-black italic uppercase tracking-widest">No faculty assigned to current tracks.</p>
                     </div>
                  )}
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-blue-600">
                         <FaTerminal size={12}/> <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Protocols</span>
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Academic Tracks</h2>
                   </div>
                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] italic">Operational Enrollment</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {courses.map((c) => (
                    <CourseCard key={c._id} course={c} />
                  ))}
                  {courses.length === 0 && (
                     <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 opacity-40">
                        <p className="text-slate-400 font-black italic uppercase tracking-widest">No active track enrollments detected.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KNOWLEDGE BASE */}
          {activeTab === "content" && (
            <div className="space-y-12">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                       <FaFolderOpen size={10} className="text-blue-500"/> SECURE RESOURCE NODE
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                       Knowledge <span className="text-blue-600">Base</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic">Access all course materials and videos here...</p>
                 </div>
              </header>

              {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      className="group p-12 bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/30 hover:border-blue-600 transition-all duration-500 cursor-pointer text-center space-y-6 relative overflow-hidden active:scale-[0.98]"
                      onClick={() => {
                        setSelectedCourse(course);
                        fetchCourseVideos(course.courseId);
                        setFolder(null);
                      }}
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-[40px] -mt-10 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mx-auto group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm relative z-10">
                        <FaFolderOpen size={32}/>
                      </div>
                      <div className="relative z-10">
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-tight group-hover:text-blue-600 transition-colors">{course.name}</h2>
                        <div className="flex items-center justify-center gap-2 mt-4">
                           <div className="h-[1px] w-8 bg-slate-100 group-hover:bg-blue-200 transition-colors"></div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.courseId}</p>
                           <div className="h-[1px] w-8 bg-slate-100 group-hover:bg-blue-200 transition-colors"></div>
                        </div>
                      </div>
                      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                         <span className="inline-flex items-center gap-2 text-[9px] font-black text-blue-600 uppercase tracking-widest">Open Repository <FaChevronRight size={8}/></span>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                     <div className="col-span-full py-24 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 opacity-40">
                        <p className="text-slate-400 font-black italic uppercase tracking-widest">No active track repositories identified.</p>
                     </div>
                  )}
                </div>
              ) : (
                <div className="space-y-16 animate-fade-in-up">
                  <button
                    className="flex items-center gap-4 px-8 py-4 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 group"
                    onClick={() => { setSelectedCourse(null); setFolder(null); }}
                  >
                    <span className="group-hover:-translate-x-2 transition-transform duration-500">←</span> Back to Global Repository
                  </button>

                  <div className="bg-white rounded-[4rem] p-12 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mt-32 -mr-32"></div>
                    
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
                       <div className="space-y-3">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                             CURRENT NODE: {selectedCourse.courseId}
                          </div>
                          <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{selectedCourse.name}</h2>
                          <p className="text-slate-400 font-medium italic text-lg">Loading content...</p>
                       </div>
                       
                       <div className="flex flex-wrap gap-4">
                          <button 
                            onClick={() => setFolder("video")}
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-lg ${folder === "video" ? "bg-slate-900 text-white shadow-slate-900/30 scale-105" : "bg-white text-slate-400 border border-slate-100 hover:border-blue-600 hover:text-blue-600"}`}
                          >
                            <FaVideo size={16}/> Broadcast Streams
                          </button>
                          <button 
                            onClick={() => setFolder("document")}
                            className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-lg ${folder === "document" ? "bg-slate-900 text-white shadow-slate-900/30 scale-105" : "bg-white text-slate-400 border border-slate-100 hover:border-blue-600 hover:text-blue-600"}`}
                          >
                            <FaFileAlt size={16}/> Operation Protocols
                          </button>
                       </div>
                    </div>

                    <div className="relative z-10">
                      {folder === "video" && (
                        <div className="space-y-12 animate-fade-in-up">
                          {courseVideos.filter(v => v.file_type === "video").length === 0 ? (
                            <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6"><FaVideo size={32}/></div>
                               <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">No broadcast streams identified for this track.</p>
                            </div>
                          ) : (
                            courseVideos.filter(v => v.file_type === "video").map((v) => (
                              <div key={v._id} className="p-10 bg-white rounded-[4rem] border border-slate-100 flex flex-col lg:flex-row gap-12 group hover:border-blue-600 transition-all duration-700 shadow-xl shadow-slate-200/20">
                                <div className="lg:w-[45%] rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 aspect-video relative border-8 border-white group-hover:border-blue-50 transition-colors">
                                  <video src={v.file_url} controls className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1 space-y-8 flex flex-col justify-center">
                                  <div>
                                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest mb-4">LIVE FEED DEPLOYED</div>
                                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic leading-none tracking-tight">{v.title}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4 flex items-center gap-2 italic">
                                       <span className="w-2 h-2 bg-slate-200 rounded-full"></span> Timestamp: {new Date(v.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <p className="text-slate-500 font-medium leading-relaxed text-lg italic pr-6">{v.description}</p>
                                  <div className="pt-4 border-t border-slate-50">
                                     <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group/btn">
                                        Track Progress <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                     </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {folder === "document" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
                          {courseVideos.filter(d => d.file_type !== "video").length === 0 ? (
                            <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6"><FaFileAlt size={32}/></div>
                               <p className="text-slate-400 font-black italic uppercase tracking-widest text-xs">No research protocols identified for this track.</p>
                            </div>
                          ) : (
                            courseVideos.filter(d => d.file_type !== "video").map((d) => (
                              <div key={d._id} className="p-10 bg-white rounded-[4rem] border border-slate-100 space-y-10 group hover:border-blue-600 transition-all duration-700 flex flex-col h-full shadow-xl shadow-slate-200/20">
                                 <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">
                                          {d.file_type.toUpperCase()} PROTOCOL
                                       </div>
                                       <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic leading-tight tracking-tight">{d.title}</h3>
                                    </div>
                                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                       <FaFileAlt size={24}/>
                                    </div>
                                 </div>
                                 <div className="flex-1 rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-white group-hover:border-blue-50 transition-colors relative min-h-[350px]">
                                    <Suspense fallback={<div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 space-y-4">
                                       <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                                       <p className="text-slate-400 font-black text-[9px] uppercase tracking-widest">Loading document...</p>
                                    </div>}>
                                      <PDFViewer url={d.file_url} />
                                    </Suspense>
                                 </div>
                                 <p className="text-slate-500 font-medium leading-relaxed italic text-base line-clamp-3 pr-4">{d.description}</p>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      
                      {!folder && (
                        <div className="py-32 text-center">
                           <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-10 shadow-inner"><FaFolderOpen size={48}/></div>
                           <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Repository Locked</h3>
                           <p className="text-slate-400 font-medium italic text-lg max-w-sm mx-auto">Select a folder above to see content.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "attendance" && <StudentAttendance courses={courses}/>}
          {activeTab === "library" && <StudentLibraryHistory studentId={user?._id} />}
        </div>
        
        {/* Dashboard Footer Branding */}
        <footer className="max-w-7xl mx-auto mt-20 mb-10 px-4 flex justify-between items-center opacity-30 pointer-events-none">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Centralized Learning OS // STUDENT-LEVEL-4 ACCESS</p>
           <div className="h-[1px] flex-1 mx-12 bg-slate-200"></div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">© 2026 LEARNERHUB.SYSTEM</p>
        </footer>
      </main>
    </div>
  );
}



