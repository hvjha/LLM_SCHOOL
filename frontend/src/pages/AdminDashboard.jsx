import React, { useState, useEffect } from "react";
import api from "../api/api";
import Users from "../components/User";
import Students from "../components/Student";
import Trainers from "../components/Trainer";
import CreateUser from "../components/CreateUser";
import { toast } from "react-toastify";
import CreateCourse from "../components/CreateCourse";
import EnrollStudent from "../components/EnrollStudent";
import ManageCourses from "../components/Managecourse";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import UploadCourseContent from "../components/UploadCourseContent";
import ManageUploadedContent from "../components/ManageUploadedContent";
import AdminAttendance from "../components/AdminAttendance";
import AdminLibrary from "../components/library/AdminLibrary";
import { 
  FaHome, FaUsers, FaUserTie, FaClipboardList, 
  FaUserPlus, FaDraftingCompass, FaUserTag, 
  FaLayerGroup, FaCloudUploadAlt, FaFolderOpen, FaBook 
} from "react-icons/fa";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const tabs = [
    { id: "home", label: "Control Center", icon: <FaHome size={14}/> },
    { id: "students", label: "Student Roster", icon: <FaUsers size={14}/> },
    { id: "trainers", label: "Faculty Directory", icon: <FaUserTie size={14}/> },
    { id: "attendance", label: "Attendance Logs", icon: <FaClipboardList size={14}/> },
    { id: "createUser", label: "Provision User", icon: <FaUserPlus size={14}/> },
    { id: "createCourse", label: "Draft Curriculum", icon: <FaDraftingCompass size={14}/> },
    { id: "enroll", label: "Enrollment", icon: <FaUserTag size={14}/> },
    { id: "manageCourses", label: "Curriculum Ops", icon: <FaLayerGroup size={14}/> },
    { id: "uploadContent", label: "Asset Pipeline", icon: <FaCloudUploadAlt size={14}/> },
    { id: "manageContent", label: "Asset Management", icon: <FaFolderOpen size={14}/> },
    { id: "library", label: "Digital Library", icon: <FaBook size={14}/> }
  ];

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/users");
      setUsers(data.users || data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol Failure: User sync failed");
    }
  };

  const loadCourses = async () => {
    try {
      const { data } = await api.get("/api/course/courses");
      setCourses(data.courses || data);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol Failure: Curriculum sync failed");
    }
  };

  useEffect(() => {
    loadUsers();
    loadCourses();
  }, []);

  const students = Array.isArray(users) ? users.filter((u) => u.role === "student") : [];
  const trainers = Array.isArray(users) ? users.filter((u) => u.role === "trainer") : [];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/30 pt-20">
      
      {/* Mobile Trigger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-[100] w-16 h-16 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl active:scale-90 transition-all border-4 border-white"
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
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-white border-r border-slate-100 flex flex-col z-[120] transform transition-all duration-700 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-10 flex items-center justify-between shrink-0">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
            ADMIN<span className="text-blue-600 uppercase italic">Core</span>
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <IoClose size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar px-6 pb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full group relative flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 font-black text-[10px] uppercase tracking-[0.25em] ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setSidebarOpen(false);
              }}
            >
              <span className={`transition-transform duration-500 ${activeTab === tab.id ? "text-blue-500 scale-110" : "group-hover:scale-110"}`}>
                {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute right-6 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 mt-auto shrink-0">
           <div className="p-6 bg-slate-900 rounded-[2rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-full -mt-10 -mr-10 blur-2xl"></div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3 leading-none">System Matrix</p>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <span className="text-[11px] font-black text-white uppercase italic tracking-tight">Active Protocol v4.0</span>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-6 lg:px-12 py-10 relative">
        <div className="max-w-7xl mx-auto animate-fade-in-up">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-slate-100 pb-12">
             <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2">
                   COMMAND INTERFACE
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <p className="text-slate-500 text-sm font-medium">Strategic oversight and operational control of the educational ecosystem.</p>
             </div>
             
             <div className="flex items-center gap-4">
                <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center min-w-[120px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Personnel</p>
                   <p className="text-2xl font-black text-slate-900 leading-none italic">{users.length}</p>
                </div>
                <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center min-w-[120px]">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Curriculum</p>
                   <p className="text-2xl font-black text-slate-900 leading-none italic">{courses.length}</p>
                </div>
             </div>
          </header>

          <section className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-slate-200/40 border border-slate-100 min-h-[700px] relative">
            {/* Subtle corner accent */}
            <div className="absolute top-0 left-0 w-2 h-20 bg-blue-600 rounded-full mt-12 -ml-[1px]"></div>
            
            {activeTab === "home" && <Users />}
            {activeTab === "students" && <Students />}
            {activeTab === "trainers" && <Trainers />}
            {activeTab === "createUser" && <CreateUser onUserCreated={loadUsers} />}
            {activeTab === "createCourse" && (
              <CreateCourse trainers={trainers} onCourseCreated={loadCourses} />
            )}
            {activeTab === "enroll" && (
              <EnrollStudent
                students={students}
                trainers={trainers}
                courses={courses}
                onEnroll={() => {
                  loadCourses();
                  loadUsers();
                }}
              />
            )}
            {activeTab === "manageCourses" && <ManageCourses />}
            {activeTab === "uploadContent" && <UploadCourseContent />}
            {activeTab === "manageContent" && <ManageUploadedContent />}
            {activeTab === "attendance" && <AdminAttendance students={students} />}
            {activeTab === "library" && <AdminLibrary/>}
          </section>
        </div>
        
        {/* Footer info */}
        <footer className="max-w-7xl mx-auto mt-12 mb-10 px-4 flex justify-between items-center opacity-30">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">© 2026 SCHOOL.MGMT.SYSTEM // LEVEL-8 ACCESS</p>
           <div className="h-[1px] flex-1 mx-10 bg-slate-200"></div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">SECURED BY ADMINCORE</p>
        </footer>
      </main>
    </div>
  );
}


