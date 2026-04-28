import { useState } from 'react';
import { Pill, Plus, Trash2, Save, FileEdit, ClipboardCheck, AlertCircle } from 'lucide-react';

const NewMedicalRecord = () => {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: 'Daily' }]);

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: 'Daily' }]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500 pb-20">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Consultation</h2>
            <p className="text-slate-500 font-medium mt-1">Patient: <span className="text-blue-600 font-bold">Sunil Peiris (P-8821)</span></p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Live Session</div>
             <span className="text-slate-300 font-bold text-xs">April 28, 2026</span>
          </div>
        </div>

        <form className="space-y-8">
          
          {/* --- Section 1: Clinical Notes --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FileEdit size={16} className="text-blue-500" /> 1. Observation & Diagnosis
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Primary Symptom / Complaint</label>
                <input type="text" placeholder="e.g. Constant headache for 2 days" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Detailed Clinical Notes</label>
                <textarea rows={4} placeholder="Describe clinical findings..." className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 transition-all resize-none"></textarea>
              </div>
            </div>
          </div>

          {/* --- Section 2: Prescription Builder --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Pill size={16} className="text-emerald-500" /> 2. Medication Plan
               </h3>
               <button 
                type="button" 
                onClick={addMedicine}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm shadow-blue-100"
               >
                 <Plus size={14} /> ADD DRUG
               </button>
            </div>

            <div className="space-y-4">
              {medicines.map((_, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-50 hover:border-emerald-100 transition-all">
                  <div className="col-span-5 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Drug Name</label>
                    <input type="text" placeholder="e.g. Amoxicillin 500mg" className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none font-bold text-sm" />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Dosage</label>
                    <input type="text" placeholder="e.g. 1 Tablet" className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none font-bold text-sm" />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Frequency</label>
                    <select className="w-full p-3 bg-white border border-slate-100 rounded-xl outline-none font-bold text-xs text-slate-600">
                      <option>Once Daily (OD)</option>
                      <option>Twice Daily (BD)</option>
                      <option>Thrice Daily (TDS)</option>
                      <option>Before Meal</option>
                    </select>
                  </div>
                  <div className="col-span-1 text-right pt-5">
                    <button type="button" onClick={() => removeMedicine(index)} className="text-slate-300 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Section 3: Next Steps & Advice --- */}
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <ClipboardCheck size={16} /> 3. Final Advice & Follow-up
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Special Advice to Patient</label>
                      <input type="text" placeholder="e.g. Avoid cold drinks for a week" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Next Visit Date (Optional)</label>
                      <input type="date" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none font-bold text-white transition-all" />
                   </div>
                </div>
             </div>
             {/* Background Deco */}
             <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
                <AlertCircle size={150} />
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button type="button" className="flex-1 py-5 bg-white border border-slate-200 text-slate-400 font-black rounded-3xl hover:bg-slate-50 transition-all">
              SAVE DRAFT
            </button>
            <button type="submit" className="flex-[2] py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
              <Save size={20} /> COMPLETED & PRINT RECORD
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewMedicalRecord;