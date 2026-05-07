import { useState } from "react";
import { gql } from "@apollo/client";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
import {
  Search,
  Printer,
  CreditCard,
  Banknote,
  Loader2,
  CheckCircle,
  User,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const GET_APPOINTMENT_BILLING = gql`
  query GetAppointmentForBilling($searchValue: String!) {
    getAppointmentForBilling(searchValue: $searchValue) {
      id
      patientName
      nic
      doctorName
      category
      consultationFee
      hospitalFee
      total
      status
      paymentStatus
    }
  }
`;


const SETTLE_PAYMENT = gql`
  mutation SettlePayment($id: String!) {
    settlePayment(id: $id)
  }
`;

const BillingPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  // Query Hook
  const [fetchRecord, { data, loading }] = useLazyQuery(
    GET_APPOINTMENT_BILLING,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (data.getAppointmentForBilling.paymentStatus === "PAID") {
          toast.success("This bill is already settled.");
        }
      },
      onError: (err) => toast.error("No active records found for this input."),
    },
  );

  // Mutation Hook
  const [settle, { loading: settling }] = useMutation(SETTLE_PAYMENT, {
    onCompleted: () => {
      toast.success("Payment Processed Successfully! ✅");
      fetchRecord({ variables: { searchValue } }); 
    },
  });

  const foundRecord = data?.getAppointmentForBilling;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim())
      return toast.error("Enter NIC, Phone or Appointmet ID");
    fetchRecord({ variables: { searchValue: searchValue.trim() } });
  };

  const handleProcessPayment = async () => {
    if (foundRecord.paymentStatus === "PAID") {
      return toast.error("This invoice is already paid.");
    }
    await settle({ variables: { id: foundRecord.id } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
              Financial Terminal
            </h2>
            <p className="text-slate-500 font-medium text-[10px] mt-1 uppercase tracking-[0.3em]">
              Hospital Revenue Management // Counter 04
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-emerald-500 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Secure Gateway
            </span>
          </div>
        </div>

        {/* --- Advanced Search Bar --- */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-3 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 mb-12 flex gap-3 transition-all focus-within:ring-4 focus-within:ring-blue-500/5"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder="SEARCH BY NIC, PHONE OR APPOINTMENT ID..."
              className="w-full p-5 pl-16 rounded-2xl outline-none text-sm font-black text-slate-700 uppercase tracking-widest placeholder:text-slate-200"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white px-14 py-5 rounded-[1.8rem] font-black hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "RETRIEVE RECORD"
            )}
          </button>
        </form>

        {foundRecord ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* --- Left: Record Details --- */}
            <div className="lg:col-span-7 space-y-6">
              <div
                className={`bg-white p-12 rounded-[4rem] border ${foundRecord.paymentStatus === "PAID" ? "border-emerald-200 shadow-emerald-500/5" : "border-slate-100"} shadow-sm relative overflow-hidden`}
              >
                {/* Paid Watermark */}
                {foundRecord.paymentStatus === "PAID" && (
                  <div className="absolute top-10 right-[-40px] rotate-45 bg-emerald-500 text-white px-12 py-1 font-black text-[10px] uppercase tracking-[0.5em] shadow-lg">
                    PAID
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <User size={14} className="text-blue-500" />
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                          Patient Profile
                        </label>
                      </div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                        {foundRecord.patientName}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-2 bg-slate-50 inline-block px-3 py-1 rounded-lg">
                        NIC: {foundRecord.nic}
                      </p>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Flow Status
                      </label>
                      <p
                        className={`text-[10px] font-black px-4 py-2 rounded-xl mt-2 uppercase tracking-tighter ${foundRecord.paymentStatus === "PAID" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                      >
                        ●{" "}
                        {foundRecord.paymentStatus === "PAID"
                          ? "SETTLED"
                          : "PAYMENT PENDING"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-10 border-t border-slate-50">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Specialist Assigned
                      </label>
                      <p className="font-black text-slate-700 text-lg">
                        {foundRecord.doctorName}
                      </p>
                      <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">
                        {foundRecord.category}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                        Internal Service Node
                      </label>
                      <p className="font-bold text-slate-700">
                        Main OPD Terminal
                      </p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1 italic tracking-widest">
                        Apt ID: {foundRecord.id.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Channel Selector */}
              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 flex items-center justify-between shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">
                  Transaction Channel
                </span>
                <div className="flex gap-4">
                  <button
                    disabled={foundRecord.paymentStatus === "PAID"}
                    onClick={() => setPaymentMethod("Cash")}
                    className={`flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-[10px] transition-all ${paymentMethod === "Cash" ? "bg-slate-900 text-white shadow-2xl shadow-slate-400/30" : "bg-slate-50 text-slate-400"} disabled:opacity-20`}
                  >
                    <Banknote size={18} /> CASH
                  </button>
                  <button
                    disabled={foundRecord.paymentStatus === "PAID"}
                    onClick={() => setPaymentMethod("Card")}
                    className={`flex items-center gap-3 px-10 py-5 rounded-3xl font-black text-[10px] transition-all ${paymentMethod === "Card" ? "bg-blue-600 text-white shadow-2xl shadow-blue-400/30" : "bg-slate-50 text-slate-400"} disabled:opacity-20`}
                  >
                    <CreditCard size={18} /> DEBIT CARD
                  </button>
                </div>
              </div>
            </div>

            {/* --- Right: Summary & Action --- */}
            <div className="lg:col-span-5">
              <div className="bg-[#0f172a] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[550px]">
                <div className="relative z-10">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-16 italic">
                    Financial Summary
                  </h4>

                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Consultation Charge
                      </p>
                      <p className="font-black text-lg tabular-nums font-mono">
                        Rs. {foundRecord.consultationFee.toLocaleString()}.00
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                        Hospital Service Fee
                      </p>
                      <p className="font-black text-lg tabular-nums font-mono">
                        Rs. {foundRecord.hospitalFee.toLocaleString()}.00
                      </p>
                    </div>

                    <div className="pt-12 mt-12 border-t border-white/10">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">
                        Final Payable Amount
                      </p>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-slate-600 font-mono">
                          LKR
                        </span>
                        <span className="text-7xl font-black tracking-tighter tabular-nums text-white">
                          {foundRecord.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <button
                    onClick={handleProcessPayment}
                    disabled={settling || foundRecord.paymentStatus === "PAID"}
                    className={`w-full py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 ${
                      foundRecord.paymentStatus === "PAID"
                        ? "bg-emerald-500/20 text-emerald-500 cursor-default border border-emerald-500/20"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                    }`}
                  >
                    {settling ? (
                      <Loader2 className="animate-spin" />
                    ) : foundRecord.paymentStatus === "PAID" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <CreditCard size={20} />
                    )}
                    {foundRecord.paymentStatus === "PAID"
                      ? "TRANSACTION SETTLED"
                      : "PROCESS PAYMENT"}
                  </button>

                  {foundRecord.paymentStatus === "PAID" && (
                    <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-5 rounded-[1.8rem] text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <Printer size={16} /> RE-PRINT INVOICE
                    </button>
                  )}
                </div>

                {/* Tech Deco Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center bg-white rounded-[5rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 relative">
              <Search className="text-slate-200" size={40} />
              <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full animate-ping"></div>
            </div>
            <h4 className="text-slate-400 font-black text-xs uppercase tracking-[0.4em]">
              Ready for Retrieval
            </h4>
            <p className="text-slate-300 text-[10px] mt-4 font-black uppercase tracking-widest max-w-[250px] text-center leading-relaxed">
              Please Input Patient NIC, Mobile Number or System UUID to
              Initialize Billing
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
