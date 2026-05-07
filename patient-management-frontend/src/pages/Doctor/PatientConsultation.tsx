import { useState, useEffect } from "react";
import {
  Search,
  History,
  FileText,
  Pill,
  Calendar,
  User,
  ArrowRight,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";

const GET_PATIENT_RECORDS = gql`
  query GetPatientByNIC($nic: String!) {
    getPatientByNIC(nic: $nic) {
      id
      fullName
      phone
      nic
      medicalRecords {
        id
        createdAt
        complaint
        diagnosis
        specialAdvice
        weight
        age
        prescriptions {
          drugName
          dosage
          frequency
        }
      }
    }
  }
`;

const PatientConsultation = () => {
  const [nicSearch, setNicSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [fetchRecords, { data, loading, error }] =
    useLazyQuery(GET_PATIENT_RECORDS);

  const patientData = data?.getPatientByNIC;
  const medicalHistory = patientData?.medicalRecords || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nicSearch.trim()) {
      fetchRecords({ variables: { nic: nicSearch } });
      setSelectedRecord(null); 
    }
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-500">
      {/* --- TOP: Patient Search & Identity --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <form onSubmit={handleSearch} className="relative w-full md:w-1/2">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={20}
          />
          <input
            type="text"
            value={nicSearch}
            placeholder="Enter Patient NIC to Load History..."
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            onChange={(e) => setNicSearch(e.target.value)}
          />
          {loading && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-500"
              size={20}
            />
          )}
        </form>

        {patientData ? (
          <div className="flex items-center gap-6 bg-slate-900 p-4 rounded-[2rem] text-white w-full md:w-auto shadow-xl">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black uppercase">
              {patientData.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-none">
                {patientData.fullName}
              </h3>
              <p className="text-[10px] font-medium opacity-70 mt-1">
                NIC: {patientData.nic} • {patientData.phone}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <div className="text-right">
              <p className="text-[9px] font-black uppercase opacity-60 tracking-widest">
                Total Visits
              </p>
              <p className="text-sm font-black text-blue-400">
                {medicalHistory.length}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-xs font-bold italic flex items-center gap-2">
            <AlertCircle size={14} /> Enter NIC and press Enter to load profile
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold">
          Error loading history: {error.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)]">
        {/* --- LEFT: Previous Visit History --- */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-2">
            <History className="text-blue-600" size={18} />
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              Medical History
            </h4>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {medicalHistory.length > 0 ? (
              medicalHistory.map((record: any) => (
                <button
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all group ${selectedRecord?.id === record.id ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-200" : "bg-slate-50 border-slate-50 hover:border-blue-200"}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${selectedRecord?.id === record.id ? "text-white" : "text-slate-400"}`}
                    >
                      {new Date(record.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight
                      size={14}
                      className={
                        selectedRecord?.id === record.id
                          ? "text-white"
                          : "text-slate-300"
                      }
                    />
                  </div>
                  <p
                    className={`font-bold text-sm line-clamp-1 ${selectedRecord?.id === record.id ? "text-white" : "text-slate-800"}`}
                  >
                    {record.diagnosis}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${selectedRecord?.id === record.id ? "text-blue-100" : "text-slate-500"}`}
                  >
                    Weight: {record.weight || "N/A"}
                  </p>
                </button>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
                <Activity size={40} className="mb-4 opacity-10" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                  No records found for this patient
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT: Full Record Details --- */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {selectedRecord ? (
            <div className="flex-1 overflow-y-auto p-10 animate-in slide-in-from-right-4 duration-500">
              {/* Header of Record */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight">
                    {selectedRecord.diagnosis}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Calendar size={14} />{" "}
                      {new Date(selectedRecord.createdAt).toLocaleString()}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-xs font-bold text-blue-600">
                      Age: {selectedRecord.age}
                    </span>
                  </div>
                </div>
                <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <FileText size={24} />
                </button>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                    <Activity size={14} className="text-blue-600" /> Patient
                    Complaint
                  </h5>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {selectedRecord.complaint}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Pill size={14} className="text-emerald-500" /> Prescribed
                    Medication
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecord.prescriptions.map((med: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm">
                            <Pill size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-800">
                              {med.drugName}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-medium">
                              {med.dosage}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-white text-[9px] font-black text-emerald-700 rounded-full border border-emerald-100">
                          {med.frequency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRecord.specialAdvice && (
                  <div className="pt-6 border-t border-slate-50">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Doctor's Advice
                    </h5>
                    <p className="text-sm font-bold text-slate-800 italic underline decoration-blue-200 underline-offset-4 font-serif">
                      "{selectedRecord.specialAdvice}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 text-center">
              <History size={64} className="mb-4 opacity-10" />
              <h4 className="text-xl font-black uppercase tracking-widest">
                Medical Archive
              </h4>
              <p className="text-sm font-medium mt-2 italic">
                Select a visit record to view clinical details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientConsultation;
