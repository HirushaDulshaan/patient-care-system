import { useState } from 'react';
import { Search, Building2, Edit3, Trash2, MapPin, Loader2, GraduationCap } from 'lucide-react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

// --- GraphQL Queries & Mutations ---
const GET_ALL_DOCTORS = gql`
  query GetAllDoctors {
    getAllDoctors {
      id
      firstName
      lastName
      licenseNumber
      phone
      address1
      address2
      city
      education
      university
      workingHospital
      categoryId
      category {
        id
        name
      }
      user {
        email
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

const REGISTER_DOCTOR = gql`
  mutation RegisterDoctor($email: String!, $firstName: String!, $lastName: String!, $categoryId: String!, $licenseNumber: String!, $phone: String, $address1: String, $address2: String, $city: String, $education: String!, $university: String, $workingHospital: String) {
    registerDoctor(email: $email, firstName: $firstName, lastName: $lastName, categoryId: $categoryId, licenseNumber: $licenseNumber, phone: $phone, address1: $address1, address2: $address2, city: $city, education: $education, university: $university, workingHospital: $workingHospital) {
      id
    }
  }
`;

const UPDATE_DOCTOR = gql`
  mutation UpdateDoctor($id: String!, $firstName: String!, $lastName: String!, $categoryId: String!, $phone: String, $address1: String, $address2: String, $city: String, $education: String!, $university: String, $workingHospital: String) {
    updateDoctor(id: $id, firstName: $firstName, lastName: $lastName, categoryId: $categoryId, phone: $phone, address1: $address1, address2: $address2, city: $city, education: $education, university: $university, workingHospital: $workingHospital)
  }
`;

const DoctorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', categoryId: '', licenseNumber: '',
    phone: '', address1: '', address2: '', city: '',
    education: '', university: '', workingHospital: ''
  });

  // Apollo Hooks
  const { data: catData } = useQuery(GET_CATEGORIES);
  const { data, loading: queryLoading } = useQuery(GET_ALL_DOCTORS);

  const [registerDoctor, { loading: regLoading }] = useMutation(REGISTER_DOCTOR, {
    refetchQueries: [{ query: GET_ALL_DOCTORS }],
  });

  const [updateDoctor, { loading: updateLoading }] = useMutation(UPDATE_DOCTOR, {
    refetchQueries: [{ query: GET_ALL_DOCTORS }],
  });

  // Load data into form for editing
  const handleEdit = (doc: any) => {
    setSelectedDoctor(doc);
    setFormData({
      firstName: doc.firstName || '',
      lastName: doc.lastName || '',
      email: doc.user?.email || '',
      categoryId: doc.categoryId || '',
      licenseNumber: doc.licenseNumber || '',
      phone: doc.phone || '',
      address1: doc.address1 || '',
      address2: doc.address2 || '', // Area field එකට අදාළ දත්ත load වීම
      city: doc.city || '',
      education: doc.education || '',
      university: doc.university || '',
      workingHospital: doc.workingHospital || ''
    });
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setFormData({
      firstName: '', lastName: '', email: '', categoryId: '', licenseNumber: '',
      phone: '', address1: '', address2: '', city: '',
      education: '', university: '', workingHospital: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        const { email, licenseNumber, ...updateData } = formData;
        await updateDoctor({ variables: { id: selectedDoctor.id, ...updateData } });
        alert("Specialist Updated! ✅");
      } else {
        await registerDoctor({ variables: { ...formData } });
        alert("Specialist Registered! 🎉");
      }
      resetForm();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* --- LEFT SIDE: Minimalist Form --- */}
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

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">First Name</label>
                  <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="Enter first name" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Last Name</label>
                  <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="Enter last name" required />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Specialization / Category</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full p-3 bg-blue-50/50 border border-blue-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select Category</option>
                    {catData?.getAllDoctorCategories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">License Number (SLMC)</label>
                  <input name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} type="text" disabled={!!selectedDoctor} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all ${selectedDoctor && 'opacity-50'}`} placeholder="Registration No" required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Contact Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all" placeholder="07XXXXXXXX" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email Address</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" disabled={!!selectedDoctor} className={`w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm focus:border-blue-500 transition-all ${selectedDoctor && 'opacity-50'}`} placeholder="doctor@hospital.com" required />
                </div>
              </div>

              {/* Address Section - මෙතන තමයි ඔයාට ප්‍රශ්නය තිබුණේ */}
              <div className="pt-4 border-t border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Address</label>
                    <input 
                      name="address1" 
                      value={formData.address1} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" 
                      placeholder="Street" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Area</label>
                    <input 
                      name="address2" 
                      value={formData.address2} // මෙතන value එක bind කරලා තියෙන්නේ
                      onChange={handleChange} 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" 
                      placeholder="Area" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">City</label>
                    <input 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm" 
                      placeholder="City" 
                    />
                  </div>
                </div>
              </div>

              {/* Professional Credentials Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Education / Degree</label>
                    <input name="education" value={formData.education} onChange={handleChange} type="text" className="w-full p-3 bg-slate-900/5 border border-slate-200 rounded-xl outline-none text-sm font-semibold" placeholder="MBBS, MD, FRCS" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Campus / University</label>
                    <input name="university" value={formData.university} onChange={handleChange} type="text" className="w-full p-3 bg-slate-900/5 border border-slate-200 rounded-xl outline-none text-sm font-semibold" placeholder="University Name" />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current Working Hospital</label>
                    <input name="workingHospital" value={formData.workingHospital} onChange={handleChange} type="text" className="w-full p-3 bg-slate-900/5 border border-slate-200 rounded-xl outline-none text-sm font-semibold" placeholder="Enter Primary Hospital" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={regLoading || updateLoading}
                  className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {(regLoading || updateLoading) && <Loader2 className="animate-spin" size={18} />}
                  {selectedDoctor ? "Save Changes" : "Register Physician"}
                </button>
                {selectedDoctor && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* --- RIGHT SIDE: Specialist Directory --- */}
        <div className="lg:col-span-5 h-[calc(100vh-80px)] sticky top-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Specialist Directory</h3>
              <div className="relative mt-4">
                <input
                  type="text"
                  placeholder="Search by name or category..."
                  className="w-full p-3 pl-10 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {queryLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <Loader2 className="animate-spin text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-widest">Loading Registry...</span>
                </div>
              ) : data?.getAllDoctors
                .filter((doc: any) => 
                  doc.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  doc.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  doc.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((doc: any) => (
                  <div
                    key={doc.id}
                    onClick={() => handleEdit(doc)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedDoctor?.id === doc.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-sm">Dr. {doc.firstName} {doc.lastName}</p>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{doc.category?.name}</p>
                        <div className="flex flex-col gap-1 mt-3">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Building2 size={11} /> 
                            <span className="text-[10px] font-medium">{doc.workingHospital || 'Private Practice'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={11} /> 
                            <span className="text-[10px] font-medium">{doc.city || 'Location N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <GraduationCap size={11} /> 
                            <span className="text-[10px] font-medium italic">{doc.education}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(doc); }} className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                          <Edit3 size={14} />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 size={14} />
                        </button>
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