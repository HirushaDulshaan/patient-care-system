import React, { useState } from 'react';
import { Search, Stethoscope, Star, ArrowRight, Filter, MapPin, GraduationCap } from 'lucide-react';

const SpecialistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Cardiology', 'Neurology', 'ENT', 'VOG', 'Pediatrics'];

  const specialists = [
    { id: 1, name: 'Ruwan Kumara', specialty: 'Cardiology', degree: 'MBBS, MD', experience: '12+ Years', hospital: 'General Hospital', bio: 'Expert in non-invasive cardiology and heart health management.' },
    { id: 2, name: 'Jones Perera', specialty: 'Neurologist', degree: 'MBBS, FRCS', experience: '8 Years', hospital: 'Teaching Hospital', bio: 'Specializing in brain disorders and nervous system treatments.' },
    { id: 3, name: 'Kamala Silva', specialty: 'VOG', degree: 'MBBS, DGO', experience: '15+ Years', hospital: 'Lanka Hospital', bio: 'Dedicated to women\'s health and maternal care.' },
    { id: 4, name: 'Nimal Siriwardena', specialty: 'ENT', degree: 'MBBS, MS', experience: '10 Years', hospital: 'Nawaloka Hospital', bio: 'Specialist in ear, nose, and throat surgical procedures.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- Page Header --- */}
      <div className="bg-white pt-20 pb-16 px-10 rounded-b-[4rem] shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto text-center space-y-4">
           <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em]">Medical Excellence</p>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900">Meet Our <span className="text-blue-600 italic">Specialists.</span></h1>
           <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-sm">
             Consult with top-tier medical professionals in Sri Lanka. Our doctors are board-certified and dedicated to your well-being.
           </p>

           {/* Search & Filter Bar (More Defined) */}
           <div className="max-w-3xl mx-auto mt-10 bg-white p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 relative w-full">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                 <input 
                    type="text" 
                    placeholder="Search by Doctor's Name..." 
                    className="w-full pl-14 pr-4 py-4 bg-transparent outline-none font-bold text-sm text-slate-700"
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <button className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95">
                 <Filter size={14}/> Set Filters
              </button>
           </div>
        </div>
      </div>

      {/* --- Category Selector (Floating Look) --- */}
      <div className="max-w-7xl mx-auto px-10 mt-[-30px] z-10 relative">
         <div className="flex gap-3 overflow-x-auto no-scrollbar py-6 justify-center">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 shadow-sm'}`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      {/* --- Specialist Grid (Higher Contrast against Gray BG) --- */}
      <div className="max-w-7xl mx-auto px-10 mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
         {specialists
           .filter(doc => (activeCategory === 'All' || doc.specialty === activeCategory) && doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
           .map((doc) => (
           <div key={doc.id} className="bg-white rounded-[3.5rem] border border-white p-10 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group flex flex-col md:flex-row gap-8 relative overflow-hidden">
              
              {/* Doctor Visual */}
              <div className="w-full md:w-48 aspect-square bg-slate-50 rounded-[2.5rem] overflow-hidden relative border border-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                 <Stethoscope size={64} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                 <div className="absolute bottom-4 inset-x-4 bg-white p-2 rounded-xl text-center shadow-sm">
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{doc.experience}</p>
                 </div>
              </div>

              {/* Doctor Details */}
              <div className="flex-1 space-y-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <h3 className="text-2xl font-black text-slate-800 tracking-tight">Dr. {doc.name}</h3>
                       <span className="inline-block bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-md mt-1 italic tracking-widest">
                          {doc.specialty}
                       </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl">
                       <Star size={12} fill="currentColor" /> <span className="text-[11px] font-black">4.9</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                       <div className="p-1.5 bg-slate-50 rounded-lg"><GraduationCap size={14} /></div>
                       <span className="text-[10px] font-bold uppercase">{doc.degree}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                       <div className="p-1.5 bg-slate-50 rounded-lg"><MapPin size={14} /></div>
                       <span className="text-[10px] font-bold uppercase truncate">{doc.hospital}</span>
                    </div>
                 </div>

                 <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2">
                    {doc.bio}
                 </p>

                 <div className="pt-4 flex gap-3">
                    <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                       Book Now
                    </button>
                    <button className="px-5 py-4 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-colors">
                       <ArrowRight size={18} />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
};

export default SpecialistDirectory;