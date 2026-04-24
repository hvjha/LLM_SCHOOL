import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import api from "../api/api";
import { IoClose } from "react-icons/io5";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaQuestionCircle, FaArrowRight, FaCamera, FaGraduationCap, FaShieldAlt } from "react-icons/fa";
import uploadFile from "../helper/UploadFile";

export default function Auth() {
  const { login, register } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({});
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [question, setQuestion] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const uploaded = await uploadFile(file);
    setLoading(false);

    setUploadPhoto(file);
    setForm((prev) => ({
      ...prev,
      profile_pic: uploaded?.secure_url,
    }));
  };

  const clearUploadedPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    setForm((prev) => ({ ...prev, profile_pic: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      const phoneDigits = form.phone?.replace(/\D/g, "").trim();
      if (!phoneDigits || phoneDigits.length !== 10) {
        setLoading(false);
        return toast.error("Communication vector failure: 10 digits required");
      }
      form.phone = phoneDigits; 
    }

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          profile_pic: form.profile_pic || "",
          phone: form.phone,
          role: "student",
          securityQuestion: form.securityQuestion || "First School Name?",
          securityAnswer: form.securityAnswer || "",
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Authentication rejected: System error");
    } finally {
      setLoading(false);
    }
  };
  
  const askQuestion = async () => {
    if (!form.email) return toast.error("Identity required: Enter email address");
    try {
      const res = await api.post("/api/forgot-password/question", { email: form.email });
      setQuestion(res.data.securityQuestion);
      setShowForgot(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registry error: Identity not found");
    }
  };

  const verifyAnswer = async () => {
    try {
      const res = await api.post("/api/forgot-password/verify", {
        email: form.email,
        securityAnswer: form.securityAnswer,
      });
      setResetToken(res.data.resetToken);
      toast.success("Security bypass authorized: Reset password");
    } catch (err) {
      toast.error("Verification failed: Answer incorrect");
    }
  };

  const reset = async () => {
    try {
      await api.post("/api/forgot-password/reset", { resetToken, newPassword });
      toast.success("Identity recalibrated: Password updated");
      setShowForgot(false);
    } catch (err) {
      toast.error("Protocol failure: Reset unsuccessful");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 lg:p-12 selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-[50vw] h-[50vw] bg-blue-50 rounded-full blur-[120px] opacity-60 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="fixed bottom-0 right-0 w-[40vw] h-[40vw] bg-slate-100 rounded-full blur-[100px] opacity-40 translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-6xl w-full bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden grid lg:grid-cols-12 relative z-10 animate-fade-in-up">
        
        {/* Left Side: Form */}
        <div className="lg:col-span-7 p-10 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6">
               <FaShieldAlt size={12}/> Secure Access Protocol
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none uppercase italic mb-4">
              {mode === "login" ? "Authentication Hub" : "Establish Identity"}
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              {mode === "login" 
                ? "Synchronize your credentials to access the central management grid." 
                : "Register your professional parameters to join the elite faculty network."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {mode === "register" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      name="name"
                      required
                      onChange={handleChange}
                      placeholder="e.g. Alex Mercer"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
                
                <div className="space-y-2 group">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Profile Visual</label>
                   <label htmlFor="profile_pic" className="block cursor-pointer">
                    <div className="flex items-center gap-4 w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] hover:border-blue-600 transition-all group-hover:bg-white">
                      <FaCamera className="text-slate-300 group-hover:text-blue-600" />
                      <span className="text-slate-400 text-sm font-bold truncate">
                        {uploadPhoto?.name || "Upload Identity Photo"}
                      </span>
                      {uploadPhoto && (
                        <button onClick={clearUploadedPhoto} className="ml-auto text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors">
                          <IoClose />
                        </button>
                      )}
                    </div>
                  </label>
                  <input id="profile_pic" type="file" className="hidden" onChange={handleUploadPhoto} />
                </div>

                <div className="space-y-2 group">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Mobile Uplink</label>
                   <div className="relative">
                    <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      name="phone"
                      required
                      maxLength={10}
                      onChange={handleChange}
                      onInput={(e) => (e.target.value = e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit Vector"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Recovery Vector</label>
                   <div className="relative">
                    <FaQuestionCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      name="securityQuestion"
                      required
                      onChange={handleChange}
                      placeholder="Security Question"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Recovery Answer</label>
                   <input
                    name="securityAnswer"
                    required
                    onChange={handleChange}
                    placeholder="Enter Secret Key"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Secure Email</label>
                 <div className="relative">
                  <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    onChange={handleChange}
                    placeholder="registry@system.core"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">Access Password</label>
                 <div className="relative">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === "login" ? "Initiate Access" : "Create Profile"}
                  <FaArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-[11px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.3em] italic"
              >
                {mode === "login" ? "New Operator? Request Entry" : "Existing Operator? Terminal Login"}
              </button>
            </div>
          </form>

          {/* Forgot Password Flow */}
          <div className="mt-12 pt-10 border-t border-slate-50">
             {!showForgot ? (
                <button onClick={askQuestion} className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span> Forgot Access Key?
                </button>
             ) : (
                <div className="space-y-8 animate-fade-in-up">
                   <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 text-blue-200"><FaQuestionCircle size={48}/></div>
                      <span className="text-blue-600 font-black uppercase tracking-widest text-[9px] block mb-3 relative z-10">RECOVERY CHALLENGE</span>
                      <p className="text-slate-900 font-black text-2xl uppercase italic tracking-tight relative z-10">{question}</p>
                   </div>
                   <div className="space-y-4">
                     <input
                       name="securityAnswer"
                       onChange={handleChange}
                       placeholder="Response Parameter"
                       className="w-full px-8 py-5 bg-white border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-900 shadow-sm"
                     />
                     <div className="flex gap-4">
                       <button onClick={verifyAnswer} className="flex-1 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Authorize</button>
                       <button onClick={() => setShowForgot(false)} className="px-8 py-5 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-900 transition-colors">Abort</button>
                     </div>
                   </div>

                   {resetToken && (
                      <div className="space-y-6 pt-8 border-t border-slate-50 animate-fade-in-up">
                         <div className="space-y-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6">New Access Key</label>
                            <input
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Key Parameters"
                              className="w-full px-8 py-5 bg-white border border-blue-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-900"
                            />
                         </div>
                         <button onClick={reset} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-2xl">Update Core Registry</button>
                      </div>
                   )}
                </div>
             )}
          </div>
        </div>

        {/* Right Side: Decorative Panel */}
        <div className="hidden lg:flex lg:col-span-5 relative bg-slate-900 items-center justify-center p-20 overflow-hidden">
          {/* Complex Background */}
          <div className="absolute inset-0 bg-blue-600/5"></div>
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-600/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>
          
          <div className="relative z-10 w-full space-y-16">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)] border-b-8 border-blue-700">
                <FaGraduationCap size={44} />
              </div>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-blue-600/50 to-transparent"></div>
            </div>

            <div className="space-y-8">
              <h3 className="text-6xl font-black leading-[1.05] text-white tracking-tighter uppercase italic">
                Advanced <br/>
                <span className="text-blue-500">Academic</span> <br/>
                Management.
              </h3>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                Next-generation orchestration for elite educational institutions. Optimized for speed, security, and strategic growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-12 pt-16 border-t border-white/5">
               <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                     <span className="text-2xl font-black">99</span>
                  </div>
                  <div>
                    <p className="text-xl font-black text-white uppercase italic tracking-tight">System Uptime</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Real-time Node Monitoring</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 border border-white/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                     <span className="text-2xl font-black">12</span>
                  </div>
                  <div>
                    <p className="text-xl font-black text-white uppercase italic tracking-tight">Encryption Layers</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Military-Grade Security</p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-0 w-full text-center px-6 opacity-20 pointer-events-none">
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.5em]">Centralized Academic OS // Authorized Access Only</p>
      </div>
    </div>
  );
}


