import React, { useState } from 'react';
import { Search, Key, ShieldCheck, ShieldAlert, UserCheck, X, Loader2 } from 'lucide-react';
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

// --- GraphQL Queries & Mutations ---

const GET_ALL_STAFF = gql`
  query GetAllStaff {
    getAllStaff {
      id
      firstName
      lastName
      designation  # 👈 මේක තියෙනවාද බලන්න
      user {
        id
        email
        isActive  # 👈 මේකත් අනිවාර්යයෙන්ම තියෙන්න ඕනේ
      }
    }
  }
`;

const APPROVE_STAFF = gql`
  mutation ApproveStaff($userId: String!, $password: String!) {
    approveStaffAccess(userId: $userId, password: $password)
  }
`;

const TOGGLE_STATUS = gql`
  mutation ToggleStatus($userId: String!, $status: Boolean!) {
    toggleStaffStatus(userId: $userId, status: $status) {
      id
      isActive
    }
  }
`;

const SuperAdminStaffManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tempPassword, setTempPassword] = useState('');

  // 1. Data Fetching
  const { data, loading: queryLoading } = useQuery(GET_ALL_STAFF);

  // 2. Approve Mutation
  const [approveAccess, { loading: approveLoading }] = useMutation(APPROVE_STAFF, {
    refetchQueries: [{ query: GET_ALL_STAFF }],
    onCompleted: () => {
      alert("Staff Access Approved & Password Assigned! ✅");
      setShowApproveModal(false);
      setTempPassword('');
    }
  });

  // 3. Toggle Status Mutation
  const [toggleStatus] = useMutation(TOGGLE_STATUS, {
    refetchQueries: [{ query: GET_ALL_STAFF }]
  });

  const handleApproveSubmit = async () => {
    if (tempPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }
    try {
      await approveAccess({
        variables: { userId: selectedUser.id, password: tempPassword }
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleStatus({
        variables: { userId, status: !currentStatus }
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-2">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Access Control</h2>
          <p className="text-slate-500 font-medium mt-1">Review registrations and grant system access permissions.</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search staff by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-sm"
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
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Login Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {queryLoading ? (
              <tr><td colSpan={4} className="p-10 text-center font-bold text-slate-400">Loading Directory...</td></tr>
            ) : data?.getAllStaff.filter((s: any) => s.firstName.toLowerCase().includes(searchTerm.toLowerCase())).map((staff: any) => (
              <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-6">
                  <p className="font-bold text-slate-800">{staff.firstName} {staff.lastName}</p>
                  <p className="text-xs text-slate-400">{staff.user.email}</p>
                </td>
                <td className="p-6">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase">
                    {staff.designation}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${staff.user.isActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    <span className={`text-[10px] font-black uppercase ${staff.user.isActive ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {staff.user.isActive ? 'Active' : 'Pending Approval'}
                    </span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  {!staff.user.password ? (
                    <button 
                      onClick={() => { setSelectedUser(staff.user); setShowApproveModal(true); }}
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2 ml-auto"
                    >
                      <Key size={14}/> Grant Access
                    </button>
                  ) : (
                    <div className="flex items-center justify-end gap-3">
                        <span className="text-[9px] font-bold text-slate-300 uppercase">Revoke Access</span>
                        <button 
                          onClick={() => handleStatusChange(staff.user.id, staff.user.isActive)}
                          className={`w-12 h-6 rounded-full relative transition-all ${staff.user.isActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                        >
                            <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${staff.user.isActive ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- APPROVE MODAL --- */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200 border border-white">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40}/>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Security Clearance</h3>
              <p className="text-slate-400 text-sm mt-2 font-medium">Create a secure password for <b>{selectedUser?.email}</b></p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4 mb-3 block">Temporary Login Password</label>
                <div className="relative">
                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="password" 
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full pl-14 p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700"
                    />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApproveSubmit}
                  disabled={approveLoading}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {approveLoading ? <Loader2 className="animate-spin" size={16}/> : "Activate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminStaffManagement;