import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Download, Filter, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FinancialReports = () => {
  const [reportType, setReportType] = useState('Monthly');

  // Summary Data
  const summary = [
    { label: "Total Revenue", value: "Rs. 1,240,500", change: "+15.2%", trend: "up" },
    { label: "Total Expenses", value: "Rs. 450,200", change: "-2.4%", trend: "down" },
    { label: "Net Profit", value: "Rs. 790,300", change: "+18.1%", trend: "up" },
    { label: "Pending Bills", value: "Rs. 45,000", change: "+5.0%", trend: "up" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* --- Top Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Performance</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">
            Confidential // Super Admin Access Only
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
             {['Daily', 'Weekly', 'Monthly'].map(t => (
               <button 
                key={t}
                onClick={() => setReportType(t)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${reportType === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
               >
                 {t}
               </button>
             ))}
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black hover:bg-blue-600 transition-all flex items-center gap-2">
            <Download size={14} /> EXPORT STATS
          </button>
        </div>
      </div>

      {/* --- Quick Insight Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{item.value}</h3>
            <div className={`mt-4 flex items-center gap-1.5 text-[10px] font-black ${item.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
               {item.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
               <span>{item.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- Left: Revenue Chart Placeholder (8 Columns) --- */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
             <h4 className="text-xl font-black text-slate-800">Revenue Growth</h4>
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Consultations</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Lab Tests</span>
                </div>
             </div>
          </div>
          
          {/* Chart Graphic Placeholder */}
          <div className="h-64 w-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex items-end justify-around px-10 pb-6">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-8 bg-blue-600 rounded-t-xl opacity-20 hover:opacity-100 transition-all cursor-pointer group relative">
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                        Rs.{h}k
                     </div>
                  </div>
                ))}
             </div>
             <p className="text-slate-300 font-bold text-sm z-10 uppercase tracking-widest italic">Live Revenue Visualization</p>
          </div>
        </div>

        {/* --- Right: Category Breakdown (4 Columns) --- */}
        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10">Income by Source</h4>
          
          <div className="space-y-8">
            {[
              { label: "OPD Sessions", percent: 65, color: "bg-blue-500" },
              { label: "Specialist Charges", percent: 20, color: "bg-emerald-500" },
              { label: "Laboratory Fees", percent: 10, color: "bg-amber-500" },
              { label: "Other Pharmacy", percent: 5, color: "bg-rose-500" },
            ].map((source, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{source.label}</span>
                  <span>{source.percent}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className={`${source.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${source.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-white/5 text-center">
             <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Financial Year 2026/27</p>
          </div>
        </div>

      </div>

      {/* --- Recent Transactions Table --- */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h4 className="text-xl font-black text-slate-800">Recent Transactions</h4>
            <button className="text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600">View All Invoices</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="p-6">Invoice ID</th>
                     <th className="p-6">Patient / Client</th>
                     <th className="p-6">Source</th>
                     <th className="p-6">Amount</th>
                     <th className="p-6 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { id: "INV-9021", name: "Sunil Peiris", source: "OPD Consultation", amount: "Rs. 2,500", status: "Paid" },
                    { id: "INV-9022", name: "Kamala Silva", source: "Specialist VOG", amount: "Rs. 4,500", status: "Paid" },
                    { id: "INV-9023", name: "Nimal Perera", source: "Lab Report", amount: "Rs. 1,200", status: "Pending" },
                  ].map((inv, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition font-medium">
                       <td className="p-6 text-sm font-bold text-slate-400">{inv.id}</td>
                       <td className="p-6 text-sm font-black text-slate-800">{inv.name}</td>
                       <td className="p-6 text-[10px] font-black text-slate-500 uppercase">{inv.source}</td>
                       <td className="p-6 text-sm font-black text-blue-600">{inv.amount}</td>
                       <td className="p-6 text-right">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {inv.status}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FinancialReports;