import React from "react";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Loader2,
} from "lucide-react";


const GET_DOCTOR_STATS = gql`
  query GetDoctorStats($userId: String!) {
    getPendingConsultations(userId: $userId) {
      id
      patient {
        fullName
        nic
        phone
      }
      scheduledAt
      status
    }
  }
`;


const GET_DASHBOARD_STATS = gql`
  query GetDoctorDashboardStats($userId: String!) {
    getDoctorDashboardStats(userId: $userId) {
      firstName
      lastName
      monthlyCount
      totalPatients
      monthlyIncome
    }
  }
`;

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId") || "";

  // Today's Appointments Data
  const { data: queueData, loading: queueLoading } = useQuery(
    GET_DOCTOR_STATS,
    {
      variables: { userId: currentUserId },
      pollInterval: 30000,
    },
  );

  // Monthly & Income Stats Data
  const { data: statsData, loading: statsLoading } = useQuery(
    GET_DASHBOARD_STATS,
    {
      variables: { userId: currentUserId },
      pollInterval: 60000,
    },
  );

  const stats = statsData?.getDoctorDashboardStats;
  const todayAppointments = queueData?.getPendingConsultations || [];
  const todayCount = todayAppointments.length;

  if (queueLoading || statsLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <div className="flex-1 p-10">
        {/* --- Header Section --- */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Doctor's Console
            </h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-xs tracking-widest flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> Clinical
              Performance Overview
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">
              D
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Medical Officer
              </p>
              <p className="text-sm font-black text-slate-800 leading-none">
                Dr. {stats?.firstName} {stats?.lastName}
              </p>{" "}
            </div>
          </div>
        </header>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Today's Appointments */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
              <Calendar size={28} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              Today's Queue
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black text-slate-800">
                {todayCount}
              </h3>
              <span className="text-xs font-bold text-slate-400 italic">
                Patients Waiting
              </span>
            </div>
          </div>

          {/* Monthly Total (Completed Appointments) */}
          <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative group transition-all hover:scale-[1.02]">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
              <Users size={28} />
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              Monthly Volume
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black text-slate-800">
                {stats?.monthlyCount || 0}
              </h3>
              <span className="text-xs font-bold text-slate-400 italic">
                Completed Visits
              </span>
            </div>
          </div>

          {/* Total Income (Monthly Count * 2000) */}
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-blue-900/20 relative group transition-all hover:scale-[1.02] overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-white">
              <DollarSign size={80} />
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-400 group-hover:text-slate-900 transition-colors">
              <DollarSign size={28} />
            </div>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
              Estimated Revenue
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-white">
                LKR {(stats?.monthlyIncome || 0).toLocaleString()}
              </h3>
            </div>
            <p className="text-[9px] text-blue-400/60 font-bold mt-2 uppercase tracking-widest">
              Base: 2,000 Per Patient
            </p>
          </div>
        </div>

        {/* --- Recent Patients / Today's Queue --- */}
        <div className="bg-white rounded-[4rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                Active Appointments
              </h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
                Pending Consultations for Today
              </p>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-6">Patient Details</th>
                  <th className="p-6">Time / Schedule</th>
                  <th className="p-6">Contact Info</th>
                  <th className="p-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {todayAppointments.length > 0 ? (
                  todayAppointments.map((app: any) => (
                    <tr
                      key={app.id}
                      className="hover:bg-blue-50/30 transition group rounded-3xl"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all uppercase">
                            {app.patient.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">
                              {app.patient.fullName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                              NIC: {app.patient.nic}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-slate-600 font-bold text-xs">
                          <Clock size={14} className="text-blue-500" />
                          {new Date(app.scheduledAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-500">
                        {app.patient.phone}
                      </td>
                      <td className="p-6">
                        <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase bg-amber-100 text-amber-700 border border-amber-200">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-xs italic"
                    >
                      No Pending Appointments for Today
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
