import  { useState } from 'react';

const BookAppointment = () => {
  const [searchPatient, setSearchPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Appointment</h2>

        {/* STEP 1: Find Registered Patient */}
        <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
          <label className="block text-sm font-bold text-blue-900 mb-2 font-mono uppercase tracking-widest">Step 1: Select Patient</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              className="flex-1 p-3 rounded-xl border border-blue-200 outline-none" 
              placeholder="Search by Name or NIC..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Search</button>
          </div>
          {/* Dummy Search Result */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100 flex justify-between items-center shadow-sm">
             <div>
               <p className="font-bold text-gray-800">Hirusha Dulshan</p>
               <p className="text-xs text-gray-500">NIC: 2000XXXXXXX | Mob: 071XXXXXXX</p>
             </div>
             <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">SELECTED</span>
          </div>
        </div>

        {/* STEP 2: Select Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Doctor Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase">Step 2: Assign Doctor</label>
            <select 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
              onChange={(e) => setSelectedDoctor(e.target.value)}
            >
              <option value="">Select Doctor (Ruwan, Nimal, etc.)</option>
              <option value="dr-ruwan">Dr. Ruwan (Cardiologist) - Mon/Wed</option>
              <option value="dr-nimal">Dr. Nimal (ENT) - Tue/Fri</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700 uppercase">Step 3: Pick Date & Time</label>
            <div className="flex gap-4">
               <input type="date" className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" />
               <input type="time" className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" />
            </div>
          </div>
        </div>

        {/* Summary & Confirm */}
        <div className="p-6 bg-slate-900 rounded-2xl text-white">
          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-400">Consultation Fee</p>
            <p className="text-xl font-bold">Rs. 2,500.00</p>
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Confirm & Print Token
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookAppointment;