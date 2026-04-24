import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaUserShield, FaCalendarAlt, FaLayerGroup, FaCheckCircle, FaExclamationTriangle, FaBoxOpen, FaBookOpen, FaShieldAlt } from "react-icons/fa";

export default function IssueBooks() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
    loadBooks();
    loadReservations();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/api/admin/user-details");
      const students = data?.users?.students || [];
      const trainers = data?.users?.trainers || [];
      setUsers([...students, ...trainers]);
    } catch {
      toast.error("Systems Failure: User retrieval aborted");
    }
  };

  const loadReservations = async () => {
    try {
      const { data } = await api.get("/api/library/book/reservation/all");
      setReservations(data.reservations || []);
    } catch (err) {
      console.error(err);
    }
  }

  const loadBooks = async () => {
    try {
      const { data } = await api.get("/api/library/book/books");
      setBooks(data.books || []);
    } catch {
      toast.error("Systems Failure: Asset retrieval aborted");
    }
  };

  const toggleBook = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleIssueBooks = async () => {
    if (!selectedUser) return toast.error("Personnel ID required: Select a student");
    if (!dueDate) return toast.error("Protocol violation: Select due date");
    if (selectedBooks.length === 0) return toast.error("Selection required: Choose at least one asset");

    try {
      setIsSubmitting(true);
      const { data } = await api.post("/api/library/book/issue", {
        student: selectedUser,
        books: selectedBooks,
        dueDate,
      });

      if (data.success) {
        toast.success(`Protocol Success: ${data.issuedCount} asset(s) deployed`);
        setSelectedBooks([]);
        setDueDate("");
        setSelectedUser("");
        loadBooks();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Deployment failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Deploy Tactical Resources</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Synchronize personnel authorization with asset circulation protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 relative z-10">
        <div className="space-y-4">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Personnel Authorization</label>
           <div className="relative">
              <select
                className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all appearance-none italic tracking-tighter shadow-sm pl-16"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="" disabled>-- SELECT PERSONNEL --</option>
                {users.filter(u => u.role === 'student').map((s) => (
                  <option key={s._id} value={s._id} className="bg-white text-slate-900">
                    ID: {s.studentId} // {s.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <FaUserShield className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
           </div>
        </div>

        <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Expected Return Cycle</label>
            <div className="relative">
              <input
                type="date"
                className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all italic tracking-tighter shadow-sm pl-16"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <FaCalendarAlt className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
            </div>
        </div>
      </div>

      <div className="relative z-10 bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-4">
             <FaLayerGroup size={18} className="text-blue-600"/>
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Resource Manifest</h3>
          </div>
          <span className="bg-white border border-slate-200 text-slate-900 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm italic">
            {selectedBooks.length} ASSETS LOCKED
          </span>
        </div>

        {books.length === 0 && (
          <div className="text-center py-24 opacity-30 flex flex-col items-center">
            <FaBoxOpen size={48} className="text-slate-300 mb-6"/>
            <p className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Armory Empty</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-4">NO INTELLIGENCE ASSETS DETECTED</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-4 no-scrollbar">
          {books.map((b) => {
            const isReserved = reservations.some(r => r.book?._id === b._id && r.status === 'pending');
            const resCount = reservations.filter(r => r.book?._id === b._id && r.status === 'pending').length;
            const isSelected = selectedBooks.includes(b._id);

            return (
              <label
                key={b._id}
                className={`group flex items-center gap-6 p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden ${
                  isSelected
                    ? "bg-white border-blue-600 shadow-2xl shadow-blue-900/10 scale-[1.02]"
                    : b.availableCopies === 0 
                    ? "bg-slate-100 border-slate-100 opacity-40 cursor-not-allowed"
                    : "bg-white border-white hover:border-blue-400 hover:shadow-xl shadow-sm"
                }`}
              >
                <input
                  type="checkbox"
                  disabled={b.availableCopies === 0}
                  checked={isSelected}
                  onChange={() => toggleBook(b._id)}
                  className="hidden"
                />
                
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${isSelected ? "border-blue-600 bg-blue-600 text-white shadow-lg" : "border-slate-100 bg-slate-50"}`}>
                    {isSelected && <FaCheckCircle size={14}/>}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm uppercase italic leading-tight truncate tracking-tighter ${isSelected ? "text-slate-900" : "text-slate-600"}`}>{b.title}</p>
                  <div className={`text-[9px] font-black mt-3 flex flex-wrap gap-3 items-center ${isSelected ? 'text-blue-600' : 'text-slate-400'}`}>
                    <span className="uppercase tracking-[0.2em] italic">STOCK: {b.availableCopies}</span>
                    {isReserved && (
                      <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg uppercase tracking-tighter border border-amber-100 flex items-center gap-1">
                        <FaExclamationTriangle size={8}/> RESERVED ({resCount})
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Visual Accent */}
                <div className={`absolute -right-4 -bottom-4 opacity-[0.03] transition-transform duration-700 group-hover:scale-150 ${isSelected ? "text-blue-600" : "text-slate-900"}`}>
                   <FaBookOpen size={80}/>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end mt-12 relative z-10">
        <button
          onClick={handleIssueBooks}
          disabled={selectedBooks.length === 0 || isSubmitting}
          className={`px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] italic transition-all duration-700 shadow-2xl flex items-center gap-6 group ${
            selectedBooks.length > 0 && !isSubmitting
            ? "bg-slate-900 text-white hover:bg-blue-600 hover:scale-[1.02] shadow-slate-900/20 active:scale-95" 
            : "bg-slate-50 text-slate-300 cursor-not-allowed shadow-none"
          }`}
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
             <FaShieldAlt className="group-hover:rotate-12 transition-transform duration-500" size={16}/>
          )}
          {isSubmitting ? "SYNCING..." : selectedBooks.length > 1 ? "AUTHORIZE BULK DEPLOYMENT" : "AUTHORIZE DEPLOYMENT"}
        </button>
      </div>
    </div>
  );
}
