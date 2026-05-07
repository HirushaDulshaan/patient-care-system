import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import {
  Search, Stethoscope, Star, ArrowRight,
  MapPin, GraduationCap, Loader2
} from "lucide-react";

const GET_DATA = gql`
  query GetSpecialistsAndCategories {
    getAllDoctors {
      id
      firstName
      lastName
      education
      workingHospital
      category {
        id
        name
      }
    }
  }
`;

const SpecialistDirectory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, loading, error } = useQuery(GET_DATA);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing Specialist Registry...</p>
    </div>
  );

  const doctors = data?.getAllDoctors || [];
  const categories = ["All", ...new Set(doctors.map((d: any) => d.category.name))];

  const filteredDoctors = doctors.filter((doc: any) => {
    const matchesCategory = activeCategory === "All" || doc.category.name === activeCategory;
    const matchesSearch = `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Page Header */}
      <div className="bg-white pt-20 pb-16 px-10 rounded-b-[4rem] shadow-sm border-b border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em]">
            Healthcare Portal
          </p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">
            Meet Our <span className="text-blue-600 italic">Specialists.</span>
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm">
            Book appointments with over {doctors.length} verified medical experts across Sri Lanka.
          </p>

          <div className="max-w-3xl mx-auto mt-10 bg-white p-2 rounded-full shadow-2xl shadow-blue-500/5 border border-slate-200 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
              <input
                type="text"
                placeholder="Search by specialist name..."
                className="w-full pl-14 pr-4 py-4 bg-transparent outline-none font-bold text-sm text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95">
              SEARCH PHYSICIAN
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Category Selector */}
      <div className="max-w-7xl mx-auto px-10 mt-[-30px] z-10 relative">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-6 justify-center">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200" : "bg-white text-slate-400 border-slate-100 hover:border-blue-200 shadow-sm"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Specialist Grid */}
      <div className="max-w-7xl mx-auto px-10 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredDoctors.length > 0 ? filteredDoctors.map((doc: any) => (
          <div
            key={doc.id}
            className="bg-white rounded-[3.5rem] border border-slate-100 p-10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col md:flex-row gap-8 relative overflow-hidden"
          >
            {/* Doctor Visual */}
            <div className="w-full md:w-48 aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden relative border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
              <Stethoscope size={64} className="text-slate-200 group-hover:text-white group-hover:scale-110 transition-all" />
              <div className="absolute bottom-4 inset-x-4 bg-white p-2 rounded-xl text-center shadow-sm">
                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                  Verified Expert
                </p>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Dr. {doc.firstName} {doc.lastName}
                  </h3>
                  <span className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-3 py-1 rounded-lg mt-1 italic tracking-widest border border-blue-100">
                    {doc.category.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl">
                  <Star size={12} fill="currentColor" />
                  <span className="text-[11px] font-black">5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <GraduationCap size={16} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 leading-none">
                    {doc.education}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <MapPin size={16} className="text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight text-slate-500 leading-none">
                    {doc.workingHospital || "Primary Care Center"}
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-medium line-clamp-2 italic">
                Leading specialist focused on patient-centered care and modern medical solutions.
              </p>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => navigate('/book-appointment')}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                >
                  Book Session
                </button>
                <button className="px-6 py-5 bg-slate-50 rounded-[1.8rem] text-slate-300 hover:text-blue-600 hover:bg-blue-50 transition-all group-hover:border-blue-100 border border-transparent">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-slate-300 font-bold italic">No specialists found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialistDirectory;
