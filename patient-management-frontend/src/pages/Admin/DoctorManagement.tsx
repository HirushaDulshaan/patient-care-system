import React, { useState } from 'react';
import { Search, GraduationCap, Building2, Edit3, Trash2, MapPin, Mail, Phone } from 'lucide-react';

const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const doctorsList = [
    { id: 1, firstName: "Ruwan", lastName: "Kumara", specialization: "Cardiologist", email: "ruwan@hosp.com", contact: "0712345678", address1: "45, Galle Rd", address2: "Bambalapitiya", city: "Colombo", degree: "MBBS, MD", university: "Colombo", hospital: "General Hospital" },
    { id: 2, firstName: "Jones", lastName: "Perera", specialization: "Neurologist", email: "jones@hosp.com", contact: "0771122334", address1: "12, Main St", address2: "Kandy Road", city: "Kiribathgoda", degree: "MBBS, FRCS", university: "Peradeniya", hospital: "Teaching Hospital" },
  ];

  const handleEdit = (doc: any) => {
    setSelectedDoctor(doc);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* --- LEFT SIDE: Minimalist Form (7 Columns) --- */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {selectedDoctor ? "Edit Specialist" : "Register Specialist"}
              </h2>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">
                {selectedDoctor ? `Modifying Dr. ${selectedDoctor.lastName}` : "Add a new physician to the system"}
              </p>
            </div>

            <form className="space-y-6">
              {/* Personal Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">First Name</label>
                  <input type="text" defaultValue={selectedDoctor?.firstName || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="Enter first name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Last Name</label>
                  <input type="text" defaultValue={selectedDoctor?.lastName || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="Enter last name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Specialization</label>
                  <input type="text" defaultValue={selectedDoctor?.specialization || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="e.g. Cardiology" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contact Number</label>
                  <input type="text" defaultValue={selectedDoctor?.contact || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="07XXXXXXXX" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                  <input type="email" defaultValue={selectedDoctor?.email || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="doctor@hospital.com" />
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-4 border-t border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address Line 1</label>
                    <input type="text" defaultValue={selectedDoctor?.address1 || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" placeholder="Street" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address Line 2</label>
                    <input type="text" defaultValue={selectedDoctor?.address2 || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" placeholder="Area" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">City</label>
                    <input type="text" defaultValue={selectedDoctor?.city || ''} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" placeholder="City" />
                  </div>
                </div>
              </div>

              {/* Professional Credentials Section */}
              <div className="pt-4 border-t border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Education / Degree</label>
                    <input type="text" defaultValue={selectedDoctor?.degree || ''} className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-xl outline-none text-sm font-semibold" placeholder="MBBS, MD, FRCS" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Campus / University</label>
                    <input type="text" defaultValue={selectedDoctor?.university || ''} className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-xl outline-none text-sm font-semibold" placeholder="e.g. University of Colombo" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current Working Hospital</label>
                    <input type="text" defaultValue={selectedDoctor?.hospital || ''} className="w-full p-3 bg-blue-50/30 border border-blue-100 rounded-xl outline-none text-sm font-semibold" placeholder="Enter Primary Hospital" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all active:scale-[0.98]"
                >
                  {selectedDoctor ? "Save Changes" : "Register Physician"}
                </button>
                {selectedDoctor && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedDoctor(null)} 
                    className="px-6 bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* --- RIGHT SIDE: Specialist Directory (5 Columns) --- */}
        <div className="lg:col-span-5 h-[calc(100vh-80px)] sticky top-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-50">
                <h3 className="text-lg font-bold text-slate-800">Specialist Directory</h3>
                <div className="relative mt-4">
                  <input 
                    type="text" 
                    placeholder="Search specialists..." 
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {doctorsList
                .filter(doc => doc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((doc) => (
                <div 
                  key={doc.id}
                  onDoubleClick={() => handleEdit(doc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedDoctor?.id === doc.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-sm">Dr. {doc.firstName} {doc.lastName}</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase">{doc.specialization}</p>
                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center gap-2 text-slate-400">
                             <Building2 size={10} /> <span className="text-[9px] font-medium">{doc.hospital}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                             <MapPin size={10} /> <span className="text-[9px] font-medium">{doc.city}</span>
                          </div>
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Edit3 size={14} /></button>
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorManagement;