import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import uploadFile from "../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import { FaBookOpen, FaLayerGroup, FaPlus, FaCloudUploadAlt, FaChevronDown, FaCheck, FaCheckCircle } from "react-icons/fa";

export default function CreateCourse({ trainers, onCourseCreated }) {
  const [formCourse, setFormCourse] = useState({ trainers: [] });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploadPhoto, setUploadPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Course Thumbnail
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploaded = await uploadFile(file);
      setUploadPhoto(file);
      setFormCourse((prev) => ({
        ...prev,
        course_img: uploaded?.secure_url,
      }));
      toast.success("Intelligence asset synchronized");
    } catch (err) {
      toast.error("Upload failure: Check connection");
    } finally {
      setIsUploading(false);
    }
  };

  // Clear uploaded image
  const clearUploadedPhoto = (e) => {
    e.preventDefault();
    setUploadPhoto(null);
    setFormCourse((prev) => ({ ...prev, course_img: "" }));
  };

  // Submit Course
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post("/api/course/course-create", {
        courseId: formCourse.courseId,
        name: formCourse.name,
        price: Number(formCourse.price),
        trainerIds: formCourse.trainers,
        course_img: formCourse.course_img || "", 
      });

      toast.success("New curriculum deployed to grid");

      // reset form
      setFormCourse({ trainers: [] });
      setUploadPhoto(null);

      if (onCourseCreated) onCourseCreated();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol rejection: Deployment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trainer Selection Handler
  const handleTrainerSelect = (trainerId) => {
    if (formCourse.trainers.includes(trainerId)) {
      setFormCourse({
        ...formCourse,
        trainers: formCourse.trainers.filter((id) => id !== trainerId),
      });
    } else {
      setFormCourse({
        ...formCourse,
        trainers: [...formCourse.trainers, trainerId],
      });
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
            <FaBookOpen size={36} className="group-hover:rotate-12 transition-transform duration-700"/>
          </div>
          <h2 className="text-5xl font-black text-slate-900 uppercase italic tracking-tight leading-none">Track Engineering</h2>
          <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.3em] text-[10px] italic">Architect new educational protocols and assign lead faculty.</p>
        </div>

        <form onSubmit={createCourse} className="space-y-12 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Course Registry ID</label>
               <input
                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                placeholder="Ex: QUANTUM-701"
                required
                value={formCourse.courseId || ""}
                onChange={(e) => setFormCourse({ ...formCourse, courseId: e.target.value })}
              />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Track Designation</label>
               <input
                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                placeholder="Curriculum Title"
                required
                value={formCourse.name || ""}
                onChange={(e) => setFormCourse({ ...formCourse, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8">Operational Cost (INR)</label>
               <input
                type="number"
                className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-slate-900 font-bold focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all placeholder:text-slate-300 italic"
                placeholder="0.00"
                required
                value={formCourse.price || ""}
                onChange={(e) => setFormCourse({ ...formCourse, price: e.target.value })}
              />
            </div>

            {/* Course Image Upload */}
            <div className="col-span-1 md:col-span-2 space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Curriculum Visual Identity</label>
              <label htmlFor="course_img" className="block cursor-pointer group">
                <div className={`p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-6 ${uploadPhoto ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-blue-600 hover:bg-white'}`}>
                   {isUploading ? (
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Processing Asset...</span>
                     </div>
                   ) : uploadPhoto ? (
                      <div className="flex items-center gap-8 w-full p-2">
                         <div className="w-32 h-32 rounded-[2rem] bg-cover bg-center shadow-2xl border-4 border-white" style={{ backgroundImage: `url(${formCourse.course_img})` }}></div>
                         <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 uppercase italic truncate tracking-tight">{uploadPhoto.name}</p>
                            <button onClick={clearUploadedPhoto} className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mt-3 hover:text-red-700 flex items-center gap-2">
                               Purge Visual Asset
                            </button>
                         </div>
                      </div>
                   ) : (
                      <>
                        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                           <FaCloudUploadAlt className="text-slate-300 group-hover:text-blue-600 transition-colors" size={40}/>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase italic tracking-tight">Upload Intelligence Graphic</p>
                          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">Optimal dimensions: 1280x720 // High Resolution</p>
                        </div>
                      </>
                   )}
                </div>
              </label>

              <input
                id="course_img"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadPhoto}
              />
            </div>

            {/* Dropdown for Trainers */}
            <div className="relative col-span-1 md:col-span-2 space-y-4 pt-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-8 italic">Faculty Command Deployment</label>
              <div
                className={`flex items-center justify-between px-10 py-6 bg-slate-50 border rounded-[2rem] cursor-pointer transition-all ${dropdownOpen ? 'border-blue-600 ring-8 ring-blue-100' : 'border-slate-100 hover:border-blue-300 hover:bg-white'}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formCourse.trainers.length > 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                       <FaLayerGroup size={16}/>
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic ${formCourse.trainers.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                      {formCourse.trainers.length > 0
                          ? `${formCourse.trainers.length} Faculty Members Deployed`
                          : "Command Personnel Required"}
                    </span>
                </div>
                <FaChevronDown className={`text-slate-300 transition-transform duration-500 ${dropdownOpen ? 'rotate-180 text-blue-600' : ''}`} size={14}/>
              </div>

              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-4 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.1)] max-h-72 overflow-y-auto z-50 p-6 no-scrollbar animate-scale-in origin-top">
                  {trainers?.map((t) => (
                    <label
                      key={t._id}
                      className={`flex items-center justify-between p-5 cursor-pointer rounded-2xl transition-all group mb-2 ${formCourse.trainers.includes(t.trainerId) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tight">{t.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">RANK: FACULTY #{t.trainerId}</span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={formCourse.trainers.includes(t.trainerId)}
                          onChange={() => handleTrainerSelect(t.trainerId)}
                          className="peer appearance-none w-7 h-7 border-4 border-white bg-slate-100 rounded-xl checked:bg-blue-600 transition-all cursor-pointer shadow-sm"
                        />
                        <FaCheck className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12}/>
                      </div>
                    </label>
                  ))}
                  {(!trainers || trainers.length === 0) && (
                    <div className="py-12 text-center">
                       <p className="text-[11px] font-black text-slate-300 uppercase italic tracking-[0.3em]">No faculty available in sector</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6">
            <button 
              disabled={isSubmitting}
              className="w-full py-7 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaCheckCircle size={18} className="group-hover:scale-125 transition-transform" />
              )}
              {isSubmitting ? "Deploying Curriculum..." : "Commence Track Deployment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
