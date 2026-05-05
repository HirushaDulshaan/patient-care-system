import { useState, useEffect } from 'react';
import { Search, Calendar, Trash2, Loader2, CheckCircle2, User } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

// --- GraphQL Queries ---
const GET_ALL_DOCTORS = gql`
  query GetAllDoctors {
    getAllDoctors {
      id
      firstName
      lastName
      category { name }
    }
  }
`;

const GET_DOCTOR_SCHEDULES = gql`
  query GetDoctorSchedules($doctorId: String!) {
    getDoctorSchedules(doctorId: $doctorId) {
      id
      workingDate
      startTime
      endTime
      status
    }
  }
`;

const UPDATE_DOCTOR_ROSTER = gql`
  mutation UpdateDoctorRoster($doctorId: String!, $slots: [ScheduleSlotInput!]!) {
    updateDoctorRoster(doctorId: $doctorId, slots: $slots)
  }
`;

const DoctorScheduleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  const { data: docData, loading: docLoading } = useQuery(GET_ALL_DOCTORS);

  const { data: scheduleData, loading: scheduleLoading, refetch } = useQuery(GET_DOCTOR_SCHEDULES, {
    variables: { doctorId: selectedDoctor?.id },
    skip: !selectedDoctor,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (scheduleData?.getDoctorSchedules) {
      const formattedSessions = scheduleData.getDoctorSchedules.map((s: any) => ({
        id: s.id,
        date: new Date(s.workingDate).toISOString().split('T')[0],
        startTime: s.startTime,
        endTime: s.endTime,
        status: s.status
      }));
      setSessions(formattedSessions);
    } else {
      setSessions([]);
    }
  }, [scheduleData]);

  const [updateRoster, { loading: updateLoading }] = useMutation(UPDATE_DOCTOR_ROSTER, {
    onCompleted: () => {
      alert("Roster saved successfully! 🚀");
      refetch();
    },
    onError: (err) => alert("Failed to save: " + err.message)
  });

  const addSession = () => {
    setSessions([...sessions, { id: Date.now(), date: '', startTime: '09:00', endTime: '13:00', status: 'Available' }]);
  };

  const removeSession = (id: any) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const newSessions = [...sessions];
    newSessions[index][field] = value;
    setSessions(newSessions);
  };

  const handleUpdate = async () => {
    if (!selectedDoctor) return;
    const slotsToSend = sessions.map(({ date, startTime, endTime, status }) => ({
      workingDate: date,
      startTime,
      endTime,
      status
    }));
    await updateRoster({ variables: { doctorId: selectedDoctor.id, slots: slotsToSend } });
  };

  const handleDoctorSelect = (doc: any) => {
    setSessions([]);
    setSelectedDoctor(doc);
  };

  return (
    <div className="h-screen bg-[#F8FAFC] p-4 font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* Header - Compact */}
      <div className="max-w-[1600px] mx-auto w-full mb-4">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">Doctor Scheduling Console</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Manage specialist rotations and live session status.</p>
      </div>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
        
        {/* --- Left Side: Physician List --- */}
        <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-full">
          <div className="space-y-4 mb-6">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Step 1: Find Physician</label>
            <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="ENT Specialist">ENT Specialist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Dentist">Dentist</option>
            </select>

            <div className="relative">
              <input type="text" placeholder="Search by name..." className="w-full p-3 pl-10 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 font-bold text-sm" onChange={(e) => setSearchTerm(e.target.value)} />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {docLoading ? (
              <div className="text-center py-10 animate-pulse text-slate-400 font-bold text-xs uppercase tracking-tighter">Connecting to Registry...</div>
            ) : docData?.getAllDoctors
                .filter((doc: any) => (categoryFilter === 'All' || doc.category.name === categoryFilter) && `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((doc: any) => (
                <button key={doc.id} onClick={() => handleDoctorSelect(doc)} className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedDoctor?.id === doc.id ? 'bg-slate-900 border-slate-900 text-white shadow-lg scale-[1.02]' : 'bg-white border-slate-50 text-slate-600 hover:border-blue-200'}`}>
                  <p className="font-bold text-sm">Dr. {doc.firstName} {doc.lastName}</p>
                  <p className={`text-[10px] font-black uppercase ${selectedDoctor?.id === doc.id ? 'text-blue-400' : 'text-slate-400'}`}>{doc.category.name}</p>
                </button>
              ))}
          </div>
        </div>

        {/* --- Right Side: Roster Editor --- */}
        <div className="lg:col-span-8 bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden max-h-full">
          {selectedDoctor ? (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
                <div>
                  <h3 className="text-xl font-black tracking-tight">Manage <span className="text-blue-600">Dr. {selectedDoctor.lastName}</span></h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDoctor.category.name} Specialist</p>
                </div>
                <button onClick={addSession} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-blue-700 transition shadow-lg shadow-blue-100 active:scale-95">+ Add New Date Slot</button>
              </div>

              {/* Scrollable Roster Area */}
              <div className="flex-1 overflow-y-auto pr-3 space-y-4 custom-scrollbar mb-6">
                {scheduleLoading ? (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-2 uppercase font-black text-xs">
                     <Loader2 className="animate-spin text-blue-500" />
                     Synchronizing...
                   </div>
                ) : sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300 border-2 border-dashed border-slate-50 rounded-3xl">
                    <Calendar size={40} className="mb-2 opacity-10" />
                    <p className="text-sm font-bold">No slots found. Create the first roster slot.</p>
                  </div>
                ) : (
                  sessions.map((session, index) => (
                    <div key={session.id} className={`grid grid-cols-12 gap-4 items-center p-5 rounded-[1.5rem] border transition-all ${session.status === 'Not Available' ? 'bg-red-50/50 border-red-100' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'}`}>
                      <div className="col-span-3">
                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Work Date</label>
                        <input type="date" className="w-full bg-white p-2.5 rounded-xl border border-slate-100 font-bold text-xs outline-none focus:border-blue-300" value={session.date} onChange={(e) => handleSessionChange(index, 'date', e.target.value)} />
                      </div>

                      <div className="col-span-4">
                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1 text-center">Session Time</label>
                        <div className="flex items-center gap-2">
                            <input type="time" className="w-full bg-white p-2.5 rounded-xl border border-slate-100 font-bold text-[10px] outline-none focus:border-blue-300" value={session.startTime} onChange={(e) => handleSessionChange(index, 'startTime', e.target.value)} />
                            <span className="text-slate-300">-</span>
                            <input type="time" className="w-full bg-white p-2.5 rounded-xl border border-slate-100 font-bold text-[10px] outline-none focus:border-blue-300" value={session.endTime} onChange={(e) => handleSessionChange(index, 'endTime', e.target.value)} />
                        </div>
                      </div>

                      <div className="col-span-4">
                        <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Availability Status</label>
                        <select className={`w-full p-2.5 rounded-xl font-black text-[10px] uppercase outline-none border transition-all ${session.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-600 text-white border-red-600 shadow-sm'}`} value={session.status} onChange={(e) => handleSessionChange(index, 'status', e.target.value)}>
                          <option value="Available">Available</option>
                          <option value="Not Available">Not Available (Leave)</option>
                        </select>
                      </div>

                      <div className="col-span-1 text-right">
                        <button onClick={() => removeSession(session.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Fixed Footer Action */}
              <div className="pt-2">
                <button onClick={handleUpdate} disabled={updateLoading || !selectedDoctor} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-xl active:scale-[0.98] uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50">
                  {updateLoading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                  Save Specialist Roster
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 border-4 border-dashed border-slate-50 rounded-[3rem]">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <User size={40} className="opacity-20" />
              </div>
              <p className="text-lg font-bold tracking-tight">Select Physician to Manage Live Availability</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorScheduleManagement;