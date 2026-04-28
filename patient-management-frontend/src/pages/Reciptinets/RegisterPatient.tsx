import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [consultationType, setConsultationType] = useState('opd');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/staff-dashboard')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center font-medium transition-transform hover:-translate-x-1"
      >
        ← Back to Dashboard
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Patient Registration</h2>
        <p className="text-gray-500 mb-8">Please fill in all the required fields to register a new patient.</p>

        <form className="space-y-6">
          
          {/* Name Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Kamal" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Perera" />
            </div>
          </div>

          {/* Identification Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">NIC Number</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="19XXXXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="07XXXXXXXX" />
            </div>
          </div>

          {/* Address Group */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="No. 123" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2</label>
                <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Main Street" />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Colombo" />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Consultation Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">Consultation Selection</label>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setConsultationType('opd')}
                className={`flex-1 py-4 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${consultationType === 'opd' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                🏥 OPD
              </button>
              <button 
                type="button"
                onClick={() => setConsultationType('specialist')}
                className={`flex-1 py-4 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${consultationType === 'specialist' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                👨‍⚕️ Specialist
              </button>
            </div>
          </div>

          {/* Specialist Selection (Only shows if Specialist is selected) */}
          {consultationType === 'specialist' && (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to Doctor</label>
              <select className="w-full p-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition">
                <option>Dr. Nimal (Cardiologist)</option>
                <option>Dr. Sunil (ENT)</option>
                <option>Dr. Kamala (VOG)</option>
              </select>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all transform active:scale-[0.98] mt-4">
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPatient;