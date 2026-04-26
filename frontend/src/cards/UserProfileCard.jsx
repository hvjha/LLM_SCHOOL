import React from "react";
import { RxAvatar } from "react-icons/rx";
import { FaCloudUploadAlt, FaSave, FaTimes, FaShieldAlt, FaUserEdit } from "react-icons/fa";
import uploadFile from "../helper/UploadFile";

export default function UserProfileCard({
  user,
  editMode,
  updatedUser,
  setUpdatedUser,
  handleUpdate,
  setEditMode,
  courses = [],
}) {
  if (!user) return null;
  const isTrainer = user.role === "trainer";
  const isStudent = user.role === "student";

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    try {
      const uploaded = await uploadFile(file);
      setUpdatedUser({ ...updatedUser, profile_pic: uploaded?.secure_url });
    } catch (e) {
      console.error("Profile sync failed");
    }
  };

  return (
    <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/profile">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mt-32 -mr-32 group-hover/profile:bg-blue-600/5 transition-colors duration-1000"></div>

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-16 relative z-10">
        {/* Avatar Section */}
        <div className="shrink-0 space-y-6 flex flex-col items-center">
          <div className="relative">
             <div className="w-48 h-48 rounded-[4rem] bg-slate-50 border-8 border-white shadow-2xl overflow-hidden relative group/avatar">
               {updatedUser?.profile_pic || user?.profile_pic ? (
                 <img
                   src={updatedUser?.profile_pic || user?.profile_pic}
                   alt="Profile"
                   className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-1000"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-200">
                    <RxAvatar size={96} />
                 </div>
               )}
               {editMode && (
                  <label className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500">
                     <FaCloudUploadAlt size={32} className="text-white mb-2" />
                     <span className="text-[9px] font-black text-white uppercase tracking-widest italic">Sync Image</span>
                     <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e.target.files[0])} className="hidden" />
                  </label>
               )}
             </div>
             <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl border border-slate-50">
                <FaShieldAlt size={20}/>
             </div>
          </div>
          
          <div className="text-center space-y-2">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest italic">
                {user.role} STATUS
             </div>
          </div>
        </div>

        {/* Data Fields */}
        <div className="flex-1 w-full space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Identity Name</label>
              {editMode ? (
                <input
                  type="text"
                  value={updatedUser.name}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-sm uppercase italic tracking-tighter focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-sm"
                />
              ) : (
                <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-slate-900 font-black text-lg uppercase italic tracking-tighter shadow-sm flex items-center gap-4">
                   <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                   {user.name}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Registry Comms (Email)</label>
              {editMode ? (
                <input
                  type="email"
                  value={updatedUser.email}
                  onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-sm uppercase italic tracking-tighter focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-sm"
                />
              ) : (
                <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-slate-500 font-black text-sm uppercase italic tracking-tight shadow-sm truncate">
                   {user.email}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Uplink Frequency (Phone)</label>
              {editMode ? (
                <input
                  type="text"
                  value={String(updatedUser.phone || "")}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setUpdatedUser({ ...updatedUser, phone: digits });
                  }}
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-sm uppercase italic tracking-tighter focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-sm"
                  maxLength={10}
                />
              ) : (
                <div className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-slate-900 font-black text-sm uppercase italic tracking-widest shadow-sm">
                   +91 {user.phone || "HIDDEN"}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-6 italic">Sector Identifier</label>
              <div className="px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-400 font-black text-sm uppercase italic tracking-widest shadow-inner">
                 {isTrainer ? user.trainerId : user.studentId}
              </div>
            </div>
          </div>

          <div className="pt-10 flex gap-6 border-t border-slate-50">
            {editMode ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-blue-600 transition-all duration-500 shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-4"
                >
                  <FaSave size={16}/> Synchronize Profile
                </button>
                <button
                  onClick={() => { setEditMode(false); setUpdatedUser(user); }}
                  className="px-12 py-5 bg-slate-50 text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-red-50 hover:text-red-500 transition-all duration-500 flex items-center justify-center gap-4 border border-slate-100"
                >
                  <FaTimes size={16}/> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="w-full py-5 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] italic hover:bg-blue-600 transition-all duration-700 shadow-2xl shadow-slate-900/30 flex items-center justify-center gap-6 group/btn"
              >
                <FaUserEdit size={20} className="group-hover/btn:rotate-12 transition-transform duration-500"/> Initiate Parameter Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
