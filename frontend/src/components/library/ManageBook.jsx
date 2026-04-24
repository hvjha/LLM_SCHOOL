import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaBook, FaTrashAlt, FaEdit, FaLayerGroup, FaShieldAlt, FaBarcode, FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/library/book/books");
      setBooks(data.books);
    } catch (err) {
      toast.error("Systems Failure: Asset retrieval aborted");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const deleteBook = async (bookId) => {
    if (!window.confirm("Confirm Protocol: Permanent expungement of intelligence record?")) return;

    try {
      await api.delete(`/api/library/book/delete/${bookId}`);
      toast.success("Intelligence record expunged");
      loadBooks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Expungement failed");
    }
  };

  const updateBook = async () => {
    try {
      await api.post(`/api/library/book/update/${editBook._id}`, editBook);
      toast.success("Registry entry updated");
      setEditBook(null);
      loadBooks();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registry update failed");
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-8 animate-pulse">
       <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Accessing Central Registry...</p>
    </div>
  );

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-10 mb-16 relative z-10">
        <div>
           <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Registry Control</span>
           </div>
           <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Archive Management</h2>
        </div>

        <div className="w-full md:w-96 relative group">
           <input
              type="text"
              placeholder="SEARCH REGISTRY..."
              className="w-full px-12 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 font-black text-xs focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-slate-300 italic tracking-tighter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
           <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={14}/>
        </div>
      </div>

      <div className="relative z-10 h-[600px] overflow-y-auto pr-4 no-scrollbar custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead className="sticky top-0 bg-white z-20">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Intelligence Asset</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Creator</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Registry ID</th>
              <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Stock</th>
              <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Status</th>
              <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 italic">Protocols</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((b) => (
              <tr key={b._id} className="group/row">
                <td className="px-8 py-6 bg-slate-50 rounded-l-[2rem] group-hover/row:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-6">
                    {b.coverImage ? (
                      <div className="w-12 h-16 rounded-xl border-2 border-white shadow-xl group-hover/row:scale-110 transition-transform duration-500 bg-cover bg-center" style={{ backgroundImage: `url(${b.coverImage})` }}></div>
                    ) : (
                      <div className="w-12 h-16 bg-white rounded-xl border-2 border-slate-100 flex items-center justify-center text-slate-200">
                        <FaBook size={20} />
                      </div>
                    )}
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase italic tracking-tighter leading-none group-hover/row:text-blue-600 transition-colors">{b.title}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">SECURED RECORD</p>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors">
                   <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight">{b.author}</p>
                </td>

                <td className="px-8 py-6 bg-slate-50 group-hover/row:bg-slate-100 transition-colors">
                   <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">{b.isbn}</p>
                </td>

                <td className="px-8 py-6 bg-slate-50 text-center group-hover/row:bg-slate-100 transition-colors">
                   <span className="text-sm font-black text-slate-900 italic tracking-tighter">{b.totalCopies}</span>
                </td>

                <td className="px-8 py-6 bg-slate-50 text-center group-hover/row:bg-slate-100 transition-colors">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${b.availableCopies > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${b.availableCopies > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></div>
                      {b.availableCopies} ACTIVE
                  </div>
                </td>

                <td className="px-8 py-6 bg-slate-50 rounded-r-[2rem] group-hover/row:bg-slate-100 transition-colors text-center">
                  <div className="flex gap-3 justify-center">
                    <button
                      className="p-4 bg-white text-slate-400 rounded-xl hover:text-blue-600 hover:shadow-xl hover:shadow-blue-900/10 transition-all border border-slate-100 active:scale-90"
                      onClick={() => setEditBook({ ...b })}
                      title="Edit Entry"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      className="p-4 bg-white text-slate-400 rounded-xl hover:text-red-600 hover:shadow-xl hover:shadow-red-900/10 transition-all border border-slate-100 active:scale-90"
                      onClick={() => deleteBook(b._id)}
                      title="Purge Record"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBooks.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-40 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 opacity-50">
                   <FaBoxOpen size={40} className="mx-auto mb-6 text-slate-200" />
                   <p className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] italic">No matching intelligence records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editBook && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-fade-in">
          <div className="bg-white p-12 md:p-16 rounded-[4rem] w-full max-w-2xl border border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative overflow-hidden">
            
            <button 
              onClick={() => setEditBook(null)}
              className="absolute top-10 right-10 p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-600 transition-all hover:rotate-90"
            >
              <IoClose size={24} />
            </button>

            <div className="mb-12">
               <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                    <FaEdit size={18}/>
                  </div>
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Protocol Override</span>
               </div>
               <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Edit Entry Protocols</h3>
            </div>

            <div className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Intelligence Designation</label>
                    <div className="relative">
                      <input
                        className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 text-lg font-black italic tracking-tighter focus:border-blue-600 focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all pl-16"
                        placeholder="ASSET TITLE"
                        value={editBook.title}
                        onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
                      />
                      <FaBook className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Primary Creator</label>
                    <div className="relative">
                      <input
                        className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 text-lg font-black italic tracking-tighter focus:border-blue-600 focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all pl-16"
                        placeholder="AUTHOR IDENTITY"
                        value={editBook.author}
                        onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
                      />
                      <FaShieldAlt className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic">Total Grid Capacity</label>
                    <div className="relative">
                      <input
                        className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-900 text-lg font-black italic tracking-tighter focus:border-blue-600 focus:outline-none focus:ring-8 focus:ring-blue-100 transition-all pl-16"
                        placeholder="UNIT COUNT"
                        type="number"
                        min="0"
                        value={editBook.totalCopies}
                        onChange={(e) => setEditBook({ ...editBook, totalCopies: Number(e.target.value) })}
                      />
                      <FaLayerGroup className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={16}/>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-16">
              <button
                className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-95"
                onClick={() => setEditBook(null)}
              >
                Abort Protocol
              </button>
              <button
                className="flex-1 py-6 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-blue-600 shadow-2xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                onClick={updateBook}
              >
                <FaCheckCircle className="group-hover:rotate-12 transition-transform" />
                Commit Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
