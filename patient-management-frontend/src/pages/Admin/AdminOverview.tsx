import React from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  Users,
  Calendar,
  Activity,
  Clock,
  UserCheck,
  Briefcase,
  RefreshCcw,
  Loader2,
} from "lucide-react";

const GET_ADMIN_OPERATIONS_INSIGHTS = gql`
  query GetAdminOperations($date: String!) {
    
    getAdminSystemStats {
      totalDoctors
      totalStaff
      todayAppointments
      activeNow
    }
    
    getAllDoctorInsights(date: $date) {
      id
      firstName
      lastName
      specialization
      appointments {
        id
      }
    }
  }
`;

const AdminOverview = () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, loading, refetch } = useQuery(GET_ADMIN_OPERATIONS_INSIGHTS, {
    variables: { date: today },
    pollInterval: 15000, 
  });

  if (loading && !data)
    return (
      <div className="h-96 flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="ml-3 font-bold text-slate-400 italic uppercase tracking-widest text-xs">
          Syncing Ops Hub...
        </span>
      </div>
    );

  
  const systemStats = data?.getAdminSystemStats;
  const doctorsList = data?.getAllDoctorInsights || [];

  
  const stats = [
    {
      label: "Today's Appointments",
      value: systemStats?.todayAppointments || 0,
      icon: <Calendar className="text-blue-500" />,
    },
    {
      label: "Total Doctors",
      value: systemStats?.totalDoctors || 0,
      icon: <Activity className="text-emerald-500" />,
    },
    {
      label: "Hospital Staff",
      value: systemStats?.totalStaff || 0,
      icon: <Users className="text-purple-500" />,
    },
    {
      label: "Physicians On-Duty",
      value: systemStats?.activeNow || 0,
      icon: <UserCheck className="text-amber-500" />,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Operation Hub
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Monitoring{" "}
            <span className="text-blue-600 font-bold">Staff & Sessions</span> in
            Real-time
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <RefreshCcw size={14} /> Force Sync
        </button>
      </div>

      {/* --- Insights Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                {stat.icon}
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-lg">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black text-emerald-600 uppercase">
                  Live
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left: Active Doctor Rotations --- */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-50">
            <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <Briefcase className="text-blue-600" /> Current Physician Load
            </h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              {new Date().toDateString()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctorsList.length > 0 ? (
              doctorsList.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {doc.firstName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">
                        Dr. {doc.lastName}
                      </p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        {doc.specialization || "Generalist"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-700">
                      {doc.appointments?.length || 0} Patients
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                        On-Duty
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-10 text-center text-slate-300 font-bold italic border-2 border-dashed border-slate-50 rounded-3xl">
                No active specialist sessions found for today.
              </div>
            )}
          </div>
        </div>

        {/* --- Right: Quick Admin Tools --- */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-10 italic">
                Secure Control
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all flex justify-between items-center group">
                  Sync Medical Roster{" "}
                  <Clock
                    size={14}
                    className="opacity-40 group-hover:opacity-100"
                  />
                </button>
                <button className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-xs hover:bg-blue-600 transition-all flex justify-between items-center group">
                  Audit Staff Attendance{" "}
                  <Users
                    size={14}
                    className="opacity-40 group-hover:opacity-100"
                  />
                </button>
              </div>
            </div>

            <div className="mt-12 bg-white/5 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Internal Node Status
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <h5 className="text-2xl font-black text-emerald-400 tracking-tighter italic">
                    Healthy
                  </h5>
                  <p className="text-[10px] font-medium text-slate-500">
                    Service Latency: 12ms
                  </p>
                </div>
                <Activity className="text-emerald-500 mb-1" size={24} />
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
