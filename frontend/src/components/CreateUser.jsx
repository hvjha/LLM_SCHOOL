import React, { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import uploadFile from "../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import { FaUserPlus, FaUserShield, FaIdCard, FaCloudUploadAlt, FaCheckCircle, FaLock, FaGlobe, FaBriefcase, FaEnvelope, FaPhone } from "react-icons/fa";

export default function CreateUser() {
  const [formUser, setFormUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    profile_pic: "",
    securityQuestion: "",
    securityAnswer: "",
    experience: "", // only for trainer
    company: "",    // only for trainer
  });

  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Text Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };

  // Upload Profile Photo
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      const uploaded = await uploadFile(file);
      setUploadPhoto(file);
      setFormUser((prev) => ({
        ...prev,
        profile_pic: uploaded?.secure_url,
      }));
      toast.success("Identity visual synchronized");
    } catch (err) {
      toast.error("Visual processing failed");
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadedPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    setFormUser((prev) => ({ ...prev, profile_pic: "" }));
  };

  // Create User
  const createUser = async (e) => {
    e.preventDefault();

    // Validate phone (10 digits only)
    const phoneDigits = formUser.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return toast.error("Communication vector must be exactly 10 digits");
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/api/admin/create-user", {
        ...formUser,
        phone: phoneDigits,
      });

      if (res.data.success) {
        toast.success("Personnel authorization complete");

        // Reset form
        setFormUser({
          name: "",
          email: "",
          password: "",
          role: "student",
          phone: "",
          profile_pic: "",
          securityQuestion: "",
          securityAnswer: "",
          experience: "",
          company: "",
        });
        setUploadPhoto(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol rejection: Creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12 animate-fade-in-up">
      <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.08)] w-full max-w-4xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] -mt-40 -mr-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slate-900/5 rounded-full blur-[100px] -mb-40 -ml-40 pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-[2.5rem] mb-8 text-slate-900 shadow-inner border border-slate-100 group">
            <FaUserPlus size={36} className="group-hover:scale-110 transition-transform duration-700"/>
          </div>
          <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Access Enrollment</h2>
          <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.3em] text-[10px] italic">Deploy new credentials and authorize personnel access levels.</p>
        </div>

        <form onSubmit={createUser} className="space-y-16 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {/* Name */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Registry Name</label>
               <input
                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                placeholder="Ex: John Doe"
                name="name"
                required
                value={formUser.name}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Secure Comms</label>
               <div className="relative">
                <input
                    className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                    placeholder="Ex: ops@sector.com"
                    name="email"
                    type="email"
                    required
                    value={formUser.email}
                    onChange={handleChange}
                />
                <FaEnvelope className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
               </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Access Sequence</label>
               <div className="relative">
                <input
                    className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                    placeholder="Secret Key"
                    name="password"
                    type="password"
                    required
                    value={formUser.password}
                    onChange={handleChange}
                />
                <FaLock className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
               </div>
            </div>

            {/* Role */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Operational Level</label>
               <div className="relative">
                 <select
                  className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-black focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all appearance-none uppercase tracking-[0.2em] text-[10px] italic cursor-pointer"
                  name="role"
                  value={formUser.role}
                  onChange={handleChange}
                >
                  <option value="student">Rank: Student</option>
                  <option value="trainer">Rank: Trainer</option>
                  <option value="superadmin">Rank: Overlord (Admin)</option>
                </select>
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600">
                  <FaIdCard size={18}/>
                </div>
               </div>
            </div>

            {/* Phone */}
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Mobile Uplink</label>
               <div className="relative">
                <input
                    className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                    placeholder="10-digit Vector"
                    name="phone"
                    maxLength={10}
                    required
                    value={formUser.phone}
                    onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                    handleChange(e);
                    }}
                />
                <FaPhone className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
               </div>
            </div>

            {/* Conditional Fields for Trainer */}
            {formUser.role === "trainer" && (
              <>
                <div className="space-y-3 animate-fade-in">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Battle Experience</label>
                  <div className="relative">
                    <input
                        className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                        placeholder="Ex: 5 Years"
                        name="experience"
                        value={formUser.experience}
                        onChange={handleChange}
                    />
                    <FaGlobe className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                  </div>
                </div>
                <div className="space-y-3 animate-fade-in">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Current Sector</label>
                   <div className="relative">
                    <input
                        className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                        placeholder="Ex: Google Deepmind"
                        name="company"
                        value={formUser.company}
                        onChange={handleChange}
                    />
                    <FaBriefcase className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200" size={16}/>
                   </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Photo Upload */}
          <div className="space-y-4 pt-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Visual Identification Matrix</label>
            <label htmlFor="profile_pic" className="block group cursor-pointer">
              <div className={`p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-6 ${uploadPhoto ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-600 hover:bg-white'}`}>
                {isUploading ? (
                   <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Scanning Identity...</span>
                    </div>
                ) : uploadPhoto ? (
                  <>
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                        <img src={formUser.profile_pic} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{uploadPhoto.name}</p>
                      <button onClick={clearUploadedPhoto} className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mt-3 hover:text-red-700 flex items-center gap-2 mx-auto">
                        Purge Visual Data
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <FaCloudUploadAlt className="text-slate-300 group-hover:text-blue-600 transition-colors" size={40}/>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase italic tracking-tight">Inject Profile Intelligence</p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">PNG, JPG or WEBP // Sector Standards Applied</p>
                    </div>
                  </>
                )}
              </div>
            </label>
            <input
              id="profile_pic"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUploadPhoto}
            />
          </div>

          <div className="pt-12 border-t border-slate-50 space-y-10">
            <div className="flex items-center gap-5 px-2">
               <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                  <FaUserShield size={18}/>
               </div>
               <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Recovery Protocols</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Security Inquiry</label>
                <input
                  className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                  placeholder="Ex: First Ops Mission?"
                  name="securityQuestion"
                  required
                  value={formUser.securityQuestion}
                  onChange={handleChange}
                />
              </div>
               <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Secret Cipher</label>
                <input
                  className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                  placeholder="Answer"
                  name="securityAnswer"
                  required
                  value={formUser.securityAnswer}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              disabled={isSubmitting}
              className="w-full py-8 bg-slate-900 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
              type="submit"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaCheckCircle size={18} className="group-hover:rotate-12 transition-transform"/>
              )}
              {isSubmitting ? "Processing Authorization..." : "Commence Personnel Deployment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



