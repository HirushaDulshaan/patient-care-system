import { useState } from 'react';
import { Search, Calendar, Users, ArrowRight, UserCheck, ClipboardList, Filter } from 'lucide-react';

const DoctorPatientInsights = () => {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState('2026-04-28');

  // Dummy Doctors List
  const doctors = [
    { id: 1, name: 'Dr. Ruwan Kumara', specialty: 'Cardiology', totalToday: 12 },
    { id: 2, name: 'Dr. Jones Perera', specialty: 'Neurologist', totalToday: 8 },
    { id: 3, name: 'Dr. Kamala Silva', specialty: 'VOG', totalToday: 15 },
  ];

  // Dummy Patient History for Selected Doctor
  const patientHistory = [
    { id: 'P-101', name: 'Sunil Peiris', time: '09:15 AM', status: 'Completed', diagnosis: 'Mild Hypertension' },
    { id: 'P-105', name: 'Nimali Perera', time: '10:30 AM', status: 'Completed', diagnosis: 'Routine Checkup' },
    { id: 'P-112', name: 'Kamal Gunawardena', time: '11:45 AM', status: 'Completed', diagnosis: 'Chest Pain Analysis' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* --- Top Bar: Doctor Selection --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Users className="text-blue-600" size={24} /> Select Physician
          </h3>
          <div className="space-y-3">
            {doctors.map((doc) => (
              <button 
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedDoc?.id === doc.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-blue-200'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">Dr. {doc.name}</p>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${selectedDoc?.id === doc.id ? 'text-blue-400' : 'text-slate-400'}`}>{doc.specialty}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${selectedDoc?.id === doc.id ? 'bg-blue-600' : 'bg-white border'}`}>
                    {doc.totalToday} Patients
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- Right: Stats & Patient List --- */}
        <div className="lg:col-span-8 space-y-6">
          {selectedDoc ? (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
              
              {/* Filter Bar */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Calendar size={20}/></div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Viewing History for</p>
                        <input 
                            type="date" 
                            className="font-bold text-slate-800 outline-none bg-transparent cursor-pointer"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                    </div>
                 </div>
                 <div className="bg-emerald-50 px-6 py-3 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-emerald-600 uppercase">Daily Throughput</p>
                    <p className="text-xl font-black text-emerald-700">{selectedDoc.totalToday}</p>
                 </div>
              </div>

              {/* Patient Table */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                  <ClipboardList className="text-blue-600" size={20} />
                  <h4 className="text-lg font-black text-slate-800 tracking-tight">Patient Consultation Log</h4>
                </div>
                <table className="w-full text-left">
                  <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                    <tr>
                      <th className="p-6">Patient ID</th>
                      <th className="p-6">Full Name</th>
                      <th className="p-6">Consultation Time</th>
                      <th className="p-6">Primary Diagnosis</th>
                      <th className="p-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patientHistory.map((pt, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition group">
                        <td className="p-6 text-xs font-bold text-slate-400">{pt.id}</td>
                        <td className="p-6 text-sm font-black text-slate-800">{pt.name}</td>
                        <td className="p-6 text-xs font-bold text-slate-500">
                          <div className="flex items-center gap-2 font-mono"><ArrowRight size={12} className="text-blue-400"/> {pt.time}</div>
                        </td>
                        <td className="p-6">
                           <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                             {pt.diagnosis}
                           </span>
                        </td>
                        <td className="p-6 text-right">
                          <div className="flex items-center justify-end gap-2 text-emerald-500">
                            <UserCheck size={14} />
                            <span className="text-[10px] font-black uppercase">{pt.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-20 text-slate-300">
              <Users size={64} className="mb-4 opacity-20" />
              <p className="text-xl font-black uppercase tracking-widest">Select a Doctor to View Insights</p>
              <p className="text-sm font-medium italic mt-2 text-slate-400">Real-time patient flow & diagnosis tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientInsights;