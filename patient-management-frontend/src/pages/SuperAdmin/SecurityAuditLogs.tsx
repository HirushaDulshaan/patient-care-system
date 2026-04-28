import { useState } from 'react';
import { ShieldAlert, Terminal, Clock, Fingerprint, Search, Download, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';

const SecurityAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const auditData = [
    { id: 1, type: 'CRITICAL', user: '192.168.1.5', action: 'Brute Force Attempt', target: 'Auth-Gateway', time: '14:20:05', status: 'Blocked' },
    { id: 2, type: 'INFO', user: 'Hirusha Dulshan', action: 'Grant Access', target: 'User: Kasun P.', time: '13:45:12', status: 'Success' },
    { id: 3, type: 'WARNING', user: 'Sanduni J.', action: 'Data Export', target: 'Finance_Report.csv', time: '12:30:45', status: 'Authorized' },
    { id: 4, type: 'CRITICAL', user: 'Unknown_Node', action: 'Injection Attempt', target: 'Patient-DB', time: '11:15:20', status: 'Denied' },
  ];

  return (
    <div className="space-y-6 font-sans bg-slate-50 min-h-screen p-4 md:p-8">
      
      {/* Header with Risk Indicator */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
            <ShieldAlert size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Audit Terminal</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time Encryption & Access Monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right border-r pr-6 border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Integrity</p>
             <p className="text-emerald-500 font-extrabold text-lg">99.9% SECURE</p>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-blue-600 transition-all flex items-center gap-2">
            <Download size={14} /> EXPORT AUDIT
          </button>
        </div>
      </div>

      {/* --- The Terminal View (UPDATED TO WHITE THEME) --- */}
      <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 h-[calc(100vh-180px)] flex flex-col">
        
        {/* Terminal Nav - Light Gray Header */}
        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
           <div className="flex items-center gap-4 border-r pr-4 border-slate-100">
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Live Security Stream // Node_01</span>
           </div>
           <div className="flex items-center gap-3 relative flex-1 max-w-sm">
              <input 
                type="text" 
                placeholder="Search logs by IP, User or Action..." 
                className="w-full bg-transparent p-3 pl-10 rounded-xl border border-slate-100 text-[11px] text-slate-700 font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-all" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
           </div>
        </div>

        {/* Log Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {auditData.map((log) => (
            <div key={log.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl hover:bg-slate-50 transition-all group font-mono">
              
              {/* Time & Type */}
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-[10px] text-slate-500 font-bold">{log.time}</span>
                <span className={`text-[8px] px-2.5 py-1 rounded-md font-black tracking-tighter ${
                  log.type === 'CRITICAL' ? 'bg-red-50 text-red-600' : 
                  log.type === 'WARNING' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {log.type}
                </span>
              </div>

              {/* Source User */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <Fingerprint size={14} className={log.type === 'CRITICAL' ? 'text-red-500' : 'text-slate-400'} />
                  <span className="text-[11px] text-slate-800 font-bold truncate">{log.user}</span>
                </div>
              </div>

              {/* Action Description */}
              <div className="col-span-5">
                <p className="text-[11px] text-slate-600">
                  <span className="text-emerald-600 font-bold group-hover:text-emerald-700">{log.action}</span>
                  <span className="text-slate-300 mx-2">::</span>
                  <span className="text-slate-400 font-medium italic">target: {log.target}</span>
                </p>
              </div>

              {/* Security Status */}
              <div className="col-span-2 text-right">
                <div className="inline-flex items-center gap-2">
                   {log.status === 'Blocked' || log.status === 'Denied' ? (
                     <AlertTriangle size={12} className="text-red-500" />
                   ) : (
                     <ShieldCheck size={12} className="text-emerald-500" />
                   )}
                   <span className={`text-[10px] font-black uppercase ${
                     log.status === 'Blocked' || log.status === 'Denied' ? 'text-red-500' : 'text-emerald-600'
                   }`}>
                     {log.status}
                   </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Terminal Footer */}
        <div className="bg-slate-50/50 p-4 text-center border-t border-slate-100 mt-auto">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">System Monitoring Active // Node_01 Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditLogs;