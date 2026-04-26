import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { FaUserShield, FaHistory, FaCheckCircle, FaExclamationCircle, FaCreditCard, FaMoneyBillWave, FaShieldAlt, FaLayerGroup, FaArrowRight, FaSync } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

export default function ReturnBooksAdmin() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [issues, setIssues] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentMode, setPaymentMode] = useState("cash");

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data } = await api.get("/api/admin/user-details");
        setStudents(data?.users?.students || []);
      } catch {
        toast.error("Systems Failure: Personnel retrieval failed");
      }
    };
    loadStudents();
  }, []);

  const fetchIssuedBooks = async (studentId) => {
    if (!studentId) return;
    setLoading(true);
    setIssues([]);
    setSelectedIssues([]);
    try {
      const { data } = await api.get(`/api/library/book/issued/${studentId}`);
      setIssues(
        (data.issues || []).map((issue) => ({
          ...issue,
          dueDateFormatted: new Date(issue.dueDate).toLocaleDateString(),
        }))
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "No deployed assets found");
    } finally {
      setLoading(false);
    }
  };

  const toggleIssue = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const selectedFine = useMemo(() => {
    return issues
      .filter((i) => selectedIssues.includes(i._id))
      .reduce((sum, i) => sum + (i.fine || 0), 0);
  }, [issues, selectedIssues]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const returnBooks = async () => {
    if (selectedIssues.length === 0) return toast.error("Selection required: Choose at least one asset");

    if (!window.confirm(selectedFine > 0 ? `Process Penalty Recovery (₹${selectedFine}) & Return?` : `Process Return of ${selectedIssues.length} asset(s)?`)) return;

    try {
      setIsProcessing(true);
      if (selectedFine > 0) {
        if (paymentMode === "cash") {
          await api.post("/api/fine/pay", { issueIds: selectedIssues, paymentMode, transactionId: null });
        } else if (paymentMode === "online") {
          const res = await loadRazorpayScript();
          if (!res) return toast.error("Razorpay SDK Failure: Digital transfer failed");
          
          const { data: orderData } = await api.post("/api/fine/create-order", { amount: selectedFine, issueIds: selectedIssues });
          if (!orderData.success) return toast.error("Order Failure: Digital sequence failed");

          if (orderData.isMock) {
            toast.info("Mock Sequence: Simulating digital verification...");
            setTimeout(async () => {
              const { data: verifyData } = await api.post("/api/fine/verify-payment", {
                razorpay_order_id: orderData.order.id,
                razorpay_payment_id: "mock_pay_" + Date.now(),
                razorpay_signature: "mock_sig",
                issueIds: selectedIssues,
                amount: selectedFine,
              });
              if (verifyData.success) proceedWithReturn();
              else toast.error("Verification Failure: Mock rejected");
            }, 1000);
            return;
          }

          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID", 
            amount: orderData.order.amount,
            currency: orderData.order.currency,
            name: "Registry Fine Recovery",
            description: "Asset recovery penalty protocol",
            order_id: orderData.order.id,
            handler: async function (response) {
              const { data: verifyData } = await api.post("/api/fine/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                issueIds: selectedIssues,
                amount: selectedFine,
              });
              if (verifyData.success) await proceedWithReturn();
              else toast.error("Verification Failure: Signature mismatch");
            },
            prefill: { name: students.find(s => s._id === selectedStudent)?.name || "" },
            theme: { color: "#2563eb" },
          };
          new window.Razorpay(options).open();
          return; 
        }
      }
      await proceedWithReturn();
    } catch (err) {
      toast.error(err.response?.data?.message || "Protocol Failure: Asset recovery failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedWithReturn = async () => {
    try {
      for (const issueId of selectedIssues) {
        await api.put(`/api/library/book/return/${issueId}`);
      }
      toast.success(selectedFine > 0 ? "Penalty Recovered // Assets Synchronized" : "Assets Synchronized with Registry");
      setSelectedIssues([]);
      fetchIssuedBooks(selectedStudent);
    } catch (err) {
      toast.error("Internal Error: Registry synchronization failed post-recovery");
    }
  };

  return (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-[0_30px_100px_rgba(0,0,0,0.04)] relative overflow-hidden group/card animate-fade-in max-w-6xl mx-auto">
      
      {/* Design Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-[120px] -mt-48 -mr-48 pointer-events-none transition-colors duration-1000 group-hover/card:bg-blue-100/50"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Asset Recovery & Penalty Resolution</h2>
        <p className="text-slate-500 font-medium mt-4 uppercase tracking-[0.4em] text-[10px] italic">Process tactical returns and manage intelligence recovery protocols.</p>
      </div>

      <div className="mb-16 relative z-10">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-10 italic block mb-4">Personnel Authorization</label>
        <div className="relative">
          <select
            className="w-full px-12 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-900 font-black text-lg focus:outline-none focus:ring-8 focus:ring-blue-100 focus:border-blue-600 transition-all appearance-none italic tracking-tighter shadow-sm pl-16"
            value={selectedStudent}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedStudent(id);
              fetchIssuedBooks(id);
            }}
          >
            <option value="" disabled>-- ACCESSING PERSONNEL DATABASE --</option>
            {students.map((s) => (
              <option key={s._id} value={s._id} className="bg-white text-slate-900">
                ID: {s.studentId} // {s.name.toUpperCase()}
              </option>
            ))}
          </select>
          <FaUserShield className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-8 animate-pulse">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Accessing Personnel Manifest...</p>
        </div>
      ) : issues.length > 0 ? (
        <div className="relative z-10 bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner space-y-6">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-200 pb-6">
             <FaLayerGroup size={18} className="text-blue-600"/>
             <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] italic">Deployed Assets</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[500px] pr-4 no-scrollbar">
            {issues.map((i) => (
              <label
                key={i._id}
                className={`flex items-center gap-6 p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all duration-500 relative overflow-hidden group/item ${
                  selectedIssues.includes(i._id)
                    ? "bg-white border-blue-600 shadow-2xl shadow-blue-900/10 scale-[1.02]"
                    : "bg-white border-white hover:border-blue-400 hover:shadow-xl shadow-sm"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedIssues.includes(i._id)}
                  onChange={() => toggleIssue(i._id)}
                  className="hidden"
                />
                
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-500 ${selectedIssues.includes(i._id) ? "border-blue-600 bg-blue-600 text-white shadow-lg" : "border-slate-100 bg-slate-50"}`}>
                    {selectedIssues.includes(i._id) && <FaCheckCircle size={14}/>}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-black uppercase italic leading-tight truncate tracking-tighter text-lg ${selectedIssues.includes(i._id) ? "text-slate-900" : "text-slate-600"}`}>{i.book.title}</p>
                  <div className="flex flex-wrap gap-6 mt-3 text-[10px] font-black text-slate-400 italic">
                     <p className="tracking-widest">ID: <span className="text-slate-900">{i.book.isbn}</span></p>
                     <p className="tracking-widest">DUE: <span className="text-slate-900">{i.dueDateFormatted}</span></p>
                  </div>
                </div>
                
                {i.fine > 0 && (
                   <div className="text-right pl-6 border-l border-slate-100">
                      <p className="text-[9px] uppercase font-black text-red-500 tracking-[0.2em] italic mb-1">Penalty</p>
                      <p className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{i.fine}</p>
                   </div>
                )}
              </label>
            ))}
          </div>
        </div>
      ) : selectedStudent && (
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-100 opacity-50 flex flex-col items-center">
          <FaCheckCircle size={48} className="text-green-500 mb-8 animate-bounce"/>
          <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">No Active Deployments</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-4 italic">PERSONNEL CLEARANCE VERIFIED</p>
        </div>
      )}

      {selectedFine > 0 && (
        <div className="mt-12 p-10 rounded-[3rem] bg-blue-50/50 border-2 border-blue-100 relative z-10 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-8">
             <FaCreditCard size={18} className="text-blue-600"/>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] italic">Penalty Recovery Protocol</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <label className="flex-1 flex items-center gap-6 p-8 bg-white rounded-[2rem] cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMode === "cash" ? "bg-slate-900 text-white shadow-2xl" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"}`}>
                   <FaMoneyBillWave size={20}/>
              </div>
              <div className="flex-1">
                 <p className={`text-sm font-black uppercase italic tracking-tighter ${paymentMode === "cash" ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>Cash Transaction</p>
                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">Manual Verification Required</p>
              </div>
              <input type="radio" name="paymentMode" value="cash" checked={paymentMode === "cash"} onChange={() => setPaymentMode("cash")} className="hidden"/>
            </label>

            <label className="flex-1 flex items-center gap-6 p-8 bg-white rounded-[2rem] cursor-pointer border-2 border-transparent hover:border-blue-300 transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${paymentMode === "online" ? "bg-slate-900 text-white shadow-2xl" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"}`}>
                   <FaSync size={20}/>
              </div>
              <div className="flex-1">
                 <p className={`text-sm font-black uppercase italic tracking-tighter ${paymentMode === "online" ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}>Digital Transfer</p>
                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 italic">Automatic Registry Sync</p>
              </div>
              <input type="radio" name="paymentMode" value="online" checked={paymentMode === "online"} onChange={() => setPaymentMode("online")} className="hidden"/>
            </label>
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div className="flex justify-end mt-16 relative z-10">
          <button
            disabled={selectedIssues.length === 0 || isProcessing}
            onClick={returnBooks}
            className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] text-[11px] italic transition-all duration-700 shadow-2xl flex items-center gap-8 group ${
              selectedIssues.length > 0 && !isProcessing
                ? "bg-slate-900 text-white hover:bg-blue-600 hover:scale-[1.02] shadow-slate-900/20 active:scale-95"
                : "bg-slate-50 text-slate-200 cursor-not-allowed shadow-none"
            }`}
          >
            {isProcessing ? (
               <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
               <FaShieldAlt className="group-hover:rotate-12 transition-transform duration-500" size={18}/>
            )}
            {isProcessing ? "PROCESSING RECOVERY..." : selectedFine > 0
              ? `RECOVER ₹${selectedFine} & PROCESS RETURN`
              : `PROCESS ASSET RETURN (${selectedIssues.length})`}
          </button>
        </div>
      )}
    </div>
  );
}
