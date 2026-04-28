import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, UserCheck, UserX, Search } from 'lucide-react';

const SuperAdminStaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Staff Data with Status
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Kasun Perera", role: "Receptionist", email: "kasun@hosp.com", status: "Pending", joinedDate: "2026-04-20" },
    { id: 2, name: "Sanduni Jayasinghe", role: "Nurse", email: "sanduni@hosp.com", status: "Active", joinedDate: "2026-04-15" },
    { id: 3, name: "Nimal Silva", role: "Pharmacist", email: "nimal@hosp.com", status: "Blocked", joinedDate: "2026-04-10" },
  ]);

  // Status eka toggle karana function eka
  const toggleStatus = (id: number) => {
    setStaffList(staffList.map(member => {
      if (member.id === id) {
        return { ...member, status: member.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return member;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Access Control</h2>
          <p className="text-slate-500 font-medium mt-1">Review registrations and grant system access permissions.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Active: 12</div>
            <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Pending: 04</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search staff by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Staff Member</th>
              <th className="p-6">Role</th>
              <th className="p-6">Joined Date</th>
              <th className="p-6">Current Status</th>
              <th className="p-6 text-right">Login Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {staffList
              .filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-800">{member.name}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                </td>
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    {member.role}
                  </span>
                </td>
                <td className="p-6 text-sm font-medium text-slate-500">{member.joinedDate}</td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'Active' ? 'bg-emerald-500' : 
                      member.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-[10px] font-black uppercase ${
                      member.status === 'Active' ? 'text-emerald-600' : 
                      member.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  {member.status === 'Pending' ? (
                    <button 
                      onClick={() => toggleStatus(member.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                    >
                      Approve Access
                    </button>
                  ) : (
                    <div className="flex items-center justify-end gap-3">
                        <span className="text-[10px] font-bold text-slate-300 uppercase">Toggle Access</span>
                        <button 
                          onClick={() => toggleStatus(member.id)}
                          className={`w-12 h-6 rounded-full relative transition-all ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${member.status === 'Active' ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminStaffManagement;