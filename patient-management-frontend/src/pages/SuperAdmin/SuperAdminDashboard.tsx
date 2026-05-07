import React from "react";
import { gql } from "@apollo/client";
import {
  Users,
  Activity,
  DollarSign,
  ShieldAlert,
  Database,
  Server,
  Clock,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { useLazyQuery, useQuery } from "@apollo/client/react";

const GET_SUPERADMIN_OVERVIEW = gql`
  query GetSuperAdminOverview($date: String!) {
    getFinancialReports(type: "Daily") {
      totalRevenue
      totalCompleted
    }

    getAllDoctorInsights(date: $date) {
      id
    }

    getSecurityLogs {
      id
      user: userEmail
      action
      time: createdAt
      status
    }
  }
`;

const SuperAdminDashboard = () => {
  const today = new Date().toISOString().split("T")[0];

  const { data, loading, error } = useQuery(GET_SUPERADMIN_OVERVIEW, {
    variables: { date: today },
    pollInterval: 10000,
  });

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  const finance = data?.getFinancialReports;
  const securityLogs = data?.getSecurityLogs?.slice(0, 4) || [];
  const doctorCount = data?.getAllDoctorInsights?.length || 0;

  const quickStats = [
    {
      label: "Today's Revenue",
      value: `Rs. ${finance?.totalRevenue.toLocaleString()}`,
      change: "+12%",
      icon: <DollarSign className="text-emerald-500" />,
    },
    {
      label: "Registered Doctors",
      value: doctorCount.toString(),
      change: "Active",
      icon: <Activity className="text-blue-500" />,
    },
    {
      label: "Daily Appointments",
      value: finance?.totalCompleted.toString(),
      change: "Live",
      icon: <Users className="text-purple-500" />,
    },
    {
      label: "System Alerts",
      value: "02",
      change: "Stable",
      icon: <ShieldAlert className="text-red-500" />,
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      {/* --- Header Section --- */}
      <div className="flex justify-between items-center bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="relative z-10">
          <p className="text-blue-400 font-black text-[9px] uppercase tracking-[0.3em] mb-2">
            Operational Command
          </p>
          <h2 className="text-4xl font-black tracking-tighter">
            System Console
          </h2>
          <p className="text-slate-500 font-medium mt-1 text-xs">
            Logged:{" "}
            <span className="text-slate-300">Hirusha Dulshan (Root)</span>
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] text-center min-w-[140px] backdrop-blur-md">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
              API Latency
            </p>
            <p className="text-xl font-black text-emerald-400">08ms</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] text-center min-w-[140px] backdrop-blur-md">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Core Engine
            </p>
            <p className="text-xl font-black text-blue-400">Online</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {stat.icon}
              </div>
              <span className="text-[9px] font-black px-3 py-1 rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600">
                {stat.change}
              </span>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- Left: Security Logs (Live) --- */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
            <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <ShieldAlert className="text-rose-500" /> Security Audit
            </h4>
            <span className="flex items-center gap-2 text-[9px] font-black text-emerald-500 bg-emerald-50 px-4 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>{" "}
              LIVE MONITORING
            </span>
          </div>

          <div className="space-y-4">
            {securityLogs.length > 0 ? (
              securityLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all group cursor-default"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-slate-800 text-sm">
                          {log.user || "System"}
                        </p>
                        <span
                          className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${log.status === "Success" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {log.action}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-400 font-mono">
                    {new Date(log.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center p-10 text-slate-300 font-bold italic">
                No recent logs detected.
              </p>
            )}
          </div>
        </div>

        {/* --- Right: Health & Diagnostics --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Database size={14} className="text-blue-500" /> Database
                Integrity
              </h4>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-tighter">
                    <span className="text-slate-400">Query Optimization</span>
                    <span className="text-emerald-400">98% Efficient</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full">
                    <div className="bg-emerald-500 w-[98%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold mb-2 uppercase tracking-tighter">
                    <span className="text-slate-400">Cloud Sync Status</span>
                    <span className="text-blue-400">Fully Synced</span>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full">
                    <div className="bg-blue-500 w-[100%] h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  </div>
                </div>
              </div>
            </div>
            <Server
              size={180}
              className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"
            />
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[300px]">
            <div>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                Diagnostics Terminal
              </h4>
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl">
                <p className="text-[10px] font-bold text-blue-700 leading-relaxed italic">
                  "All clinical modules operating within normal parameters. No
                  latency bottlenecks detected in last 24h cycle."
                </p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
              Force System Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
