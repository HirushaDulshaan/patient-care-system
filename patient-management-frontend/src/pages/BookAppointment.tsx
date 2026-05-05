import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  ChevronLeft,
  Search,
  Loader2,
  Users,
  ShieldCheck,
} from "lucide-react";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

// --- Types & Interfaces ---
interface StripeSessionResponse {
  getStripeSessionUrl: string;
}

interface StripeSessionVariables {
  doctorId: string;
  doctorName: string;
  patientName: string;
  nic: string;
  phone: string;
  scheduledAt: string;
}

// --- GraphQL Queries ---

const GET_CATEGORIES = gql`
  query GetCategories {
    getAllDoctorCategories {
      id
      name
    }
  }
`;

const GET_DOCTORS_FOR_BOOKING = gql`
  query GetDoctorsForBooking {
    getAllDoctors {
      id
      firstName
      lastName
      category {
        name
      }
      schedules {
        id
        workingDate
        startTime
        endTime
        status
        maxPatients
        bookedCount     # 👈 Real count එක මෙතනින් එනවා
        remainingSeats  # 👈 Backend එකෙන් Calculate කර එවනු ලබයි
      }
    }
  }
`;

const GET_STRIPE_SESSION_URL = gql`
  mutation GetStripeSessionUrl(
    $doctorId: String!
    $doctorName: String!
    $patientName: String!
    $nic: String!
    $phone: String!
    $scheduledAt: String!
  ) {
    getStripeSessionUrl(
      doctorId: $doctorId
      doctorName: $doctorName
      patientName: $patientName
      nic: $nic
      phone: $phone
      scheduledAt: $scheduledAt
    )
  }
`;

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
    nic: "",
    phone: "",
  });

  const [getPaymentUrl, { loading: paymentLoading }] = useMutation<
    StripeSessionResponse,
    StripeSessionVariables
  >(GET_STRIPE_SESSION_URL);

  const { data: catData } = useQuery<any>(GET_CATEGORIES);
  
  // ✅ fetchPolicy: "network-only" නිසා හැමවිටම DB එකේ අලුත්ම count එක පෙන්වයි
  const {
    data: docData,
    loading: docLoading,
    error: queryError,
  } = useQuery<any>(GET_DOCTORS_FOR_BOOKING, {
    fetchPolicy: "network-only",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handleFinalize = async () => {
    if (!selectedDoctor || !selectedSlot) return;

    try {
      const { data } = await getPaymentUrl({
        variables: {
          doctorId: selectedDoctor.id,
          doctorName: `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`,
          patientName: patientInfo.fullName,
          nic: patientInfo.nic,
          phone: patientInfo.phone,
          scheduledAt: selectedSlot.workingDate,
        },
      });

      if (data?.getStripeSessionUrl) {
        window.location.href = data.getStripeSessionUrl;
      }
    } catch (err) {
      console.error("Payment Gateway Error:", err);
      alert("Could not connect to payment provider. Please try again.");
    }
  };

  if (queryError)
    return (
      <div className="p-10 text-red-500 font-bold text-center">
        Error connecting to server!
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md px-10 py-5 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black transition-all duration-500 ${step >= s ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-200" : "bg-slate-100 text-slate-400"}`}>
                    {s === 3 && step === 3 ? <CheckCircle2 size={20} /> : s}
                  </div>
                  <span className={`hidden md:block text-[10px] font-black uppercase tracking-widest ${step >= s ? "text-blue-600" : "text-slate-300"}`}>
                    {s === 1 ? "Identity" : s === 2 ? "Specialist" : "Confirm"}
                  </span>
                </div>
                {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? "bg-blue-600" : "bg-slate-100"}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* STEP 1: Premium Input Form */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xl p-12 rounded-[4rem] shadow-2xl border border-white animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tighter mb-4">
                <ShieldCheck size={14}/> Secure Patient Registration
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Welcome to SmartStyle</h2>
              <p className="text-slate-400 text-sm mt-3 font-medium">Please provide your details to access our world-class specialists.</p>
            </div>
            
            <div className="space-y-6">
              <div className="group transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 tracking-widest">Full Legal Name</p>
                <input name="fullName" value={patientInfo.fullName} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full p-6 bg-white border-2 border-slate-50 rounded-[2rem] font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 tracking-widest">Identity Number (NIC)</p>
                  <input name="nic" value={patientInfo.nic} onChange={handleInputChange} type="text" placeholder="2000xxxxxx" className="w-full p-6 bg-white border-2 border-slate-50 rounded-[2rem] font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase ml-4 mb-2 tracking-widest">Contact Number</p>
                  <input name="phone" value={patientInfo.phone} onChange={handleInputChange} type="text" placeholder="+94 7x xxxxxxx" className="w-full p-6 bg-white border-2 border-slate-50 rounded-[2rem] font-bold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                </div>
              </div>

              <button disabled={!patientInfo.fullName || !patientInfo.nic} onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-widest mt-8 shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3">
                Continue to Specialists <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Premium Specialist Registry */}
        {step === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex flex-col lg:flex-row gap-6 items-center bg-white/50 backdrop-blur-md p-4 rounded-[3rem] border border-white/50">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="Search by name or keyword..." className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] outline-none font-bold text-sm shadow-sm focus:ring-4 focus:ring-blue-500/5 transition-all" onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                <select onChange={(e) => setCategoryFilter(e.target.value)} className="bg-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase outline-none shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
                  <option value="All">All Specialties</option>
                  {catData?.getAllDoctorCategories?.map((cat: any) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <input type="date" className="bg-white px-6 py-5 rounded-[2rem] font-bold text-xs outline-none shadow-sm cursor-pointer" onChange={(e) => setDateFilter(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
  {docLoading ? (
    <div className="col-span-full text-center py-24">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
    </div>
  ) : (
    docData?.getAllDoctors
      ?.filter((doc: any) => {
        const matchesName = `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "All" || doc.category.name === categoryFilter;
        return matchesName && matchesCategory;
      })
      .map((doc: any) => {
        // 🔍 Console Log එකක් දාලා බලමු ඇත්තටම මොනවද එන්නේ කියලා
        console.log(`Doctor: ${doc.lastName}`, doc.schedules);

        // ✅ තෝරාගත් දිනයට (dateFilter) අදාළ session එක හරියටම ගමු
        const relevantSlots = doc.schedules?.filter((s: any) => {
          const slotDate = new Date(s.workingDate).toISOString().split("T")[0];
          // දිනයක් තෝරා ඇත්නම් ඒ දිනයට බලන්න, නැතිනම් පළමු session එක ගන්න
          return dateFilter ? slotDate === dateFilter : true;
        }) || [];

        const firstSlot = relevantSlots[0];
        const isFull = !firstSlot || firstSlot.status !== "Available" || firstSlot.remainingSeats <= 0;

        // ✅ ඩේටාබේස් එකේ අගයන්ම පාවිච්චි කරමු
        const currentBooked = firstSlot ? firstSlot.bookedCount : 0;
        const currentRemaining = firstSlot ? firstSlot.remainingSeats : 20;

        return (
          <div
            key={doc.id}
            onClick={() => { if (!isFull) { setSelectedDoctor(doc); setSelectedSlot(firstSlot); setStep(3); } }}
            className={`group relative bg-gradient-to-br from-white to-slate-50/50 rounded-[4rem] p-10 border-2 transition-all duration-500 flex flex-col h-[500px] ${
              isFull ? "border-transparent opacity-60 grayscale cursor-not-allowed" : "border-white hover:border-blue-500 hover:shadow-2xl cursor-pointer"
            }`}
          >
            <div className="flex justify-between items-center mb-8">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center ${isFull ? "bg-slate-200" : "bg-blue-600 text-white shadow-xl"}`}>
                <Stethoscope size={36} />
              </div>
              {/* ✅ අලුත්ම Remaining count එක පෙන්වමු */}
              <div className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest ${isFull ? "bg-slate-200 text-slate-500" : "bg-emerald-100 text-emerald-600"}`}>
                {isFull ? "Session Full" : `${currentRemaining} Seats Left`}
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Dr. {doc.firstName}<br />{doc.lastName}
              </h4>
              <p className="text-blue-600 text-[11px] font-black uppercase mt-4 tracking-widest">
                {doc.category?.name || "SPECIALIST"}
              </p>
              
              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="bg-white/50 p-4 rounded-3xl border border-white">
                   <p className="text-[8px] font-black text-slate-400 uppercase">Availability</p>
                   <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                      <Clock size={12} className="text-blue-500"/>
                      {firstSlot ? firstSlot.startTime : "N/A"}
                   </div>
                </div>
                <div className="bg-white/50 p-4 rounded-3xl border border-white">
                   <p className="text-[8px] font-black text-slate-400 uppercase">Patient Load</p>
                   <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                      <Users size={12} className="text-blue-500"/>
                      {/* ✅ අලුත්ම Booked count එක පෙන්වමු */}
                      {firstSlot ? `${currentBooked}/${firstSlot.maxPatients}` : "0/20"}
                   </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-between items-center pt-8 border-t border-slate-100/50">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">Rs. 2500</p>
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all ${isFull ? "bg-slate-100 text-slate-300" : "bg-slate-900 text-white"}`}>
                <ArrowRight size={28} />
              </div>
            </div>
          </div>
        );
      })
  )}
</div>
            
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mx-auto mt-12 hover:text-blue-600 transition-colors tracking-widest group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back to Identity
            </button>
          </div>
        )}

        {/* STEP 3: Premium Checkout View */}
        {step === 3 && selectedDoctor && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-700">
            <div className="bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white">
               <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                     <h2 className="text-5xl font-black tracking-tighter">Confirm Booking</h2>
                     <p className="text-slate-400 font-bold mt-2 uppercase text-xs tracking-[0.3em]">Final Step to Secure Appointment</p>
                  </div>
                  <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/20">
                     <CheckCircle2 size={48} />
                  </div>
               </div>
               
               <div className="p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Patient Information</p>
                        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><User size={20}/></div>
                           <div>
                              <p className="text-xl font-black text-slate-900">{patientInfo.fullName}</p>
                              <p className="text-xs font-bold text-slate-400">NIC: {patientInfo.nic} | TEL: {patientInfo.phone}</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Physician Details</p>
                        <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm"><Stethoscope size={20}/></div>
                           <div>
                              <p className="text-xl font-black text-slate-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{selectedDoctor.category?.name}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-blue-600 p-10 rounded-[4rem] text-white space-y-8 shadow-2xl shadow-blue-600/20">
                     <div>
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-4">Appointment Schedule</p>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <Calendar size={20} className="text-blue-200"/>
                              <span className="text-2xl font-black tracking-tight">{new Date(selectedSlot?.workingDate).toDateString()}</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <Clock size={20} className="text-blue-200"/>
                              <span className="text-2xl font-black tracking-tight">{selectedSlot?.startTime} Onwards</span>
                           </div>
                        </div>
                     </div>
                     <div className="pt-8 border-t border-blue-500/50 flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Total Fee</p>
                           <p className="text-5xl font-black tracking-tighter">Rs. 2500</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-blue-200 italic">Remaining</p>
                           {/* ✅ UI calculate එක මෙතනින් */}
                           <p className="text-2xl font-black">{selectedSlot.maxPatients - selectedSlot.bookedCount - 1} Seats</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-16 pt-0 flex flex-col md:flex-row gap-6">
                  <button onClick={() => setStep(2)} className="flex-1 py-7 bg-slate-50 text-slate-400 font-black rounded-[2.5rem] uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all border border-slate-100">Change Selection</button>
                  <button onClick={handleFinalize} disabled={paymentLoading} className="flex-[2] py-7 bg-blue-600 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-blue-700 uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
                    {paymentLoading ? <Loader2 className="animate-spin" /> : <>Secure Payment & Confirm <ArrowRight size={20}/></>}
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;