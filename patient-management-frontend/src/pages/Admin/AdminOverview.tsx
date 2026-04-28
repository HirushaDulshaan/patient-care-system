import React from 'react';
import { Users, Calendar, Activity, DollarSign, Clock, CheckCircle } from 'lucide-react'; // Icons use karamu

const AdminOverview = () => {
  // Dummy Data for Insights
  const stats = [
    { label: "Today's Appointments", value: "48", icon: <Calendar className="w-6 h-6 text-blue-500" />, color: "blue" },
    { label: "Available Doctors", value: "12", icon: <Activity className="w-6 h-6 text-emerald-500" />, color: "emerald" },
    { label: "Daily Revenue", value: "Rs. 85,250", icon: <DollarSign className="w-6 h-6 text-amber-500" />, color: "amber" },
    { label: "Active Staff", value: "08", icon: <Users className="w-6 h-6 text-purple-500" />, color: "purple" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* --- Welcome Header --- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Insights</h2>
          <p className="text-slate-500 font-medium mt-1">Real-time statistics for <span className="text-blue-600 font-bold">Super Admin</span></p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Date</p>
           <p className="font-bold text-slate-800">April 28, 2026</p>
        </div>
      </div>

      {/* --- Top Insight Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center mb-6`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- Recent Activity / Live Sessions --- */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
             <h4 className="text-xl font-black text-slate-800">Live Doctor Sessions</h4>
             <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">● Online Now</span>
          </div>
          
          <div className="space-y-4">
            {[
              { doc: "Dr. Ruwan Kumara", room: "101", status: "In Session", patients: "12/20" },
              { doc: "Dr. Jones Perera", room: "102", status: "Active", patients: "05/15" },
              { doc: "Dr. Kamala Silva", room: "305", status: "On Break", patients: "08/10" },
            ].map((session, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center font-bold text-slate-400">DR</div>
                  <div>
                    <p className="font-bold text-slate-800">{session.doc}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Room {session.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-blue-600">{session.status}</p>
                  <p className="text-[10px] font-bold text-slate-400">{session.patients} Slots filled</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Staff Performance Summary --- */}
        <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full"></div>
          
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left font-bold text-sm hover:bg-white/10 transition">
                Generate Monthly Report
              </button>
              <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left font-bold text-sm hover:bg-white/10 transition">
                Send Notification to Staff
              </button>
              <button className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-left font-bold text-sm hover:bg-white/10 transition">
                System Backup (Cloud)
              </button>
            </div>
          </div>

          <div className="mt-12 bg-blue-600 p-6 rounded-[2rem]">
             <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">System Health</p>
             <div className="flex justify-between items-end">
                <h5 className="text-2xl font-black">Stable</h5>
                <p className="text-[10px] font-bold">Ver 1.0.4</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;