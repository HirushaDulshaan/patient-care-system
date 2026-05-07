import React, { useState } from "react";
import {
  Search,
  Key,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  X,
  Loader2,
  Award,
  Mail,
  Phone,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import toast from "react-hot-toast";
// --- GraphQL Queries ---
const GET_ALL_DOCTORS = gql`
  query GetAllDoctors {
    getAllDoctors {
      id
      firstName
      lastName
      category {
        name
      }
      licenseNumber
      user {
        id
        email
        isActive
      }
    }
  }
`;

const APPROVE_DOCTOR = gql`
  mutation ApproveDoctor($userId: String!, $password: String!) {
    approveDoctorAccess(userId: $userId, password: $password)
  }
`;

const SpecialistManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [tempPassword, setTempPassword] = useState("");

  const { data, loading: queryLoading } = useQuery(GET_ALL_DOCTORS);
  const [approveAccess, { loading: approveLoading }] = useMutation(
    APPROVE_DOCTOR,
    {
      refetchQueries: [{ query: GET_ALL_DOCTORS }],
    },
  );

  const handleApproveSubmit = async () => {
    if (tempPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      toast.error("Password must be at least 6 characters!");
      return;
    }
    try {
      await approveAccess({
        variables: { userId: selectedDoc.user.id, password: tempPassword },
      });
      toast.success(
        `Dr. ${selectedDoc.lastName} has been granted system access! ✅`,
      );
      setShowApproveModal(false);
      setTempPassword("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Stethoscope size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                Administrative Portal
              </span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Specialist Management
            </h2>
            <p className="text-slate-500 font-medium mt-1 text-sm">
              Verify physician credentials and manage system login permissions.
            </p>
          </div>

          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="px-6 py-3 border-r border-slate-50">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                Total Specialists
              </p>
              <p className="text-xl font-black text-slate-900">
                {data?.getAllDoctors.length || 0}
              </p>
            </div>
            <div className="px-6 py-3">
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                Pending Approval
              </p>
              <p className="text-xl font-black text-amber-500">
                {data?.getAllDoctors.filter((d: any) => !d.user.isActive)
                  .length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200/60 shadow-sm">
          <div className="relative">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by Doctor's Name, Specialty or License ID..."
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-sm focus:ring-4 focus:ring-blue-500/5 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {queryLoading ? (
            <div className="col-span-full py-20 text-center">
              <Loader2
                className="animate-spin mx-auto text-blue-600"
                size={40}
              />
            </div>
          ) : (
            data?.getAllDoctors
              .filter((doc: any) =>
                `${doc.firstName} ${doc.lastName}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .map((doc: any) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/30 group hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${doc.user.isActive ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {doc.user.isActive ? (
                        <UserCheck size={32} />
                      ) : (
                        <ShieldCheck size={32} />
                      )}
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${doc.user.isActive ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}
                    >
                      {doc.user.isActive ? "Authorized" : "Pending"}
                    </span>
                  </div>

                  <h4 className="text-2xl font-black text-slate-900 leading-tight">
                    Dr. {doc.firstName}
                    <br />
                    {doc.lastName}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
                      {doc.category.name}
                    </span>
                  </div>

                  <div className="mt-8 space-y-4 border-t border-slate-50 pt-8">
                    <div className="flex items-center gap-3 text-slate-500">
                      <Award size={16} />{" "}
                      <span className="text-xs font-bold">
                        SLMC: {doc.licenseNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <Mail size={16} />{" "}
                      <span className="text-xs font-bold">
                        {doc.user.email}
                      </span>
                    </div>
                  </div>

                  {!doc.user.isActive ? (
                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowApproveModal(true);
                      }}
                      className="w-full mt-10 bg-slate-900 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3"
                    >
                      <Key size={16} /> Grant Access
                    </button>
                  ) : (
                    <div className="w-full mt-10 bg-emerald-50 text-emerald-600 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3">
                      <UserCheck size={16} /> System Active
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      </div>

      {/* --- Approve Modal --- */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-200 border border-white">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                Security Clearance
              </h3>
              <p className="text-slate-400 text-sm mt-2 font-medium italic">
                Create a secure login for <b>Dr. {selectedDoc?.lastName}</b>
              </p>
            </div>
            <div className="space-y-6">
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Assign Login Password"
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold focus:ring-4 focus:ring-blue-500/10 transition-all text-center"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveSubmit}
                  disabled={approveLoading}
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {approveLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Activate Portal"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialistManagement;
