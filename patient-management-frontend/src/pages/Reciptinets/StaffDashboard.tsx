import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const dummyPatients = [
  { id: '1', name: 'Nimal Perera', age: 45, gender: 'Male', contact: '0712345678', status: 'In-Patient' },
  { id: '2', name: 'Sunil Shantha', age: 32, gender: 'Male', contact: '0778899001', status: 'Out-Patient' },
  { id: '3', name: 'Kamala Silva', age: 28, gender: 'Female', contact: '0755544332', status: 'Pending' },
];

const StaffDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
     

      {/* --- Main Content --- */}
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Dashboard Overview</h2>
            <p className="text-slate-400 text-sm font-medium">Welcome back, Hirusha!</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">H</div>
            <div>
               <p className="text-xs font-black text-slate-400 uppercase">Staff Member</p>
               <p className="text-sm font-bold text-slate-700 leading-none">Hirusha Dulshan</p>
            </div>
          </div>
        </header>

        {/* --- Stats Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Total Patients</p>
            <h3 className="text-4xl font-black text-slate-800">128</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-green-500/5 transition-all">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Today's Appointments</p>
            <h3 className="text-4xl font-black text-slate-800">12</h3>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:shadow-yellow-500/5 transition-all">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2">Pending Reports</p>
            <h3 className="text-4xl font-black text-slate-800">05</h3>
          </div>
        </div>

        {/* --- Recent Patients Table --- */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h4 className="text-xl font-black text-slate-800">Recent Registrations</h4>
            <button 
              onClick={() => navigate('/reception/register')}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              + ADD NEW PATIENT
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="p-6">Patient Name</th>
                  <th className="p-6">Age / Gender</th>
                  <th className="p-6">Contact Info</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dummyPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50/30 transition group">
                    <td className="p-6">
                       <p className="font-bold text-slate-800">{patient.name}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">ID: PAT-{patient.id}029</p>
                    </td>
                    <td className="p-6 font-medium text-slate-600 text-sm">
                        {patient.age} Yrs / {patient.gender}
                    </td>
                    <td className="p-6 text-sm font-bold text-slate-500">{patient.contact}</td>
                    <td className="p-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                        patient.status === 'In-Patient' ? 'bg-blue-100 text-blue-700' : 
                        patient.status === 'Out-Patient' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button className="text-blue-600 font-black text-[10px] uppercase hover:underline mr-6">View Files</button>
                      <button className="text-slate-300 hover:text-red-500 font-black text-[10px] uppercase transition">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;