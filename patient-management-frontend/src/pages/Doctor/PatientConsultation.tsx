import { useState } from 'react';
import { Search, History, FileText, Pill, Calendar, User, ArrowRight, Activity } from 'lucide-react';

const PatientConsultation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Dummy Patient Info (Search result ekakin ena data)
  const patientInfo = {
    id: "P-8821",
    name: "Sunil Peiris",
    age: 45,
    bloodGroup: "O+",
    weight: "72kg"
  };

  // Previouse Records (Left Side List)
  const previousVisits = [
    { id: 1, date: '2026-03-10', reason: 'Common Flu & Fever', doctor: 'Dr. Ruwan', details: 'High fever for 3 days, body aches.', medicine: ['Paracetamol 500mg', 'Amoxicillin 250mg'], advice: 'Rest for 3 days' },
    { id: 2, date: '2026-01-15', reason: 'Stomach Ache', doctor: 'Dr. Ruwan', details: 'Gastritis symptoms after spicy food.', medicine: ['Omeprazole 20mg', 'Gaviscon Syrup'], advice: 'Avoid spicy food' },
    { id: 3, date: '2025-11-20', reason: 'Routine Checkup', doctor: 'Dr. Ruwan', details: 'Blood pressure was slightly high.', medicine: ['Losartan 25mg'], advice: 'Reduce salt intake' },
  ];

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      
      {/* --- TOP: Patient Search & Identity --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Enter Patient Name or ID to Load Records..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Selected Patient Mini Profile */}
        <div className="flex items-center gap-6 bg-blue-600 p-4 rounded-[2rem] text-white w-full md:w-auto shadow-xl shadow-blue-100">
           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-black">SP</div>
           <div>
              <h3 className="font-bold text-sm leading-none">{patientInfo.name}</h3>
              <p className="text-[10px] font-medium opacity-70 mt-1">{patientInfo.id} • {patientInfo.age} Yrs • {patientInfo.bloodGroup}</p>
           </div>
           <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">Weight</p>
              <p className="text-sm font-black">{patientInfo.weight}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        
        {/* --- LEFT: Previous Visit History (4 Columns) --- */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex items-center gap-2">
              <History className="text-blue-600" size={18} />
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Medical History</h4>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {previousVisits.map((visit) => (
                <button 
                  key={visit.id}
                  onClick={() => setSelectedRecord(visit)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all group ${selectedRecord?.id === visit.id ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-slate-50 border-slate-50 hover:border-blue-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                     <span className={`text-[10px] font-black uppercase tracking-widest ${selectedRecord?.id === visit.id ? 'text-blue-400' : 'text-slate-400'}`}>
                        {visit.date}
                     </span>
                     <ArrowRight size={14} className={selectedRecord?.id === visit.id ? 'text-blue-400' : 'text-slate-300'} />
                  </div>
                  <p className={`font-bold text-sm ${selectedRecord?.id === visit.id ? 'text-white' : 'text-slate-800'}`}>{visit.reason}</p>
                  <p className={`text-[10px] mt-1 ${selectedRecord?.id === visit.id ? 'text-slate-400 italic' : 'text-slate-500'}`}>Consulted by {visit.doctor}</p>
                </button>
              ))}
           </div>
        </div>

        {/* --- RIGHT: Full Record Details (8 Columns) --- */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           {selectedRecord ? (
             <div className="flex-1 overflow-y-auto p-10 animate-in slide-in-from-right-4 duration-500">
                {/* Header of Record */}
                <div className="flex justify-between items-start mb-10">
                   <div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{selectedRecord.reason}</h4>
                      <div className="flex items-center gap-3 mt-2">
                         <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Calendar size={14}/> {selectedRecord.date}</span>
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                         <span className="text-xs font-bold text-blue-600">Ref: REC-00{selectedRecord.id}</span>
                      </div>
                   </div>
                   <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-600 transition-all">
                      <FileText size={24} />
                   </button>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                   <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                         <Activity size={14} className="text-blue-600" /> Clinical Observation
                      </h5>
                      <p className="text-slate-700 leading-relaxed font-medium">{selectedRecord.details}</p>
                   </div>

                   <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                         <Pill size={14} className="text-emerald-500" /> Prescribed Medication
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {selectedRecord.medicine.map((med: string, i: number) => (
                           <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm">
                                 <Pill size={16} />
                              </div>
                              <p className="text-sm font-bold text-emerald-800">{med}</p>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-50">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Doctor's Advice</h5>
                      <p className="text-sm font-bold text-slate-800 italic underline decoration-blue-200 underline-offset-4 font-serif">
                        "{selectedRecord.advice}"
                      </p>
                   </div>
                </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 text-center">
                <History size={64} className="mb-4 opacity-10" />
                <h4 className="text-xl font-black uppercase tracking-widest">Select a Previous Visit</h4>
                <p className="text-sm font-medium mt-2 italic">Click on a record from the left to view full diagnosis and medicine.</p>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default PatientConsultation;