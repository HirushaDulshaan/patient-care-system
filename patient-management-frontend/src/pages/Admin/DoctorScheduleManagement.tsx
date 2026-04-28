import { useState } from 'react';

const DoctorScheduleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  
  const [sessions, setSessions] = useState([
    { id: 1, date: '2026-04-30', startTime: '08:00', endTime: '12:00', type: 'Morning', status: 'Available' }
  ]);

  const doctors = [
    { id: 1, name: 'Dr. Ruwan Kumara', category: 'Cardiology' },
    { id: 2, name: 'Dr. Jones Perera', category: 'Cardiology' },
    { id: 3, name: 'Dr. Kamala Silva', category: 'VOG' },
    { id: 4, name: 'Dr. Nimal Siriwardena', category: 'ENT' },
  ];

  const addSession = () => {
    setSessions([...sessions, { id: Date.now(), date: '', startTime: '09:00', endTime: '13:00', type: 'Morning', status: 'Available' }]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-slate-900">Doctor Scheduling Console</h2>
            <p className="text-slate-500 font-medium mt-1">Manage specialist rotations and live session status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- Left: Physician Search & Select --- */}
          <div className="lg:col-span-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-fit">
            <div className="space-y-4 mb-8">
              <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Step 1: Find Physician</label>
              <select 
                className="w-full p-3 bg-slate-100 border-none rounded-xl font-bold text-xs text-slate-600 outline-none"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Cardiology">Cardiology</option>
                <option value="VOG">VOG</option>
                <option value="ENT">ENT</option>
              </select>

              <input 
                type="text" 
                placeholder="Search by name..." 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {doctors
                .filter(doc => (categoryFilter === 'All' || doc.category === categoryFilter) && doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((doc) => (
                <button 
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedDoctor?.id === doc.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                >
                  <p className="font-bold text-sm">{doc.name}</p>
                  <p className={`text-[10px] font-black uppercase ${selectedDoctor?.id === doc.id ? 'text-blue-400' : 'text-slate-400'}`}>{doc.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* --- Right: Date-Based Roster with Status --- */}
          <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm min-h-[500px]">
            {selectedDoctor ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center mb-10 border-b pb-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">Manage <span className="text-blue-600">{selectedDoctor.name}</span></h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedDoctor.category} Specialist</p>
                  </div>
                  <button 
                    onClick={addSession}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
                  >
                    + Add New Date Slot
                  </button>
                </div>

                <div className="space-y-6">
                  {sessions.map((session, index) => (
                    <div key={session.id} className={`grid grid-cols-12 gap-4 items-center p-6 rounded-[2rem] border transition-all ${session.status === 'Not Available' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      
                      {/* Date & Time (Kalin thibba widihama) */}
                      <div className="col-span-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Work Date</label>
                        <input type="date" className="w-full bg-white p-3 rounded-xl border border-slate-100 font-bold text-sm outline-none" defaultValue={session.date} />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Session Time</label>
                        <div className="flex items-center gap-2">
                            <input type="time" className="w-full bg-white p-3 rounded-xl border border-slate-100 font-bold text-[10px] outline-none" defaultValue={session.startTime} />
                            <span className="text-slate-300">-</span>
                            <input type="time" className="w-full bg-white p-3 rounded-xl border border-slate-100 font-bold text-[10px] outline-none" defaultValue={session.endTime} />
                        </div>
                      </div>

                      {/* --- NEW: STATUS TOGGLE --- */}
                      <div className="col-span-3">
                        <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 ml-1">Availability Status</label>
                        <select 
                            className={`w-full p-3 rounded-xl font-black text-[10px] uppercase outline-none border transition-all ${session.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200'}`}
                            value={session.status}
                            onChange={(e) => {
                                const newSessions = [...sessions];
                                newSessions[index].status = e.target.value;
                                setSessions(newSessions);
                            }}
                        >
                          <option value="Available">Available</option>
                          <option value="Not Available">Not Available (Leave)</option>
                        </select>
                      </div>

                      {/* Remove */}
                      <div className="col-span-2 text-right pt-4">
                        <button className="text-slate-300 hover:text-red-500 transition font-black text-xl">×</button>
                      </div>

                      {/* Warning Message if Not Available */}
                      {session.status === 'Not Available' && (
                          <div className="col-span-12 mt-2">
                              <p className="text-[10px] font-bold text-red-500 italic bg-white/50 p-2 rounded-lg flex items-center gap-2">
                                  ⚠️ This session is hidden from the booking roster.
                              </p>
                          </div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] mt-12 hover:bg-black transition-all shadow-2xl active:scale-95 uppercase tracking-widest">
                  Update All Specialist Slots
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 border-4 border-dashed border-slate-50 rounded-[3rem]">
                <p className="text-lg font-bold tracking-tight">Select Physician to Manage Live Availability</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorScheduleManagement;