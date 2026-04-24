import React, { useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import uploadFile from "../../helper/UploadFile";
import { IoClose } from "react-icons/io5";
import { FaCloudUploadAlt, FaCheckCircle, FaBookOpen, FaShieldAlt, FaLayerGroup, FaPenNib, FaBarcode, FaGlobe, FaCalendarAlt, FaCopy, FaMapMarkerAlt } from "react-icons/fa";

const CATEGORY_OPTIONS = [
  "Fiction", "Non-Fiction", "Science", "Technology", "History", "Mathematics", "Programming", "Business", "Arts", "Other",
];

export default function AddBook() {
  const [formBook, setFormBook] = useState({
    title: "", author: "", isbn: "", category: "Other", publisher: "", publishedYear: "", totalCopies: 1, availableCopies: 1, description: "", coverImage: "", shelfLocation: "",
  });

  const [uploadCover, setUploadCover] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadCover = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploaded = await uploadFile(file);
      setUploadCover(file);
      setFormBook((prev) => ({ ...prev, coverImage: uploaded?.secure_url }));
      toast.success("Cover schematic synchronized");
    } catch {
      toast.error("Upload failure: Check protocol");
    } finally {
      setIsUploading(false);
    }
  };

  const clearUploadedCover = (e) => {
    e.preventDefault();
    setUploadCover(null);
    setFormBook((prev) => ({ ...prev, coverImage: "" }));
  };

  const submitBook = async (e) => {
    e.preventDefault();
    if (!formBook.title || !formBook.author || !formBook.isbn) {
      return toast.error("Required identifiers missing: Title, Creator, and ISBN");
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/api/library/book/add", {
        ...formBook,
        publishedYear: Number(formBook.publishedYear),
        totalCopies: Number(formBook.totalCopies),
      });

      if (res.data.success) {
        toast.success("Intelligence asset deployed to registry");
        setFormBook({ title: "", author: "", isbn: "", category: "Other", publisher: "", publishedYear: "", totalCopies: 1, availableCopies: 1, description: "", coverImage: "", shelfLocation: "" });
        setUploadCover(null);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Protocol rejection: Asset injection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 animate-fade-in">
      <div className="bg-white p-16 md:p-24 rounded-[4rem] border border-slate-100 shadow-[0_50px_150px_rgba(0,0,0,0.08)] w-full max-w-5xl relative overflow-hidden group/card">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none group-hover/card:bg-blue-600/10 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-slate-900/5 rounded-full blur-[100px] -mb-32 -ml-32 pointer-events-none"></div>

        <div className="text-center mb-20 relative z-10">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-slate-50 rounded-[3rem] mb-10 text-slate-900 shadow-inner border border-slate-100 group shadow-xl">
            <FaBookOpen size={40} className="group-hover:rotate-12 transition-transform duration-700"/>
          </div>
          <h2 className="text-6xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Initialize Asset</h2>
          <p className="text-slate-500 font-medium mt-6 uppercase tracking-[0.4em] text-[10px] italic">Inject new intelligence records into the centralized registry matrix.</p>
        </div>

        <form onSubmit={submitBook} className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Record Nomenclature</label>
            <div className="relative">
              <input
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="ASSET TITLE"
                name="title"
                value={formBook.title}
                onChange={handleChange}
              />
              <FaBookOpen className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Primary Creator</label>
            <div className="relative">
              <input
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="AUTHOR IDENTITY"
                name="author"
                value={formBook.author}
                onChange={handleChange}
              />
              <FaPenNib className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Registry Code (ISBN)</label>
            <div className="relative">
              <input
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="ISBN IDENTIFIER"
                name="isbn"
                value={formBook.isbn}
                onChange={handleChange}
              />
              <FaBarcode className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Asset Categorization</label>
            <div className="relative">
              <select
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all appearance-none italic tracking-tighter shadow-sm pl-16"
                name="category"
                value={formBook.category}
                onChange={handleChange}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-slate-900">{cat.toUpperCase()}</option>
                ))}
              </select>
              <FaLayerGroup className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Registry Node (Publisher)</label>
            <div className="relative">
              <input
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="PUBLISHER IDENTITY"
                name="publisher"
                value={formBook.publisher}
                onChange={handleChange}
              />
              <FaGlobe className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Deployment Cycle (Year)</label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="YYYY"
                name="publishedYear"
                value={formBook.publishedYear}
                onChange={handleChange}
              />
              <FaCalendarAlt className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Total Load Capacity</label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="UNIT COUNT"
                name="totalCopies"
                value={formBook.totalCopies}
                onChange={handleChange}
              />
              <FaCopy className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Available Grid Units</label>
            <div className="relative">
              <input
                type="number"
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="ACTIVE UNITS"
                name="availableCopies"
                value={formBook.availableCopies}
                onChange={handleChange}
              />
              <FaShieldAlt className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Storage Coordinates (Shelf)</label>
            <div className="relative">
              <input
                className="w-full px-12 py-7 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tighter shadow-sm pl-16"
                placeholder="SECTOR COORDINATES"
                name="shelfLocation"
                value={formBook.shelfLocation}
                onChange={handleChange}
              />
              <FaMapMarkerAlt className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
          </div>

          <div className="space-y-4 col-span-1 md:col-span-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Intelligence Summary</label>
            <textarea
              className="w-full px-12 py-8 bg-slate-50 border-2 border-slate-100 rounded-[3rem] text-slate-900 font-medium text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-200 italic tracking-tight shadow-sm min-h-[160px] no-scrollbar"
              placeholder="Classified description of asset content..."
              name="description"
              rows={3}
              value={formBook.description}
              onChange={handleChange}
            />
          </div>

          {/* Cover Image Upload Matrix */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Visual Schematic Asset</label>
            <label htmlFor="coverImage" className="block cursor-pointer group">
              <div className={`p-12 rounded-[4rem] border-4 border-dashed transition-all duration-700 flex flex-col items-center justify-center gap-8 ${uploadCover ? 'border-blue-600 bg-blue-50/30' : 'bg-slate-50 border-slate-100 hover:border-blue-400 hover:bg-white shadow-inner'}`}>
                 {isUploading ? (
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-600 italic">Processing Visual Schematic...</span>
                   </div>
                 ) : uploadCover ? (
                    <div className="flex items-center gap-12 w-full p-4">
                       <div className="w-32 h-32 rounded-[2rem] bg-cover bg-center shadow-2xl border-4 border-white ring-1 ring-slate-100" style={{ backgroundImage: `url(${formBook.coverImage})` }}></div>
                       <div className="flex-1 space-y-4">
                          <div>
                             <p className="text-xl font-black text-slate-900 uppercase italic truncate tracking-tight">{uploadCover.name}</p>
                             <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.4em] mt-2 italic">Schematic Synchronized</p>
                          </div>
                          <button onClick={clearUploadedCover} className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 active:scale-95">
                             <IoClose size={18}/> Purge Asset
                          </button>
                       </div>
                    </div>
                 ) : (
                    <>
                      <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl border border-slate-50 group-hover:scale-110 transition-all duration-700 group-hover:rotate-12">
                         <FaCloudUploadAlt className="text-slate-200 group-hover:text-blue-600 transition-colors" size={40}/>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase italic tracking-tight">Upload Visual Schematic</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] mt-3 italic">Dimensions: High Resolution // Registry Sync Active</p>
                      </div>
                    </>
                 )}
              </div>
            </label>
            <input
              id="coverImage"
              type="file"
              className="hidden"
              onChange={handleUploadCover}
            />
          </div>

          <div className="col-span-1 md:col-span-2 pt-8">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full py-9 font-black uppercase tracking-[0.5em] text-[12px] rounded-[3rem] transition-all duration-700 flex items-center justify-center gap-8 group italic ${isSubmitting || isUploading ? 'bg-slate-50 text-slate-200 cursor-not-allowed' : 'bg-slate-900 text-white shadow-[0_30px_100px_rgba(15,23,42,0.3)] hover:bg-blue-600 hover:scale-[1.02] active:scale-95'}`}
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaCheckCircle size={24} className="group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
              )}
              {isSubmitting ? "SYNCING REGISTRY..." : "COMMENCE ASSET DEPLOYMENT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
