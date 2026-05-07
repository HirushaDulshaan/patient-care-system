import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { 
  Users, Calendar, Clock, Loader2, PlusCircle, 
  Search, FileText, UserPlus, ChevronLeft, ChevronRight 
} from 'lucide-react';

// --- GraphQL Query ---
const GET_STAFF_DASHBOARD_DATA = gql`
  query GetStaffDashboardData($page: Float!, $limit: Float!) {
    getAdminSystemStats {
      todayAppointments
    }
    getRecentPatients(page: $page, limit: $limit) {
      patients {
        id
        fullName
        nic
        phone
      }
      totalCount
      hasMore
    }
  }
`;

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6; 

  const { data, loading, error, refetch } = useQuery(GET_STAFF_DASHBOARD_DATA, {
    variables: { page, limit },
    pollInterval: 20000, 
    fetchPolicy: 'network-only',
    onError: (err) => toast.error("Sync Error: " + err.message)
  });

  const patientStats = data?.getRecentPatients;
  const totalPages = Math.ceil((patientStats?.totalCount || 0) / limit);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans animate-in fade-in duration-500">
      
      {/* --- Main Content --- */}
      <div className="flex-1 p-8">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Operations Terminal</h2>
            <p className="text-slate-400 text-[10px] font-black mt-1 uppercase tracking-[0.2em]">
              Clinic Front-Desk Management // Node_01
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <UserPlus size={20} />
            </div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Duty</p>
               <p className="text-sm font-black text-slate-800 leading-none">Receptionist Portal</p>
            </div>
          </div>
        </header>

        {/* --- Stats Insight Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:shadow-2xl transition-all duration-500">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <Users size={24} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Total Patients</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
              {patientStats?.totalCount || "0"}
            </h3>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:shadow-2xl transition-all duration-500">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Calendar size={24} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Today's Appointments</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">
              {data?.getAdminSystemStats?.todayAppointments || "0"}
            </h3>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group hover:shadow-2xl transition-all duration-500">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <FileText size={24} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Billing Nodes</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter">Live</h3>
          </div>
        </div>

        {/* --- Recent Patient Registry Table --- */}
        <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Table Header & Search */}
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">System Patient Registry</h4>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest italic">Encrypted Database Records</p>
            </div>
            <div className="flex gap-4">
               <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search NIC..." 
                    className="bg-slate-50 border-none rounded-2xl px-5 py-3.5 pl-12 text-xs font-bold w-64 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
               </div>
               <button 
                onClick={() => navigate('/reception/register')}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center gap-2"
              >
                <PlusCircle size={16} /> New Registration
              </button>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] uppercase font-black tracking-[0.2em]">
                  <th className="p-8">Patient Identity</th>
                  <th className="p-8">Contact Info</th>
                  <th className="p-8">Flow Status</th>
                  <th className="p-8 text-right">System Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-32 text-center">
                      <Loader2 className="animate-spin inline text-blue-600 mb-4" size={40} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching Central Registry...</p>
                    </td>
                  </tr>
                ) : (
                  patientStats?.patients.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="p-8">
                         <p className="font-black text-slate-800 text-sm italic">{p.fullName}</p>
                         <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter mt-1">ID: PAT-{p.id.slice(0, 5).toUpperCase()} // NIC: {p.nic}</p>
                      </td>
                      <td className="p-8">
                         <p className="text-xs font-black text-slate-600">{p.phone || "N/A"}</p>
                         <p className="text-[9px] font-bold text-slate-300 uppercase">Primary Contact</p>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                           <span className="text-[9px] font-black text-emerald-600 uppercase italic">Registered</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => navigate('/reception/billing')}
                          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                        >
                          Create Bill
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* --- Professional Pagination Footer --- */}
          <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
               System Registry Node: Alpha-01 // Total Records: {patientStats?.totalCount || 0}
             </p>
             
             <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Page <span className="text-blue-600">{page}</span> of {totalPages}
                </span>
                <div className="flex gap-2">
                   <button 
                    disabled={page === 1}
                    onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button 
                    disabled={!patientStats?.hasMore}
                    onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all shadow-sm active:scale-90"
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;