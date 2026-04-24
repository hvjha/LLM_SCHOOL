import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt, FaTable, FaChevronLeft, FaChevronRight, FaRegTrashAlt, FaEdit, FaUserGraduate, FaFingerprint, FaShieldAlt, FaCircleNotch, FaFilter } from "react-icons/fa";

export default function StudentAttendance() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  // Get params from URL
  const studentIdParam = searchParams.get("studentId");
  const courseIdParam = searchParams.get("courseId");
  const studentId = studentIdParam || user?.studentId;
  
  const [studentData, setStudentData] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(courseIdParam || "all");
  const [viewMode, setViewMode] = useState("calendar");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);

  // Check user role
  const isAdmin = user?.role === "superadmin";
  const canEdit = isAdmin;

  useEffect(() => {
    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId, selectedMonth]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      
      const params = new URLSearchParams({
        month: month.toString(),
        year: year.toString(),
      });
      
      if (courseIdParam) {
        params.append('courseId', courseIdParam);
      }
      
      const res = await api.get(`/api/attendance/student/${studentId}?${params}`);
      setAttendanceData(res.data.attendance || []);
      setStudentData(res.data.student);
    } catch (err) {
      toast.error("Protocol Rejection: Failed to load attendance matrix");
    } finally {
      setLoading(false);
    }
  };

  const isWeekendDay = (jsDay) => jsDay === 0 || jsDay === 6;

  const getMonthDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ type: 'empty' });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const dayOfWeek = date.getDay();
      if (isWeekendDay(dayOfWeek)) {
        days.push({ type: 'weekend', date });
      } else {
        days.push({ type: 'workday', date });
      }
    }

    return days;
  };

  const days = getMonthDays();

  const getCourses = () => {
    const coursesMap = new Map();
    attendanceData.forEach((a) => {
      if (!coursesMap.has(a.course._id)) {
        coursesMap.set(a.course._id, {
          _id: a.course._id,
          name: a.course.name,
          courseId: a.course.courseId,
        });
      }
    });
    return Array.from(coursesMap.values());
  };

  const courses = getCourses();

  const getStatusForDate = (courseId, date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return attendanceData.find((a) => {
      const recordDate = new Date(a.date);
      const recordYear = recordDate.getUTCFullYear();
      const recordMonth = String(recordDate.getUTCMonth() + 1).padStart(2, '0');
      const recordDay = String(recordDate.getUTCDate()).padStart(2, '0');
      const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`;
      return a.course._id === courseId && recordDateStr === dateStr;
    });
  };

  const getCourseStats = (courseId) => {
    const filteredData = attendanceData.filter((a) => a.course._id === courseId);
    let implicitAbsents = 0;
    const now = new Date();
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const effectiveEndDate = lastDay > now ? now : lastDay;
    const recordDates = new Set(filteredData.map(a => new Date(a.date).toISOString().split('T')[0]));
    
    let current = new Date(year, month, 1);
    while (current <= effectiveEndDate) {
      const dayOfWeek = current.getDay();
      const dateStr = current.toISOString().split('T')[0];
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !recordDates.has(dateStr)) {
        implicitAbsents++;
      }
      current.setDate(current.getDate() + 1);
    }

    const presentDays = filteredData.filter((a) => a.status === "present").length;
    const explicitAbsentDays = filteredData.filter((a) => a.status === "absent").length;
    const totalAbsentDays = explicitAbsentDays + implicitAbsents;
    const totalDays = presentDays + totalAbsentDays;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    return { totalDays, presentDays, absentDays: totalAbsentDays, percentage };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    });
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  const changeMonth = (delta) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + delta);
    setSelectedMonth(newMonth);
  };

  const updateAttendance = async (attendanceId, newStatus) => {
    try {
      await api.put(`/api/attendance/${attendanceId}`, { status: newStatus });
      toast.success("Identity record synchronized");
      fetchAttendanceData();
      setEditingRecord(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Failure: Update rejected");
    }
  };

  const deleteAttendance = async (attendanceId) => {
    if (!window.confirm("Confirm Protocol: Permanent deletion of record?")) return;
    try {
      await api.delete(`/api/attendance/${attendanceId}`);
      toast.success("Record expunged");
      fetchAttendanceData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Failure: Deletion rejected");
    }
  };

  const getFilteredAttendance = () => {
    let filtered = attendanceData;
    if (selectedCourse !== "all") {
      filtered = filtered.filter((a) => a.course._id === selectedCourse);
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-32 opacity-30 animate-pulse">
         <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-[2rem] animate-spin mb-8"></div>
         <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Accessing Attendance Vault...</p>
      </div>
    );
  }

  const filteredAttendance = getFilteredAttendance();

  return (
    <div className="min-h-screen bg-slate-50/30 p-8 lg:p-16">
      <div className="max-w-[1600px] mx-auto space-y-16 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-slate-100 pb-16 relative overflow-hidden">
          <div className="flex items-start gap-10 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="w-16 h-16 bg-white rounded-[1.5rem] border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-xl shadow-slate-900/5 group"
            >
              <FaChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
            </button>
            <div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl shadow-slate-900/10">
                    <FaShieldAlt size={18}/>
                 </div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Identity Log</span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Attendance Profile</h1>
              <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.2em] text-[10px] italic max-w-xl leading-relaxed">Audit and manage authenticated personnel check-ins. High-precision neural tracking active.</p>
            </div>
          </div>

          <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 relative z-10">
             <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all font-black uppercase tracking-[0.3em] text-[10px] ${viewMode === "calendar" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-transparent text-slate-400 hover:bg-slate-50"}`}
            >
              <FaCalendarAlt size={14}/> Calendar Matrix
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] transition-all font-black uppercase tracking-[0.3em] text-[10px] ${viewMode === "table" ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" : "bg-transparent text-slate-400 hover:bg-slate-50"}`}
            >
              <FaTable size={14}/> Log Streams
            </button>
          </div>

          {/* Background Accent */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full blur-3xl -mt-20 -mr-20 group-hover:bg-blue-600/10 transition-colors duration-700"></div>
          
          <div className="relative">
             <div className="w-40 h-40 rounded-[3.5rem] border-8 border-slate-50 shadow-2xl overflow-hidden bg-slate-50 flex items-center justify-center relative z-10 group-hover:border-blue-100 transition-all duration-700">
               {studentData.profile_pic ? <img src={studentData.profile_pic} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"/> : <FaUserGraduate size={64} className="text-slate-200"/>}
             </div>
             <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 text-blue-600 z-20 group-hover:scale-110 transition-transform">
                <FaFingerprint size={24}/>
             </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6 relative z-10">
             <div>
                <h2 className="text-4xl font-black text-slate-900 uppercase italic leading-none tracking-tight group-hover:text-blue-600 transition-colors">{studentData.name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-5 mt-6">
                  <div className="flex items-center gap-3 bg-blue-50 text-blue-600 px-6 py-2 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest italic shadow-sm">
                     <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                     DESIGNATION: {studentData.studentId}
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 text-slate-400 px-6 py-2 rounded-full border border-slate-100 text-[10px] font-black uppercase tracking-widest italic shadow-sm group-hover:text-slate-900 transition-colors">
                     COMMS: {studentData.email}
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] flex flex-col xl:flex-row items-center justify-between gap-10">
           <div className="flex items-center gap-8">
              <button 
                onClick={() => changeMonth(-1)} 
                className="w-16 h-16 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 text-slate-400 shadow-sm flex items-center justify-center group"
              >
                <FaChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
              </button>
              <div className="text-center">
                 <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2 italic">Temporal Sector</p>
                 <span className="text-3xl font-black text-slate-900 uppercase italic tracking-tight min-w-[280px] block">
                    {formatMonthYear(selectedMonth)}
                 </span>
              </div>
              <button 
                onClick={() => changeMonth(1)} 
                disabled={selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear()}
                className="w-16 h-16 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-500 text-slate-400 disabled:opacity-10 shadow-sm flex items-center justify-center group"
              >
                <FaChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </button>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-6">
              {!courseIdParam && courses.length > 1 && (
                <div className="relative group">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-slate-50 border border-slate-100 rounded-[2rem] px-12 py-5 text-slate-900 font-black text-[11px] uppercase tracking-[0.2em] focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all appearance-none cursor-pointer w-full sm:w-80 italic shadow-sm"
                    >
                        <option value="all">Global Operational Tracks</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                        <FaFilter size={14}/>
                    </div>
                </div>
              )}
              <div className="h-16 px-8 bg-blue-50 text-blue-600 rounded-[2rem] border border-blue-100 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] italic shadow-sm">
                 <FaCircleNotch className="animate-spin" size={16}/> Neural Sync Active
              </div>
           </div>
        </div>

        {/* Calendar Grid Section */}
        {viewMode === "calendar" && (
          <div className="space-y-16">
            {(selectedCourse === "all" ? courses : courses.filter(c => c._id === selectedCourse)).map((course) => {
              const stats = getCourseStats(course._id);
              return (
                <div key={course._id} className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.04)] space-y-12 relative overflow-hidden group/course">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none group-hover/course:bg-blue-600/5 transition-colors duration-1000"></div>
                  
                  <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Deployment Sector</span>
                      </div>
                      <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight group-hover/course:text-blue-600 transition-colors">{course.name}</h3>
                      <div className="inline-block mt-4 px-5 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border border-slate-100 shadow-sm group-hover/course:border-blue-100 group-hover/course:text-blue-600 transition-all italic">
                         TRACK ID: {course.courseId}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-10 bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.2)] border border-white/5 relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none"></div>
                       <div className="text-center relative z-10">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 italic">Efficiency</p>
                          <p className="text-4xl font-black text-blue-400 leading-none italic">{stats.percentage}%</p>
                       </div>
                       <div className="text-center relative z-10 border-x border-white/10 px-10">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 italic">Active</p>
                          <p className="text-4xl font-black text-white leading-none italic">{stats.presentDays}</p>
                       </div>
                       <div className="text-center relative z-10">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 italic">Anomalies</p>
                          <p className="text-4xl font-black text-red-400 leading-none italic">{stats.absentDays}</p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-4 md:gap-6 relative z-10">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={day} className={`text-center text-[11px] font-black uppercase tracking-[0.4em] mb-4 italic ${i >= 5 ? "text-slate-200" : "text-slate-400"}`}>{day}</div>
                    ))}

                    {days.map((dayObj, index) => {
                      if (dayObj.type === 'empty') return <div key={`empty-${index}`} />;
                      
                      const date = dayObj.date;
                      const record = getStatusForDate(course._id, date);
                      const isPresent = record?.status === "present";
                      const isAbsent = record?.status === "absent";
                      const isToday = date.toDateString() === new Date().toDateString();
                      const isPastOrToday = date <= new Date();
                      const isImplicitAbsent = !record && dayObj.type === 'workday' && isPastOrToday;

                      return (
                        <div
                          key={date.toISOString()}
                          className={`aspect-square rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex flex-col items-center md:items-start justify-between border transition-all duration-700 relative overflow-hidden group/day ${
                            isPresent ? "bg-slate-900 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] scale-100 hover:scale-105" : 
                            isAbsent || isImplicitAbsent ? "bg-red-50/50 border-red-100 hover:bg-red-50 transition-colors" : 
                            dayObj.type === 'weekend' ? "bg-slate-50 border-slate-100 opacity-20 grayscale" : 
                            "bg-white border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-600/5"
                          } ${isToday ? "ring-8 ring-blue-100 border-blue-600 scale-105 z-10" : ""}`}
                        >
                          <span className={`text-xl md:text-3xl font-black italic tracking-tighter leading-none ${isPresent ? "text-white" : isToday ? "text-blue-600" : "text-slate-900"}`}>{date.getDate()}</span>
                          <div className="hidden md:block">
                            {isPresent ? (
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] italic">Verified</span>
                              </div>
                            ) : isAbsent || isImplicitAbsent ? (
                              <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] italic">Null Ops</span>
                            ) : dayObj.type === 'weekend' ? (
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Sector Rest</span>
                            ) : (
                              <span className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em] italic">Pending</span>
                            )}
                          </div>
                          {isPresent && <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/20 rounded-full blur-2xl -mt-10 -mr-10"></div>}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-12 pt-12 border-t border-slate-100 relative z-10">
                    <div className="flex items-center gap-4 group/legend cursor-help">
                      <div className="w-6 h-6 bg-slate-900 rounded-lg shadow-lg group-hover/legend:scale-110 transition-transform"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Verified Presence</span>
                    </div>
                    <div className="flex items-center gap-4 group/legend cursor-help">
                      <div className="w-6 h-6 bg-red-50 border border-red-100 rounded-lg group-hover/legend:scale-110 transition-transform"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Anomaly Detection</span>
                    </div>
                    <div className="flex items-center gap-4 group/legend cursor-help">
                      <div className="w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg opacity-40 group-hover/legend:scale-110 transition-transform"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Operational Rest</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Table View Section */}
        {viewMode === "table" && (
          <div className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.04)] animate-fade-in-up relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] pointer-events-none"></div>
            
            {filteredAttendance.length === 0 ? (
              <div className="p-48 text-center flex flex-col items-center opacity-30">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-10 shadow-inner">
                   <FaTable size={48}/>
                </div>
                <p className="text-4xl font-black text-slate-900 uppercase italic tracking-tight">Zero Transmission Records</p>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-6 italic">No check-in logs detected for the selected period.</p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] italic">Operational Date</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] italic">Track Target</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] italic text-center">Verification Status</th>
                      <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] italic">Validation Authority</th>
                      {canEdit && <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] italic text-center">Protocol</th>}
                          </div>
                        </td>
                        <td className="px-12 py-10">
                           <div className="flex justify-center">
                            {editingRecord === record._id ? (
                              <div className="relative group/select">
                                <select 
                                    value={record.status} 
                                    onChange={(e) => updateAttendance(record._id, e.target.value)}
                                    className="bg-white border-4 border-blue-600 rounded-2xl px-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none shadow-xl shadow-blue-600/10 transition-all cursor-pointer appearance-none italic"
                                >
                                    <option value="present">VERIFIED</option>
                                    <option value="absent">NULL OPS</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                                   <FaChevronRight className="rotate-90" size={10}/>
                                </div>
                              </div>
                            ) : (
                              <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border italic shadow-sm flex items-center gap-3 ${record.status === "present" ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-500 border-red-100"}`}>
                                <span className={`w-2 h-2 rounded-full ${record.status === 'present' ? 'bg-blue-600 animate-pulse' : 'bg-red-500'}`}></span>
                                {record.status === 'present' ? 'Verified' : 'Null Ops'}
                              </span>
                            )}
                           </div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 border border-slate-100 group-hover:text-blue-600 group-hover:border-blue-100 transition-all shadow-sm">
                                <FaShieldAlt size={16}/>
                             </div>
                             <div>
                                <div className="text-slate-900 font-black text-[12px] uppercase italic leading-none group-hover:text-blue-600 transition-colors">{record.markedBy?.name || "Neural Network"}</div>
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2 italic">Validation Signature</p>
                             </div>
                          </div>
                        </td>
                        {canEdit && (
                          <td className="px-12 py-10">
                            <div className="flex gap-4 justify-center">
                               {editingRecord === record._id ? (
                                 <button onClick={() => setEditingRecord(null)} className="w-12 h-12 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center group/close"><IoClose size={24} className="group-hover:rotate-90 transition-transform"/></button>
                               ) : (
                                 <>
                                   <button onClick={() => setEditingRecord(record._id)} className="w-12 h-12 bg-white border border-slate-100 text-slate-300 rounded-2xl hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 transition-all shadow-sm flex items-center justify-center group/btn"><FaEdit size={16} className="group-hover/btn:rotate-12 transition-transform"/></button>
                                   <button onClick={() => deleteAttendance(record._id)} className="w-12 h-12 bg-white border border-slate-100 text-slate-300 rounded-2xl hover:text-red-600 hover:border-red-100 hover:bg-red-50/30 transition-all shadow-sm flex items-center justify-center group/btn"><FaRegTrashAlt size={16} className="group-hover/btn:scale-110 transition-transform"/></button>
                                 </>
                               )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}