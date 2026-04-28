import { useState } from 'react';

const BillingPage = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [foundRecord, setFoundRecord] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const dummyDatabase: Record<string, any> = {
    'APP-103': {
      id: 'APP-103',
      patientName: 'Sunil Peiris',
      nic: '199277889900',
      doctorName: 'Dr. Ruwan Kumara',
      category: 'Cardiology',
      session: 'Thursday | 04:00 PM - 08:00 PM (Evening)',
      room: '102',
      queueNo: '08',
      consultationFee: 2000,
      hospitalFee: 500,
      total: 2500
    }
  };

  const searchAppointment = () => {
    const record = dummyDatabase[appointmentId.trim()];
    if (record) {
      setFoundRecord(record);
    } else {
      alert("Invalid ID! Try APP-103");
      setFoundRecord(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Payments</h2>
          <p className="text-slate-500 font-medium text-sm">Search and settle patient bills efficiently.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-100 mb-10 flex gap-2">
          <input 
            type="text" 
            placeholder="APP-103" 
            className="flex-1 p-4 rounded-2xl outline-none text-lg font-bold text-slate-700"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value.toUpperCase())}
          />
          <button onClick={searchAppointment} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all">
            FETCH RECORD
          </button>
        </div>

        {foundRecord ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            
            {/* Left Section: Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                
                {/* Patient & Doctor Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div>
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Patient Information</label>
                    <p className="text-xl font-black text-slate-800 mt-1">{foundRecord.patientName}</p>
                    <p className="text-sm font-bold text-slate-400">NIC: {foundRecord.nic}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Assigned Doctor</label>
                    <p className="text-xl font-black text-slate-800 mt-1">{foundRecord.doctorName}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{foundRecord.category}</p>
                  </div>
                </div>

                {/* Session, Room & Queue Info */}
                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Scheduled Session</label>
                    <p className="text-lg font-bold text-slate-700 mt-1">{foundRecord.session}</p>
                  </div>

                  {/* Room & Queue Row - Moved here after session */}
                  <div className="flex gap-10">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Number</label>
                      <p className="text-2xl font-black text-blue-600">Room {foundRecord.room}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Queue Number</label>
                      <p className="text-2xl font-black text-emerald-500"># {foundRecord.queueNo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-4">Payment Mode</p>
                <div className="flex gap-3">
                  <button onClick={() => setPaymentMethod('Cash')} className={`px-10 py-3 rounded-xl font-black transition-all ${paymentMethod === 'Cash' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>CASH</button>
                  <button onClick={() => setPaymentMethod('Card')} className={`px-10 py-3 rounded-xl font-black transition-all ${paymentMethod === 'Card' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>CARD</button>
                </div>
              </div>
            </div>

            {/* Right Section: Billing Summary */}
            <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white flex flex-col justify-between shadow-2xl">
               <div className="space-y-8">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing Summary</h3>
                 <div className="space-y-4">
                    <div className="flex justify-between text-sm"><p className="text-slate-400">Doctor Fee</p><p className="font-bold">Rs. {foundRecord.consultationFee.toLocaleString()}.00</p></div>
                    <div className="flex justify-between text-sm"><p className="text-slate-400">Hospital Fee</p><p className="font-bold">Rs. {foundRecord.hospitalFee.toLocaleString()}.00</p></div>
                    <div className="pt-8 mt-4 border-t border-white/5">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Grand Total</p>
                      <p className="text-5xl font-black mt-2">Rs. {foundRecord.total.toLocaleString()}</p>
                    </div>
                 </div>
               </div>
               <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-5 rounded-2xl mt-12 transition-all shadow-xl shadow-blue-500/20">
                 PRINT INVOICE
               </button>
            </div>

          </div>
        ) : (
          <div className="p-20 text-center bg-slate-100 rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold">Search an appointment ID to load details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;