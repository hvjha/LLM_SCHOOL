import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaBook, FaSearch, FaShieldAlt, FaBoxOpen, FaLayerGroup, FaInfoCircle, FaCheckCircle } from "react-icons/fa";

export default function TrainerLibrary() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [myReservations, setMyReservations] = useState([]);

  const categories = [
    "All", "Fiction", "Non-Fiction", "Science", "Technology", "History",
    "Mathematics", "Programming", "Business", "Arts", "Other"
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: bookData } = await api.get("/api/library/book/books");
      setBooks(bookData.books || []);
      
      const { data: resData } = await api.get("/api/library/book/reservation/trainer");
      setMyReservations(resData.reservations || []);
    } catch (err) {
      toast.error("Systems Failure: Data synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReserve = async (bookId) => {
    try {
      const { data } = await api.post("/api/library/book/reservation", { bookId });
      toast.success(data.message || "Protocol: Asset reservation successful");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol: Reservation failed");
    }
  };

  const activeResCount = myReservations.filter(r => r.status === 'pending').length;
  const reservedBookIds = myReservations.filter(r => r.status === 'pending').map(r => r.book?._id);

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in min-h-[70vh]">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-12 relative z-10">
        <div>
           <div className="flex items-center gap-6 mb-4">
              <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Tactical Library</h2>
              <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase shadow-xl shadow-blue-900/20 flex items-center gap-3 tracking-widest border border-blue-500/20 italic">
                <FaShieldAlt size={12}/> RESERVES: {activeResCount} / 3
              </div>
           </div>
           <p className="text-slate-500 font-medium uppercase tracking-[0.4em] text-[10px] italic">Accessing centralized intelligence assets and tactical manuals.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
          {/* Search */}
          <div className="relative group/search">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover/search:text-blue-600 transition-colors" size={14}/>
            <input
              type="text"
              placeholder="SEARCH ARCHIVES..."
              className="pl-14 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] w-full md:w-80 text-slate-900 font-black text-xs focus:ring-8 focus:ring-blue-100 focus:border-blue-600 focus:outline-none placeholder:text-slate-300 uppercase tracking-widest italic transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative group/select">
            <select
              className="pl-8 pr-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] w-full md:w-64 text-slate-900 font-black text-xs focus:ring-8 focus:ring-blue-100 focus:border-blue-600 focus:outline-none uppercase tracking-widest italic appearance-none transition-all shadow-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c} className="bg-white text-slate-900">{c.toUpperCase()}</option>)}
            </select>
            <FaLayerGroup className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-hover/select:text-blue-600 transition-colors" size={14}/>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse relative z-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Armory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 relative z-10">
          {filteredBooks.map((book) => {
            const isAlreadyReserved = reservedBookIds.includes(book._id);

            return (
              <div key={book._id} className="bg-white rounded-[3rem] overflow-hidden flex flex-col hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:scale-[1.02] transition-all duration-700 border border-slate-100 group/item relative">
                <div className="h-72 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/item:scale-110" />
                  ) : (
                    <FaBookOpen size={60} className="text-slate-200" />
                  )}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-slate-900 text-[9px] px-4 py-2 rounded-xl font-black uppercase shadow-2xl tracking-widest border border-white italic">
                    {book.category}
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col relative">
                  <h3 className="font-black text-xl mb-3 line-clamp-2 text-slate-900 uppercase italic leading-tight tracking-tighter group-hover/item:text-blue-600 transition-colors">{book.title}</h3>
                  <p className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] italic">{book.author}</p>
                  
                  <div className="text-[9px] font-black text-slate-400 space-y-3 mb-8 border-t border-slate-50 pt-6">
                    <p className="flex justify-between items-center uppercase tracking-widest italic">
                       <span>ISBN PROTOCOL</span> 
                       <span className="text-slate-900">{book.isbn}</span>
                    </p>
                    <p className="flex justify-between items-center uppercase tracking-widest italic">
                       <span>STOCK STATUS</span> 
                       <span className={`px-3 py-1 rounded-lg ${book.availableCopies > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {book.availableCopies} UNITS
                       </span>
                    </p>
                  </div>

                  <div className="mt-auto">
                    {isAlreadyReserved ? (
                      <div className="text-[10px] font-black w-full py-5 text-center bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 uppercase tracking-widest italic flex items-center justify-center gap-3">
                        <FaCheckCircle size={12}/> Reservation Pending
                      </div>
                    ) : (
                      <button
                        onClick={() => handleReserve(book._id)}
                        disabled={activeResCount >= 3 || book.availableCopies <= 0}
                        className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic transition-all duration-500 shadow-xl flex items-center justify-center gap-4 group/btn ${
                          activeResCount >= 3 || book.availableCopies <= 0
                          ? 'bg-slate-50 text-slate-300 cursor-not-allowed' 
                          : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-900/20'
                        }`}
                      >
                        <FaShieldAlt className="group-hover/btn:rotate-12 transition-transform" size={14}/>
                        {book.availableCopies <= 0 ? "DEPLETED" : "Reserve Asset"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Indicator */}
                {book.availableCopies <= 0 && !isAlreadyReserved && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 p-8 text-center">
                     <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-2xl scale-in-center">
                        <FaInfoCircle size={24} className="text-red-500 mx-auto mb-4"/>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] italic">Tactical Shortage</p>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">ASSET CURRENTLY DEPLOYED</p>
                     </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredBooks.length === 0 && (
            <div className="col-span-full py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center">
              <FaBoxOpen size={48} className="text-slate-300 mb-8"/>
              <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Armory Clear</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">NO MATCHING ASSETS FOUND</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
