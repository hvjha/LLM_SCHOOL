import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { FaTrashAlt, FaLayerGroup, FaFileVideo, FaFilePdf, FaFileImage, FaFileAlt, FaShieldAlt } from "react-icons/fa";

export default function ManageUploadedContent() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/content/all");
      const data = res.data.content;
      const grouping = {};

      data.forEach((item) => {
        const courseId = item.courseId;
        if (!grouping[courseId]) {
          grouping[courseId] = {
            videos: [],
            documents: []
          };
        }
        if (item.file_type === "video") {
          grouping[courseId].videos.push(item);
        } else {
          grouping[courseId].documents.push(item);
        }
      });
      setGrouped(grouping);
    } catch (err) {
      toast.error("Systems Error: Failed to synchronize archives");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Confirm Protocol: Permanent deletion of classified record?")) return;
    try {
      await api.delete(`/api/content/delete/${id}`);
      toast.success("Intelligence record expunged");
      loadAll();
    } catch (err) {
      toast.error("Systems failure: Deletion protocol aborted");
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div className="space-y-16 animate-fade-in py-10">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 border-b border-slate-100 pb-16 relative overflow-hidden">
        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-xl shadow-slate-900/10">
                <FaShieldAlt size={18}/>
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Archive Protocol</span>
           </div>
           <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Data Archives Control</h1>
           <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.2em] text-[10px] italic max-w-2xl leading-relaxed">Audit and manage stored intelligence assets across all curriculum tracks.</p>
        </div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {Object.keys(grouped).length === 0 && !loading && (
        <div className="py-64 text-center bg-white rounded-[5rem] border-4 border-dashed border-slate-50 opacity-30 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-200 mb-10 shadow-inner">
               <FaLayerGroup size={48}/>
            </div>
            <p className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter">Archives Isolated</p>
            <p className="text-[11px] font-black text-slate-400 mt-8 uppercase tracking-[0.5em] italic">No classified data currently stored in grid archives.</p>
        </div>
      )}

      {Object.keys(grouped).map((courseId) => (
        <div key={courseId} className="group bg-white rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] p-12 lg:p-16 relative overflow-hidden transition-all duration-700 hover:border-blue-600/30">
            {/* Design Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] -mt-32 -mr-32 pointer-events-none"></div>

            <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl group-hover:bg-blue-600 transition-colors duration-700">
                   <FaLayerGroup size={24}/>
                </div>
                <div>
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic mb-1 block">Track Segment</span>
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{courseId}</h3>
                </div>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 relative z-10">
              {/* VIDEOS */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <FaFileVideo className="text-blue-600" size={18}/>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Intelligence Streams</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {grouped[courseId].videos.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-100">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No video feeds secured.</p>
                      </div>
                    )}

                    {grouped[courseId].videos.map((v) => (
                    <div
                        key={v._id}
                        className="p-8 bg-slate-50 border border-slate-50 rounded-[2.5rem] hover:bg-white hover:border-blue-100 transition-all duration-500 group/item shadow-sm hover:shadow-xl hover:shadow-blue-900/5 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500">
                                 <FaFileVideo size={16}/>
                            </div>
                            <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">{v.duration}s</span>
                        </div>
                        
                        <p className="font-black text-slate-900 text-lg mb-6 line-clamp-2 leading-tight italic uppercase tracking-tighter group-hover/item:text-blue-600 transition-colors">
                            {v.title}
                        </p>

                        <button
                          className="w-full py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                          onClick={() => deleteItem(v._id)}
                        >
                          <FaTrashAlt size={12}/> Expunge
                        </button>
                    </div>
                    ))}
                </div>
              </div>

              {/* DOCUMENTS */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <FaFileAlt className="text-blue-600" size={18}/>
                   <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Classified Records</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {grouped[courseId].documents.length === 0 && (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-100">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No documents secured.</p>
                      </div>
                    )}

                    {grouped[courseId].documents.map((d) => (
                    <div
                        key={d._id}
                        className="p-8 bg-slate-50 border border-slate-50 rounded-[2.5rem] hover:bg-white hover:border-blue-100 transition-all duration-500 group/item shadow-sm hover:shadow-xl hover:shadow-blue-900/5 relative overflow-hidden"
                    >
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-500">
                                 {d.file_type === 'pdf' ? <FaFilePdf size={16}/> : d.file_type === 'image' ? <FaFileImage size={16}/> : <FaFileAlt size={16}/>}
                            </div>
                             <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">{d.file_type}</span>
                        </div>

                        <p className="font-black text-slate-900 text-lg mb-6 line-clamp-2 leading-tight italic uppercase tracking-tighter group-hover/item:text-blue-600 transition-colors">
                            {d.title}
                        </p>

                        <button
                          className="w-full py-4 bg-white border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                          onClick={() => deleteItem(d._id)}
                        >
                          <FaTrashAlt size={12}/> Expunge
                        </button>
                    </div>
                    ))}
                </div>
              </div>
            </div>
        </div>
      ))}
    </div>
  );
}
