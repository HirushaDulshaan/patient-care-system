import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Search,
  Calendar as CalendarIcon,
  Clock,
  Users,
  X,
} from "lucide-react";


const GET_DOCTORS_FOR_ROSTER = gql`
  query GetDoctorsForRoster {
    getAllDoctors {
      id
      firstName
      lastName
      category {
        name
      }
      schedules {
        id
        workingDate
        startTime
        endTime
        status
        maxPatients
        bookedCount
        remainingSeats
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    getAllDoctorCategories {
      id
      name
    }
  }
`;

const DoctorRoster = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedDocForDetails, setSelectedDocForDetails] = useState<any>(null);

  // --- Data Fetching ---
  const { data: docData, loading: docLoading } = useQuery(
    GET_DOCTORS_FOR_ROSTER,
  );
  const { data: catData } = useQuery(GET_CATEGORIES);

  
  const getDayFromDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const selectedDay = getDayFromDate(dateFilter);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-white">
          <h2 className="text-3xl font-black mb-2 tracking-tight">
            Doctor Availability Master List
          </h2>
          <p className="text-slate-400 font-medium">
            Real-time synchronization with clinical registry.
          </p>
        </div>

        {/* Filter Section */}
        <div className="p-6 bg-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-200">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Dr. Name..."
              className="w-full pl-12 p-4 rounded-2xl shadow-sm outline-none border border-transparent focus:border-blue-500 transition-all font-bold"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="p-4 rounded-2xl shadow-sm outline-none font-black text-[10px] uppercase tracking-widest text-slate-700 cursor-pointer"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Specializations</option>
            {catData?.getAllDoctorCategories?.map((cat: any) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="p-4 rounded-2xl shadow-sm outline-none font-bold text-slate-700 cursor-pointer"
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black border-b tracking-[0.2em]">
                <th className="p-6 text-center">Master Registry</th>
                <th className="p-6">Specialization</th>
                <th className="p-6">Roster View</th>
                <th className="p-6 text-center">
                  Status ({dateFilter || "Any Date"})
                </th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center font-black text-slate-300 uppercase tracking-widest animate-pulse"
                  >
                    Connecting to Registry...
                  </td>
                </tr>
              ) : (
                docData?.getAllDoctors
                  ?.filter((doc: any) => {
                    const matchesName = `${doc.firstName} ${doc.lastName}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase());
                    const matchesCategory =
                      categoryFilter === "All" ||
                      doc.category.name === categoryFilter;
                    const matchesDate =
                      !dateFilter ||
                      doc.schedules.some(
                        (s: any) => s.workingDate.split("T")[0] === dateFilter,
                      );
                    return matchesName && matchesCategory && matchesDate;
                  })
                  .map((doc: any) => {
                    const activeSession = doc.schedules.find(
                      (s: any) => s.workingDate.split("T")[0] === dateFilter,
                    );

                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-blue-50/30 transition group"
                      >
                        <td className="p-6">
                          <button
                            onClick={() => setSelectedDocForDetails(doc)}
                            className="font-black text-slate-900 text-lg hover:text-blue-600 transition-colors text-left block"
                          >
                            Dr. {doc.firstName} {doc.lastName}
                          </button>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 italic">
                            Consultant Physician
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black uppercase text-[9px] tracking-widest border border-blue-100">
                            {doc.category?.name}
                          </span>
                        </td>
                        <td className="p-6 text-center">
                          <button
                            onClick={() => setSelectedDocForDetails(doc)}
                            className="text-[9px] bg-slate-800 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
                          >
                            Full Roster
                          </button>
                        </td>
                        <td className="p-6 text-center">
                          {activeSession ? (
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-lg">
                                Available
                              </span>
                              <span className="text-xs font-bold text-slate-500 italic">
                                {activeSession.startTime}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="p-6 text-right">
                          <button
                            disabled={
                              !activeSession ||
                              activeSession.remainingSeats === 0
                            }
                            className={`px-8 py-3 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${
                              activeSession && activeSession.remainingSeats > 0
                                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                            }`}
                          >
                            Quick Book
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL POPUP: Full Weekly Schedule --- */}
      {selectedDocForDetails && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
            <div className="bg-slate-900 p-10 text-white relative">
              <button
                onClick={() => setSelectedDocForDetails(null)}
                className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all group"
              >
                <X size={24} className="group-rotate-90 transition-transform" />
              </button>
              <div className="space-y-1">
                <h3 className="text-3xl font-black tracking-tighter">
                  Dr. {selectedDocForDetails.firstName}{" "}
                  {selectedDocForDetails.lastName}
                </h3>
                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.3em]">
                  {selectedDocForDetails.category.name} Specialist
                </p>
              </div>
            </div>

            <div className="p-10">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  Verified Roster Schedule
                </h4>
                <div className="w-8 h-1 bg-blue-600 rounded-full"></div>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDocForDetails.schedules.length > 0 ? (
                  selectedDocForDetails.schedules.map(
                    (session: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <CalendarIcon size={18} />
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm">
                              {new Date(session.workingDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-0.5">
                              <Clock size={12} /> {session.startTime} -{" "}
                              {session.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm ${
                              session.remainingSeats > 0
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {session.remainingSeats} Slots Left
                          </span>
                        </div>
                      </div>
                    ),
                  )
                ) : (
                  <p className="text-center py-10 text-slate-400 font-bold italic">
                    No active sessions found for this consultant.
                  </p>
                )}
              </div>

              <div className="mt-10 flex gap-4">
                <button
                  onClick={() => setSelectedDocForDetails(null)}
                  className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                >
                  Close Registry
                </button>
                <button className="flex-[2] py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3">
                  Issue Token <Users size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRoster;
