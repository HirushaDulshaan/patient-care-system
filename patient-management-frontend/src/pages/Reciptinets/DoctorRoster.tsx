import { useState } from 'react';

const DoctorRoster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedDocForDetails, setSelectedDocForDetails] = useState<any>(null); // Modal ekata

  const doctors = [
    { 
      id: 1, name: 'Dr. Jones Perera', category: 'Cardiology', room: '101',
      sessions: [
        { day: 'Monday', time: '08:00 AM - 12:00 PM', type: 'Morning' },
        { day: 'Thursday', time: '04:00 PM - 08:00 PM', type: 'Evening' }
      ]
    },
    { 
      id: 2, name: 'Dr. Ruwan Kumara', category: 'Cardiology', room: '102',
      sessions: [
        { day: 'Tuesday', time: '09:00 AM - 01:00 PM', type: 'Morning' },
        { day: 'Thursday', time: '02:00 PM - 06:00 PM', type: 'Afternoon' },
        { day: 'Saturday', time: '04:00 PM - 08:00 PM', type: 'Evening' }
      ]
    },
    { 
      id: 3, name: 'Dr. Sunil Hettiarachchi', category: 'Cardiology', room: '101',
      sessions: [
        { day: 'Wednesday', time: '08:00 AM - 11:00 AM', type: 'Morning' },
        { day: 'Sunday', time: '10:00 AM - 02:00 PM', type: 'Morning' }
      ]
    }
  ];

  const getDayFromDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const selectedDay = getDayFromDate(dateFilter);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header & Filter Bars (Kalin thibba widihama) */}
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-3xl font-bold mb-2 text-white">Doctor Availability Master List</h2>
          <p className="text-slate-400">Click on a doctor's name to see their full weekly schedule.</p>
        </div>

        {/* Filter Section (Simplified) */}
        <div className="p-6 bg-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-200">
            <input type="text" placeholder="Search Dr. Name..." className="p-4 rounded-2xl shadow-sm outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="p-4 rounded-2xl shadow-sm outline-none font-semibold text-slate-700" onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Cardiology">Cardiology</option>
            </select>
            <input type="date" className="p-4 rounded-2xl shadow-sm outline-none" onChange={(e) => setDateFilter(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-black border-b">
                <th className="p-6">Doctor</th>
                <th className="p-6">Specialization</th>
                <th className="p-6">Full Schedule View</th>
                <th className="p-6">Status on Date</th>
                <th className="p-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors
                .filter(doc => 
                  (categoryFilter === 'All' || doc.category === categoryFilter) &&
                  (doc.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (!selectedDay || doc.sessions.some(s => s.day === selectedDay))
                )
                .map(doc => {
                  const activeSession = doc.sessions.find(s => s.day === selectedDay);

                  return (
                    <tr key={doc.id} className="hover:bg-blue-50/30 transition">
                      <td className="p-6">
                        <button 
                          onClick={() => setSelectedDocForDetails(doc)}
                          className="font-bold text-blue-600 text-lg hover:underline text-left block"
                        >
                          {doc.name}
                        </button>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Room {doc.room}</div>
                      </td>
                      <td className="p-6 text-black font-bold uppercase text-xs">
                          {doc.category}
                      </td>
                      <td className="p-6">
                        <button 
                           onClick={() => setSelectedDocForDetails(doc)}
                           className="text-[10px] bg-slate-800 text-white px-3 py-1 rounded-full font-bold hover:bg-blue-600 transition"
                        >
                          View All Days
                        </button>
                      </td>
                      <td className="p-6">
                        {activeSession ? (
                          <div className="text-sm font-bold text-green-600">Available ({activeSession.type})</div>
                        ) : (
                          <span className="text-xs text-slate-300">N/A</span>
                        )}
                      </td>
                      <td className="p-6">
                        <button className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${activeSession ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                          Book Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP: Full Weekly Schedule --- */}
      {selectedDocForDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedDocForDetails.name}</h3>
                <p className="text-blue-100 text-sm font-bold uppercase tracking-widest">{selectedDocForDetails.category} Specialist</p>
              </div>
              <button 
                onClick={() => setSelectedDocForDetails(null)}
                className="bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center transition text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <h4 className="text-slate-400 text-xs font-black uppercase mb-4 tracking-widest">Full Weekly Roster</h4>
              <div className="space-y-3">
                {selectedDocForDetails.sessions.map((session: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition">
                    <div>
                      <p className="font-black text-slate-800 uppercase text-xs">{session.day}</p>
                      <p className="text-sm font-bold text-slate-500">{session.time}</p>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase ${
                      session.type === 'Morning' ? 'bg-orange-100 text-orange-600' : 
                      session.type === 'Afternoon' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {session.type}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex gap-3">
                 <button 
                  onClick={() => setSelectedDocForDetails(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                >
                  Close View
                </button>
                <button className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                  Book This Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRoster;