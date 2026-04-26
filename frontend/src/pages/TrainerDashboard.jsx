import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { RxAvatar, RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import UserProfileCard from "../cards/UserProfileCard";
import { toast } from "react-toastify";
import { 
  FaGraduationCap, FaLayerGroup, FaUsers, 
  FaBookReader, FaHistory, FaCalendarCheck, 
  FaShieldAlt, FaRocket, FaChevronRight, FaTerminal, FaFileAlt, FaUserTie
} from "react-icons/fa";

import TrainerLibrary from "../components/library/TrainerLibrary";
import TrainerReservationHistory from "../components/library/TrainerReservationHistory";

export default function TrainerDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceModalData, setAttendanceModalData] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [weekendError, setWeekendError] = useState("");

  const isWeekend = (dateStr) => {
    const day = new Date(dateStr + "T00:00:00").getDay();
    return day === 0 || day === 6;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/api/course/trainer/my");
      setCourses(res.data.courses || []);
    } catch (e) {
      console.error("Protocol Error: Course synchronization failed", e);
      toast.error("Failed to load courses");
    }
  };

  const SidebarItem = ({ icon, label, tab }) => (
    <button
      onClick={() => {
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

  const markAttendance = async () => {
    try {
      if (!attendanceModalData) return;
      if (isWeekend(attendanceDate)) {
        setWeekendError("❌ Attendance restriction: Monday–Friday operations only.");
        return;
      }
      setWeekendError("");

      const { student, course } = attendanceModalData;
      const payload = {
        studentId: student._id,
        courseId: course._id,
        date: attendanceDate,
        status: "present",
      };

      const res = await api.post("/api/attendance/mark", payload);
      toast.success(res.data.message || "Attendance verified successfully!");
      setAttendanceModalData(null);
      setAttendanceDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const viewStudentAttendance = async (student) => {
    try {
      const res = await api.get("/api/admin/user-details");
      const studentData = res.data.users.students.find(
        (st) => st.studentId === student.studentId
      );
      setSelectedStudent(studentData);
    } catch (err) {
      toast.error("Data retrieval failed");
    }
  };

  const viewCourseAttendance = (student, course) => {
    navigate(`/student-attendance?studentId=${student.studentId}&courseId=${course._id}`);
  };

  return (
    <div className="flex h-screen bg-white pt-20 overflow-hidden relative">
      
      {/* Background Gradients */}
      <div className="fixed bottom-0 left-0 w-[50vw] h-[50vw] bg-blue-50/20 rounded-full blur-[120px] pointer-events-none"></div>

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
            FACULTY<span className="text-blue-600 uppercase italic">Pro</span>
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-6 overflow-y-auto no-scrollbar pb-10">
          <div className="space-y-1">
             <div className="flex items-center gap-2 mb-6 px-4">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Operation Center</p>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
             </div>
             <SidebarItem label="Control Grid" tab="dashboard" icon={<FaLayerGroup size={14}/>} />
             <SidebarItem label="Deployed Tracks" tab="courses" icon={<FaGraduationCap size={14}/>} />
             <SidebarItem label="Cadet Registry" tab="students" icon={<FaUsers size={14}/>} />
          </div>

          <div className="space-y-1 pt-10">
             <div className="flex items-center gap-2 mb-6 px-4">
                <div className="h-[1px] flex-1 bg-slate-100"></div>
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Research Assets</p>
                <div className="h-[1px] flex-1 bg-slate-100"></div>
             </div>
             <SidebarItem label="Digital Library" tab="library" icon={<FaBookReader size={14}/>} />
             <SidebarItem label="My Reserves" tab="reservations" icon={<FaHistory size={14}/>} />
          </div>
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
                       <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">Rank: Lead Mentor</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 lg:px-12 py-10 relative">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          
          {/* Section Logic */}
          {activeTab === "library" && <TrainerLibrary />}
          {activeTab === "reservations" && <TrainerReservationHistory />}

          {activeTab === "dashboard" && (
            <div className="space-y-16">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                       <FaShieldAlt size={10}/> EXECUTIVE COMMAND INTERFACE
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                       Operational <span className="text-blue-600">Summary</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic">Synchronizing faculty metrics and tactical deployments...</p>
                 </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-12 bg-slate-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[60px] -mt-10 -mr-10"></div>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-500">
                         <FaRocket size={32}/>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Fleet</p>
                         <div className="h-1 w-12 bg-blue-600 ml-auto rounded-full"></div>
                      </div>
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Active Tracks</p>
                   <p className="text-8xl font-black text-white tracking-tighter italic relative z-10 leading-none">{courses.length}</p>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-8 relative z-10">Real-time curriculum engagement sync active.</p>
                </div>
                
                <div className="p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group">
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-[60px] -mb-10 -ml-10"></div>
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                         <FaUsers size={32}/>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Personnel</p>
                         <div className="h-1 w-12 bg-slate-100 ml-auto rounded-full group-hover:bg-blue-600 transition-colors"></div>
                      </div>
                   </div>
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Assigned Cadets</p>
                   <p className="text-8xl font-black text-slate-900 tracking-tighter italic relative z-10 leading-none">
                     {courses.reduce((acc, c) => acc + (c.students?.length || 0), 0)}
                   </p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-8 relative z-10">Total learner population across all sectors.</p>
                </div>
              </div>

              <div className="bg-white rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/30 relative">
                <div className="absolute top-0 left-0 w-2 h-20 bg-blue-600 rounded-full mt-16 -ml-[1px]"></div>
                <div className="mb-12">
                   <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Faculty Parameters</h2>
                   <p className="text-slate-400 font-medium italic">Manage your profile and operational settings.</p>
                </div>
                <UserProfileCard user={user} courses={courses} />
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-16">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                       <FaTerminal size={10} className="text-blue-500"/> TACTICAL DEPLOYMENT GRID
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                       My <span className="text-blue-600">Tracks</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic">Monitoring and operational control of active curricula...</p>
                 </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <div key={course._id} className="p-10 bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-slate-200/30 group hover:border-blue-600 transition-all duration-500 flex flex-col h-[580px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-[40px] -mt-10 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="mb-10 space-y-4 relative z-10">
                       <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                          ACTIVE TRACK
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors uppercase italic tracking-tight">{course.name}</h3>
                       <div className="flex justify-between items-center pt-2">
                         <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">{course.courseId}</span>
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                           <FaUsers className="text-blue-600" size={12}/>
                           <span className="text-[10px] font-black text-slate-600 uppercase">{course.students?.length || 0} Cadets</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-6">
                       <div className="h-[1px] flex-1 bg-slate-100 group-hover:bg-blue-100"></div>
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Cadet Roster</p>
                       <div className="h-[1px] flex-1 bg-slate-100 group-hover:bg-blue-100"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 relative z-10 pr-2">
                      {course.students?.map((s) => (
                        <div key={s._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/40 transition-all group/item">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-base font-black text-slate-900 uppercase italic leading-none group-hover/item:text-blue-600 transition-colors">{s.name}</span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-widest">{s.studentId}</span>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setAttendanceModalData({ student: s, course })}
                              className="flex-1 py-3.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]"
                            >
                              Log Attendance
                            </button>
                            <button
                              onClick={() => viewCourseAttendance(s, course)}
                              className="w-12 h-12 bg-white text-slate-400 flex items-center justify-center rounded-2xl border border-slate-100 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                            >
                              <FaCalendarCheck size={16}/>
                            </button>
                          </div>
                        </div>
                      ))}
                      {course.students?.length === 0 && (
                         <div className="py-12 text-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-300 font-black italic uppercase text-[10px] tracking-widest">No cadets assigned.</p>
                         </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-16">
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-12">
                 <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                       <FaUsers size={10} className="text-blue-500"/> CADET REGISTRY DATABASE
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                       Personnel <span className="text-blue-600">Database</span>
                    </h1>
                    <p className="text-slate-500 text-lg font-medium italic">Detailed directory of all enrolled learners across sectors...</p>
                 </div>
              </header>

              <div className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/40 relative">
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Target Personnel</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identification</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Sector Status</th>
                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Analytics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {courses
                      .flatMap(c => c.students?.map(s => ({ ...s, courseName: c.name, course: c })) || [])
                      .filter((s, i, arr) => arr.findIndex(st => st._id === s._id) === i)
                      .map((s) => (
                        <tr key={s._id} className="hover:bg-slate-50/50 transition-all group">
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:border-blue-200 transition-colors">
                                  {s.profile_pic ? <img src={s.profile_pic} className="w-full h-full object-cover"/> : <RxAvatar size={48} className="text-slate-100"/>}
                               </div>
                               <div>
                                  <div className="text-slate-900 font-black text-base uppercase italic group-hover:text-blue-600 transition-colors">{s.name}</div>
                                  <div className="text-[10px] font-bold text-slate-400 mt-1">{s.email}</div>
                               </div>
                            </div>
                          </td>
                          <td className="px-10 py-8 font-mono text-[11px] text-slate-500 font-bold tracking-widest uppercase">{s.studentId}</td>
                          <td className="px-10 py-8">
                            <div className="flex flex-wrap gap-2">
                              {courses.filter(c => c.students?.some(st => st._id === s._id)).map(c => (
                                <span key={c._id} className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[9px] font-black uppercase border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex justify-center">
                              <button
                                onClick={() => viewStudentAttendance(s)}
                                className="px-8 py-3 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] group/btn"
                              >
                                Full Report <span className="inline-block group-hover/btn:translate-x-1 transition-transform">→</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {courses.length === 0 && (
                     <div className="py-32 text-center">
                        <p className="text-slate-300 font-black italic uppercase tracking-widest">No personnel records detected in current grid.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Modal */}
          {attendanceModalData && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-[250] p-6 animate-in fade-in duration-500">
              <div className="bg-white w-full max-w-lg rounded-[4rem] shadow-2xl p-12 md:p-16 relative border border-slate-100 animate-in zoom-in slide-in-from-bottom-10 duration-700">
                <button
                  className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-all hover:rotate-90"
                  onClick={() => { setAttendanceModalData(null); setWeekendError(""); }}
                >
                  <IoClose size={24} />
                </button>

                <div className="text-center space-y-4 mb-12">
                   <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner"><FaCalendarCheck size={32}/></div>
                   <h3 className="font-black text-4xl text-slate-900 uppercase italic tracking-tighter leading-none">Log Attendance</h3>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] leading-none">Mon – Fri Verification Protocol</p>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] mb-10 space-y-8 shadow-inner relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 rounded-full -mt-10 -mr-10 blur-2xl"></div>
                   <div className="space-y-2 relative z-10">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Personnel</p>
                     <p className="font-black text-slate-900 text-2xl uppercase italic leading-none">{attendanceModalData.student.name}</p>
                     <p className="text-xs font-mono text-blue-600 font-bold tracking-widest">{attendanceModalData.student.studentId}</p>
                   </div>
                   <div className="pt-8 border-t border-slate-200/60 space-y-2 relative z-10">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Track</p>
                     <p className="font-black text-slate-900 text-2xl uppercase italic leading-none">{attendanceModalData.course.name}</p>
                     <p className="text-xs font-mono text-blue-600 font-bold tracking-widest">{attendanceModalData.course.courseId}</p>
                   </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Operation Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => {
                        setAttendanceDate(e.target.value);
                        if (isWeekend(e.target.value)) setWeekendError("Restricted: Operational window is Monday to Friday only.");
                        else setWeekendError("");
                      }}
                      className={`w-full p-6 rounded-[2rem] focus:outline-none font-black text-xl transition-all shadow-sm ${
                        weekendError ? "border-2 border-red-500/20 bg-red-50 text-red-900" : "bg-slate-50 border border-slate-100 focus:ring-8 focus:ring-blue-100 focus:border-blue-600 text-slate-900"
                      }`}
                    />
                  </div>
                  
                  {weekendError && (
                    <div className="p-5 rounded-[2rem] bg-red-50 border border-red-100 text-red-600 text-xs font-black flex items-center gap-4 animate-shake">
                      <span className="text-2xl">⚠</span> {weekendError}
                    </div>
                  )}

                  <div className="flex flex-col gap-4 pt-6">
                    <button
                      onClick={markAttendance}
                      disabled={!!weekendError}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/30 hover:bg-blue-600 transition-all disabled:opacity-20 active:scale-[0.98]"
                    >
                      Verify Presence
                    </button>
                    <button
                      onClick={() => { setAttendanceModalData(null); setWeekendError(""); }}
                      className="w-full py-4 text-slate-400 font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-all text-xs"
                    >
                      Cancel Operation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Profile Analytics Modal */}
          {selectedStudent && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-[250] p-6 animate-in fade-in duration-500">
              <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-12 md:p-16 relative border border-slate-100 animate-in zoom-in slide-in-from-bottom-10 duration-700 flex flex-col max-h-[90vh]">
                <button
                  className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-full transition-all hover:rotate-90"
                  onClick={() => setSelectedStudent(null)}
                >
                  <IoClose size={24} />
                </button>

                <div className="flex flex-col items-center mb-12 space-y-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-full scale-125 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className="relative w-40 h-40 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-slate-50 flex items-center justify-center group-hover:rotate-3 transition-transform duration-500">
                      {selectedStudent.profile_pic ? <img src={selectedStudent.profile_pic} className="w-full h-full object-cover"/> : <RxAvatar size={120} className="text-slate-200"/>}
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{selectedStudent.name}</h3>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                       CADET LEVEL ANALYSIS
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-12">
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center shadow-inner group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">Identification ID</p>
                      <p className="font-black text-slate-900 text-lg font-mono leading-none">{selectedStudent.studentId}</p>
                   </div>
                   <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center shadow-inner group">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">Encrypted Communication</p>
                      <p className="font-black text-slate-900 text-lg leading-none">+91 {selectedStudent.phone || "SECURE"}</p>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 mb-12 pr-4 relative">
                  <div className="sticky top-0 bg-white py-4 z-10 flex items-center gap-4">
                     <div className="h-[1px] flex-1 bg-slate-100"></div>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Operational Sector Log</p>
                     <div className="h-[1px] flex-1 bg-slate-100"></div>
                  </div>
                  {selectedStudent.enrolledCourses?.map((course) => (
                    <div key={course.courseId} className="p-8 bg-white border border-slate-100 rounded-[3rem] group/card hover:border-blue-600 transition-all duration-500 shadow-xl shadow-slate-200/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full blur-2xl -mt-8 -mr-8 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="space-y-2">
                          <h4 className="font-black text-slate-900 text-2xl uppercase italic leading-none tracking-tight group-hover/card:text-blue-600 transition-colors">{course.name}</h4>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.3em]">{course.courseId}</span>
                        </div>
                        <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover/card:bg-blue-600 group-hover/card:text-white transition-all duration-500">
                           <FaChevronRight size={16}/>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-100 relative z-10">
                        <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/card:bg-white transition-colors shadow-inner">
                          <FaUserTie size={14}/>
                        </div>
                        <div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Mentor</p>
                           <p className="text-sm font-bold text-slate-700 uppercase italic leading-none">{course.trainer?.name}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedStudent.enrolledCourses?.length === 0 && (
                     <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <p className="text-slate-300 font-black italic uppercase tracking-widest text-xs">No sector logs found for this personnel.</p>
                     </div>
                  )}
                </div>

                <button
                  className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:bg-blue-600 transition-all active:scale-[0.98] group/btn"
                  onClick={() => navigate(`/student-attendance?studentId=${selectedStudent.studentId}`)}
                >
                  Extract Full Operational Records <span className="inline-block group-hover/btn:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Dashboard Footer Branding */}
        <footer className="max-w-7xl mx-auto mt-24 mb-10 px-6 flex justify-between items-center opacity-30 pointer-events-none">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Faculty Command OS // RANK-LEAD-ALPHA ACCESS</p>
           <div className="h-[1px] flex-1 mx-16 bg-slate-200"></div>
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">© 2026 FACULTYPRO.NETWORK</p>
        </footer>
      </main>
    </div>
  );
}


