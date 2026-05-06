import { useState } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { TrendingUp, TrendingDown, DollarSign, Download, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';

const GET_FINANCIAL_DATA = gql`
  query GetFinancialReports($type: String!) {
    getFinancialReports(type: $type) {
      totalRevenue
      totalExpenses
      netProfit
      totalCompleted
      recentTransactions {
        id
        patientName
        source
        amount
        status
      }
    }
  }
`;

const FinancialReports = () => {
  const [reportType, setReportType] = useState('Monthly');

  const { data, loading, error } = useQuery(GET_FINANCIAL_DATA, {
    variables: { type: reportType },
    pollInterval: 60000, // විනාඩියකට සැරයක් update වේ
  });

  if (loading) return (
    <div className="h-96 flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  const stats = data?.getFinancialReports;

  const summary = [
    { label: "Total Revenue", value: `Rs. ${stats?.totalRevenue.toLocaleString()}`, change: "+12.5%", trend: "up" },
    { label: "Doctor Salaries (Expenses)", value: `Rs. ${stats?.totalExpenses.toLocaleString()}`, change: "+10.2%", trend: "up" },
    { label: "Net Profit (Hospital)", value: `Rs. ${stats?.netProfit.toLocaleString()}`, change: "+18.1%", trend: "up" },
    { label: "Total Consultations", value: stats?.totalCompleted, change: "+5", trend: "up" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Hub</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Real-time Revenue Tracking (LKR 2,500/Visit)
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
        </div>
      </div>

      {/* Quick Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
            <h3 className="text-2xl font-black text-slate-800 mt-2">{item.value}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-emerald-500">
               <ArrowUpRight size={14} />
               <span>{item.change} vs Last {reportType}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mid Section: Chart (Dummy) & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h4 className="text-xl font-black text-slate-800 mb-10">Revenue Growth (Visual)</h4>
          <div className="h-64 w-full bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden">
             {/* Chart bars - මෙතැනට Dummy data දැනට දැම්මා */}
             <div className="absolute inset-0 flex items-end justify-around px-10 pb-6">
                {[30, 50, 45, 80, 65, 90, 75].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="w-8 bg-blue-600 rounded-t-xl opacity-20 hover:opacity-100 transition-all cursor-pointer group">
                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100">Rs.{h}k</div>
                  </div>
                ))}
             </div>
             <p className="text-slate-300 font-black text-xs z-10 uppercase tracking-[0.3em]">Projected vs Actual Revenue</p>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10">Budget Allocation</h4>
          <div className="space-y-8">
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Doctor Payouts (80%)</span>
                  <span>Rs. {stats?.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[80%]"></div>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-slate-400">Hospital Profit (20%)</span>
                  <span>Rs. {stats?.netProfit.toLocaleString()}</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[20%]"></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50">
            <h4 className="text-xl font-black text-slate-800">Live Transaction Log</h4>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                     <th className="p-6">Invoice</th>
                     <th className="p-6">Patient</th>
                     <th className="p-6">Type</th>
                     <th className="p-6">Total (LKR)</th>
                     <th className="p-6 text-right">Verification</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {stats?.recentTransactions.map((inv: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition">
                       <td className="p-6 text-xs font-bold text-slate-400">{inv.id}</td>
                       <td className="p-6 text-sm font-black text-slate-800">{inv.patientName}</td>
                       <td className="p-6 text-[10px] font-black text-slate-500 uppercase">{inv.source}</td>
                       <td className="p-6 text-sm font-black text-blue-600">{inv.amount}.00</td>
                       <td className="p-6 text-right">
                          <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-emerald-50 text-emerald-600">SUCCESS</span>
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