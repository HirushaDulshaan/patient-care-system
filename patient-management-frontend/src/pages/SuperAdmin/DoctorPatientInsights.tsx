import { useState, useEffect } from 'react';
import { Search, Calendar, Users, ArrowRight, UserCheck, ClipboardList, Loader2, AlertCircle } from 'lucide-react';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';

// 1. Super Admin ට අවශ්‍ය සියලුම insights ලබාගන්නා Query එක
const GET_ALL_DOCTOR_INSIGHTS = gql`
 query GetSuperAdminInsights($date: String!) {
  getAllDoctorInsights(date: $date) {
    id
    firstName
    lastName
    specialization  # 👈 Backend එකේ නමම මෙතන තියෙන්න ඕනේ
    appointments {
      id
      status
      scheduledAt
      patient {
        fullName
      }
      medicalRecords {
        diagnosis
      }
    }
  }
}
`;

const DoctorPatientInsights = () => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);

  // 2. Data Fetching
  const { data, loading, error } = useQuery(GET_ALL_DOCTOR_INSIGHTS, {
    variables: { date: dateFilter },
  });

  const doctorsList = data?.getAllDoctorInsights || [];
  
  // සිලෙක්ට් කරපු දොස්තරගේ දත්ත වෙන් කර ගැනීම
  const selectedDoc = doctorsList.find((d: any) => d.id === selectedDocId);
  const patientHistory = selectedDoc?.appointments || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans p-6">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Insights</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Global Physician & Patient Flow Tracking</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Calendar className="text-blue-600" size={18} />
            <input 
              type="date" 
              className="font-black text-slate-800 outline-none text-sm cursor-pointer"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: Doctors List --- */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={16} /> Active Physicians ({doctorsList.length})
            </h3>
            
            {loading ? (
              <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {doctorsList.map((doc: any) => (
                  <button 
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`w-full text-left p-5 rounded-[2rem] border transition-all duration-300 ${selectedDocId === doc.id ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-[1.02]' : 'bg-slate-50 border-slate-50 hover:border-blue-200'}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${selectedDocId === doc.id ? 'bg-blue-600' : 'bg-white text-slate-400'}`}>
                          {doc.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">Dr. {doc.firstName} {doc.lastName}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${selectedDocId === doc.id ? 'text-blue-400' : 'text-slate-400'}`}>{doc.specialization}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-[10px] font-black ${selectedDocId === doc.id ? 'bg-white/10' : 'bg-blue-50 text-blue-600'}`}>
                        {doc.appointments.length} Visits
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: Patient Logs --- */}
        <div className="lg:col-span-8">
          {selectedDocId ? (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
              
              {/* Doctor Stats Mini Header */}
              <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Detailed Logs For</p>
                  <h3 className="text-2xl font-black italic">Dr. {selectedDoc.firstName} {selectedDoc.lastName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest">Consultations</p>
                  <p className="text-4xl font-black">{patientHistory.length}</p>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                    <tr>
                      <th className="p-6 text-center">#</th>
                      <th className="p-6">Patient Name</th>
                      <th className="p-6">Diagnosis / Result</th>
                      <th className="p-6">Time</th>
                      <th className="p-6 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {patientHistory.length > 0 ? (
                      patientHistory.map((app: any, i: number) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition group">
                          <td className="p-6 text-xs font-black text-slate-300 text-center">{i + 1}</td>
                          <td className="p-6">
                            <p className="text-sm font-black text-slate-800">{app.patient.fullName}</p>
                          </td>
                          <td className="p-6">
                            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
                              {app.medicalRecords?.[0]?.diagnosis || "Ongoing/Incomplete"}
                            </span>
                          </td>
                          <td className="p-6 text-xs font-bold text-slate-500">
                             {new Date(app.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-6 text-right">
                            <div className="flex items-center justify-end gap-2 text-emerald-500">
                              <UserCheck size={14} />
                              <span className="text-[10px] font-black uppercase tracking-tighter">Verified Visit</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-20 text-center text-slate-300 font-bold italic">No completed visits found for this physician on this date.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-20 text-slate-300">
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                <Search size={40} className="opacity-20" />
              </div>
              <p className="text-xl font-black uppercase tracking-widest text-slate-400">Physician Insight Portal</p>
              <p className="text-sm font-medium italic mt-2 text-slate-300 text-center max-w-xs">Select a doctor from the list to view their patient flow and clinical records.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientInsights;