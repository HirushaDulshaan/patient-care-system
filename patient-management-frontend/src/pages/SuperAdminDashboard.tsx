import React from 'react';
import { 
  Users, Activity, DollarSign, ShieldAlert, 
  Database, Server, ArrowUpRight, Clock 
} from 'lucide-react';

const SuperAdminDashboard = () => {
  // Stats summary for the top bar
  const quickStats = [
    { label: "Total Revenue", value: "Rs. 245,000", change: "+12%", icon: <DollarSign className="text-emerald-500" /> },
    { label: "Active Doctors", value: "18", change: "Live Now", icon: <Activity className="text-blue-500" /> },
    { label: "Total Patients", value: "1,240", change: "+45 Today", icon: <Users className="text-purple-500" /> },
    { label: "Security Logs", value: "03", change: "Urgent", icon: <ShieldAlert className="text-red-500" /> },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-sans">
      
      {/* --- Top Header & Welcome --- */}
      <div className="flex justify-between items-center bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black tracking-tight">System Command Center</h2>
          <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest">
            Logged in as: <span className="text-blue-400">Super Administrator (Hirusha)</span>
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Server Latency</p>
            <p className="text-lg font-black text-emerald-400">14ms</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl text-center min-w-[120px]">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">DB Status</p>
            <p className="text-lg font-black text-blue-400">Stable</p>
          </div>
        </div>
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full"></div>
      </div>

      {/* --- Quick Insight Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-slate-900 group-hover:text-white transition-colors duration-500">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Left: Real-time Security Audit (8 Columns) --- */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
             <h4 className="text-xl font-black text-slate-800 flex items-center gap-3">
               <ShieldAlert className="text-red-500" /> Security Audit Log
             </h4>
             <button className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">EXPORT LOGS</button>
          </div>
          
          <div className="space-y-4">
            {[
              { user: "Hirusha D.", role: "Staff", action: "Accessed Patient Record", target: "Sunil Peiris", time: "14:22" },
              { user: "System", role: "Database", action: "Automatic Backup Complete", target: "Cloud Storage", time: "14:00" },
              { user: "Kasun P.", role: "Reception", action: "Updated Billing Record", target: "INV-2901", time: "13:45" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center font-black text-slate-300 group-hover:text-blue-500 transition">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-slate-800 text-sm">{log.user}</p>
                       <span className="text-[8px] bg-slate-200 px-1.5 py-0.5 rounded font-black text-slate-500 uppercase">{log.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{log.action} <span className="text-blue-600 font-bold">→ {log.target}</span></p>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-400">{log.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Right: Server & DB Health (4 Columns) --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Database size={14} className="text-blue-500" /> Database Health
                </h4>
                <div className="space-y-6">
                   <div>
                      <div className="flex justify-between text-[10px] font-bold mb-2">
                         <span className="text-slate-400">Query Speed</span>
                         <span className="text-emerald-400">Fast (8ms)</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-emerald-500 w-[90%] h-full rounded-full"></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-[10px] font-bold mb-2">
                         <span className="text-slate-400">Cloud Storage</span>
                         <span className="text-blue-400">12.8 GB / 50 GB</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full"><div className="bg-blue-500 w-[35%] h-full rounded-full"></div></div>
                   </div>
                </div>
             </div>
             {/* Tech Grid Background Deco */}
             <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                <Server size={150} />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-[280px]">
             <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Alerts</h4>
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                     ⚠️ Warning: High number of GraphQL query retries detected in Reception Module.
                   </p>
                </div>
             </div>
             <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                Run Diagnostic
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SuperAdminDashboard;