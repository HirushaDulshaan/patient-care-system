import { useState } from 'react';

const PrescriptionEntry = () => {
  const [medicines, setMedicines] = useState([
    { name: '', strength: '', frequency: 'Morning Only', duration: '' }
  ]);

  const addRow = () => {
    setMedicines([...medicines, { name: '', strength: '', frequency: 'Morning Only', duration: '' }]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        
        <header className="mb-10 flex justify-between items-end border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Prescription Entry</h2>
            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest mt-1">Digital Medical Record System</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase">Ref No</p>
             <p className="font-bold text-slate-700">#RX-8829</p>
          </div>
        </header>

        {/* Prescription Input Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-4">Medicine Name</div>
            <div className="col-span-2">Strength (mg)</div>
            <div className="col-span-3">Frequency / Time</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-1"></div>
          </div>

          {medicines.map((med, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Medicine Name */}
              <div className="col-span-4">
                <input 
                  type="text" 
                  placeholder="e.g. Panadol" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition"
                />
              </div>

              {/* Strength */}
              <div className="col-span-2">
                <input 
                  type="text" 
                  placeholder="500mg" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition"
                />
              </div>

              {/* Frequency Dropdown */}
              <div className="col-span-3">
                <select className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-700 appearance-none">
                  <option>Morning Only</option>
                  <option>Night Only</option>
                  <option>Morning & Evening</option>
                  <option>Morning, Noon & Night</option>
                  <option>Every 6 Hours</option>
                </select>
              </div>

              {/* Duration */}
              <div className="col-span-2">
                <input 
                  type="text" 
                  placeholder="3 Days" 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition"
                />
              </div>

              {/* Delete Button */}
              <div className="col-span-1 text-center">
                <button className="text-red-300 hover:text-red-500 transition text-xl">×</button>
              </div>
            </div>
          ))}

          <button 
            onClick={addRow}
            className="flex items-center gap-2 mt-6 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition"
          >
            <span>+</span> Add Another Medicine
          </button>
        </div>

        {/* Diagnosis Note */}
        <div className="mt-12 p-8 bg-slate-900 rounded-[2rem] text-white">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Doctor's Clinical Notes</label>
          <textarea 
            className="w-full bg-transparent border-none outline-none text-lg font-medium placeholder-slate-700 resize-none"
            rows={3}
            placeholder="Type clinical diagnosis or special advice for the patient..."
          ></textarea>
        </div>

        <div className="mt-10 flex gap-4">
           <button className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition active:scale-95">
             CANCEL
           </button>
           <button className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition active:scale-95">
             FINALIZE & SAVE RECORD
           </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionEntry;