import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { FaUserGraduate, FaChalkboardTeacher, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/admin/users");
      // Filter out superadmin
      const filteredUsers = (data.users || data).filter(u => u.role !== "superadmin");
      setUsers(filteredUsers);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 opacity-20">
         <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Scanning Database</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">Personnel Network</h1>
           <p className="text-slate-500 font-medium mt-1">Audit and manage authenticated users in the ecosystem.</p>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
        {users.map((u) => (
          <div
            key={u._id}
            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 flex flex-col items-center text-center hover:border-blue-600 transition-all duration-500 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${u.role === 'trainer' ? 'bg-blue-600' : 'bg-slate-900'}`}></div>

            <div className="relative mb-8">
              <div className="w-28 h-28 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl group-hover:border-blue-600 transition-all duration-500 bg-slate-100 flex items-center justify-center">
                {u?.profile_pic ? (
                  <img
                    src={u?.profile_pic}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <span className="text-3xl font-black text-slate-300 uppercase">{u.name[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                {u.role === 'trainer' ? <FaChalkboardTeacher size={14}/> : <FaUserGraduate size={14}/>}
              </div>
            </div>

            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1 w-full px-2">
              {u.name}
            </h2>
            
            <div className="mt-6 space-y-5 w-full">
                <span className={`inline-block px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.role === 'trainer' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-900 border-slate-200'}`}>
                  {u.role}
                </span>

                <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <FaEnvelope size={10}/>
                        <p className="text-[11px] font-bold truncate tracking-tight lowercase">{u.email}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <FaPhone size={10}/>
                        <p className="text-[11px] font-bold tracking-tight">{u.phone || "Comm Link Offline"}</p>
                    </div>
                </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 opacity-30">
              <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Network Isolated</p>
              <p className="text-xs font-bold text-slate-500 mt-2 uppercase tracking-widest">No personnel records detected in current sector.</p>
          </div>
        )}
      </div>
    </div>
  );
}

