import React, { useState, lazy, Suspense } from "react";
import { FaBookOpen, FaPlusSquare, FaSignOutAlt, FaSignInAlt, FaHistory, FaCalendarCheck } from "react-icons/fa";
import LoadingScreen from "../LoadingScreen";

// Lazy Load Sub-modules for Performance optimization
const AddBook = lazy(() => import("./AddBook"));
const ManageBooks = lazy(() => import("./ManageBook"));
const IssueBooks = lazy(() => import("./IssueBooks"));
const ReturnBooks = lazy(() => import("./ReturnBook"));
const LibraryHistory = lazy(() => import("./LibraryHistory"));
const BookReservations = lazy(() => import("./BookReservation"));

export default function AdminLibrary() {
  const [active, setActive] = useState("manage");

  const tabs = [
    { id: "manage", label: "Manage Assets", icon: <FaBookOpen /> },
    { id: "add", label: "Provision Asset", icon: <FaPlusSquare /> },
    { id: "issue", label: "Deploy Resources", icon: <FaSignOutAlt /> },
    { id: "return", label: "Recover Resources", icon: <FaSignInAlt /> },
    { id: "history", label: "Operation Logs", icon: <FaHistory /> },
    { id: "reservations", label: "Strategic Reserves", icon: <FaCalendarCheck /> },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-slate-100 pb-12 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
           <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">Command Center: Library</h2>
           <p className="text-slate-500 font-medium uppercase tracking-[0.4em] text-[10px] italic">Tactical oversight of intelligence asset circulation and inventory protocols.</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
           <div className="px-6 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              Live Protocol Status: SECURE
           </div>
        </div>
      </div>

      <div className="flex gap-4 mb-16 flex-wrap justify-center bg-slate-50 p-6 rounded-[3rem] border border-slate-100 shadow-inner relative z-10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 flex items-center gap-4 italic group relative overflow-hidden ${
              active === t.id
                ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/30 scale-105"
                : "bg-white text-slate-400 hover:bg-white hover:text-slate-900 border border-transparent shadow-sm hover:shadow-lg hover:scale-105"
            }`}
          >
            <span className={`transition-transform duration-500 ${active === t.id ? "text-blue-500 scale-110" : "group-hover:scale-110"}`}>
               {t.icon}
            </span>
            {t.label}
            {active === t.id && (
              <div className="absolute right-3 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="relative z-10 min-h-[500px]">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Sub-Protocol...</p>
          </div>
        }>
          {active === "manage" && <ManageBooks/>}
          {active === "add" && <AddBook/> }
          {active === "issue" && <IssueBooks/>} 
          {active === "return" && <ReturnBooks/>}
          {active === "history" && <LibraryHistory/>}
          {active === "reservations" && <BookReservations/>}
        </Suspense>
      </div>
    </div>
  );
}
