import React, { useState } from 'react';
import { 
  Calendar, Clock, User, Phone, CheckCircle2, 
  ArrowRight, Stethoscope, ChevronLeft, Search, Filter, 
  CreditCard, Users
} from 'lucide-react';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  // Dummy Doctors Data with Availability
  const doctors = [
    { id: 1, name: 'Dr. Ruwan Kumara', specialty: 'Cardiology', slots: 4, fee: '2500', time: '08:00 AM - 12:00 PM' },
    { id: 2, name: 'Dr. Jones Perera', specialty: 'ENT', slots: 0, fee: '2000', time: '09:00 AM - 01:00 PM' },
    { id: 3, name: 'Dr. Kamala Silva', specialty: 'VOG', slots: 12, fee: '3000', time: '04:00 PM - 08:00 PM' },
    { id: 4, name: 'Dr. Nimal Siriwardena', specialty: 'Cardiology', slots: 1, fee: '2500', time: '05:00 PM - 09:00 PM' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Progress Header */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100">
             {[1, 2, 3].map((s) => (
               <React.Fragment key={s}>
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                   {s === 3 && step === 3 ? <CheckCircle2 size={18}/> : s}
                 </div>
                 {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-100'}`}></div>}
               </React.Fragment>
             ))}
          </div>
        </div>

        {/* STEP 1: Personal Details (Centered Card) */}
        {step === 1 && (
          <div className="max-w-xl mx-auto bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">Patient Identity</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Enter your basic information to proceed</p>
             </div>
             <div className="space-y-5">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                   <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input type="text" placeholder="Enter your name" className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold" />
                   </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-2">NIC Number</label>
                     <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="19XXXXXXXXXV" className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contact Number</label>
                     <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="text" placeholder="07XXXXXXXX" className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all font-bold text-sm" />
                     </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest mt-6 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-200">
                   Find Available Doctors <ArrowRight size={18}/>
                </button>
             </div>
          </div>
        )}

        {/* STEP 2: Filterable Doctor List (Full Width) */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             {/* Filter Bar */}
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input type="text" placeholder="Search doctor by name..." className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-bold text-sm" />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                   <select 
                      onChange={(e) => setCategory(e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black text-[10px] uppercase outline-none focus:ring-2 focus:ring-blue-500"
                   >
                      <option value="All">All Specialties</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="ENT">ENT</option>
                      <option value="VOG">VOG</option>
                   </select>
                   <input 
                      type="date" 
                      className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-xs outline-none" 
                      onChange={(e) => setSelectedDate(e.target.value)}
                   />
                </div>
             </div>

             {/* Doctor Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors
                  .filter(doc => category === 'All' || doc.specialty === category)
                  .map((doc) => (
                  <div key={doc.id} className={`bg-white p-8 rounded-[3rem] border transition-all relative group ${doc.slots === 0 ? 'opacity-60 grayscale' : 'hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer'}`} onClick={() => doc.slots > 0 && setStep(3)}>
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <Stethoscope size={30} />
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${doc.slots > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                           {doc.slots > 0 ? `${doc.slots} Slots Left` : 'Fully Booked'}
                        </span>
                     </div>
                     <h4 className="text-xl font-black text-slate-800">Dr. {doc.name}</h4>
                     <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-1">{doc.specialty}</p>
                     
                     <div className="mt-8 pt-6 border-t border-slate-50 space-y-3">
                        <div className="flex items-center gap-3 text-slate-400">
                           <Clock size={14} /> <span className="text-xs font-bold">{doc.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <p className="text-lg font-black text-slate-900">Rs. {doc.fee}</p>
                           <button disabled={doc.slots === 0} className="p-3 bg-slate-900 text-white rounded-xl group-hover:bg-blue-600 transition-all">
                              <ArrowRight size={18} />
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             
             <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase hover:text-slate-900 transition-colors mx-auto">
                <ChevronLeft size={16}/> Back to Personal Info
             </button>
          </div>
        )}

        {/* STEP 3: Final Confirmation */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
                <CheckCircle2 size={48} />
             </div>
             <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Confirm Booking?</h2>
                <p className="text-slate-500 font-medium mt-2">You are about to reserve a slot for <span className="text-blue-600 font-bold">Dr. Ruwan Kumara</span></p>
             </div>
             
             <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm text-left grid grid-cols-2 gap-8">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Appointment Date</p>
                   <p className="font-bold text-slate-800">Tuesday, April 28</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Time</p>
                   <p className="font-bold text-slate-800">08:00 AM - Morning</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-50 flex justify-between items-center">
                   <p className="text-sm font-bold text-slate-400 italic">Total Consultation Fee</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter text-blue-600">Rs. 2,500.00</p>
                </div>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase text-[10px]">Change Selection</button>
                <button className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-3xl shadow-2xl shadow-slate-200 hover:bg-black transition-all uppercase text-[10px] tracking-widest">Finalize Appointment</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookAppointment;