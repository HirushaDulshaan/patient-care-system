import { useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { ShieldAlert, Terminal, Fingerprint, Search, Download, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

const GET_AUDIT_LOGS = gql`
  query GetSecurityLogs {
    getSecurityLogs {
      id
      time: createdAt
      type
      user: userEmail
      action
      target
      status
      ipAddress
    }
  }
`;

const SecurityAuditLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading } = useQuery(GET_AUDIT_LOGS, {
    pollInterval: 5000, 
  });

  const auditData = data?.getSecurityLogs || [];

  // Search filter
  const filteredLogs = auditData.filter((log: any) => 
    log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans bg-slate-50 min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 shadow-inner">
            <ShieldAlert size={30} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security Terminal</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Node_01 Encryption Active</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-right">
           <div className="border-r pr-6 border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status</p>
              <p className="text-emerald-500 font-extrabold text-lg flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> ENCRYPTED
              </p>
           </div>
           <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black hover:bg-blue-600 transition-all flex items-center gap-2">
            <Download size={14} /> EXPORT CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-100 h-[calc(100vh-250px)] flex flex-col">
        {/* Search Bar Header */}
        <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
           <div className="flex items-center gap-3 relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search by User, Action or IP..." 
                className="w-full bg-white p-3.5 pl-12 rounded-2xl border border-slate-100 text-xs font-mono outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {/* Logs Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {loading && <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>}
          
          {filteredLogs.map((log: any) => (
            <div key={log.id} className="grid grid-cols-12 gap-4 items-center p-4 rounded-2xl hover:bg-slate-50 transition-all font-mono border border-transparent hover:border-slate-100">
              <div className="col-span-2 flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-bold">
                  {new Date(log.time).toLocaleTimeString()}
                </span>
                <span className={`text-[8px] px-2.5 py-1 rounded-md font-black ${
                  log.type === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {log.type}
                </span>
              </div>
              <div className="col-span-3">
                <span className="text-[11px] text-slate-800 font-bold">{log.user || log.ipAddress || 'Unknown'}</span>
              </div>
              <div className="col-span-5 text-[11px]">
                <span className="text-emerald-600 font-bold uppercase">{log.action}</span>
                <span className="text-slate-300 mx-2">-{'>'}</span>
                <span className="text-slate-400 italic">{log.target}</span>
              </div>
              <div className="col-span-2 text-right">
                <span className={`text-[10px] font-black uppercase ${
                  log.status === 'Success' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityAuditLogs;