import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { 
  User, CreditCard, Phone, MapPin, 
  Stethoscope, Activity, CheckCircle, ArrowLeft, Loader2 
} from 'lucide-react';

// --- GraphQL Queries ---
// ✅ Schedule විස්තරත් එක්කම දොස්තරලා ගමු
const GET_DOCTORS_WITH_SCHEDULES = gql`
  query GetDoctorsWithSchedules {
    getAllDoctors {
      id
      firstName
      lastName
      category { name }
      schedules {
        workingDate
        remainingSeats
        maxPatients
      }
    }
  }
`;

const CREATE_APPOINTMENT = gql`
  mutation CreateAppointment($patientData: PatientInput!, $doctorId: String!, $scheduledAt: String!) {
    createAppointment(patientData: $patientData, doctorId: $doctorId, scheduledAt: $scheduledAt) {
      id
      status
    }
  }
`;

const RegisterPatient = () => {
  const navigate = useNavigate();
  const [consultationType, setConsultationType] = useState('opd');
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    phone: '',
    doctorId: '',
    date: new Date().toISOString().split('T')[0]
  });

  // ✅ FetchPolicy එක network-only දාන්න එතකොට හැමතිස්සෙම DB එකේ අලුත්ම slots ගණන පේනවා
  const { data: docData } = useQuery(GET_DOCTORS_WITH_SCHEDULES, {
    fetchPolicy: 'network-only'
  });

  const [confirmBooking, { loading: bookingLoading }] = useMutation(CREATE_APPOINTMENT, {
    refetchQueries: [{ query: GET_DOCTORS_WITH_SCHEDULES }] // ✅ බුක් කළාට පස්සේ slots ගණන refresh කරන්න
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (consultationType === 'specialist' && !formData.doctorId) {
      alert("Please select a doctor!");
      return;
    }

    try {
      await confirmBooking({
        variables: {
          patientData: {
            fullName: formData.fullName,
            nic: formData.nic,
            phone: formData.phone
          },
          doctorId: formData.doctorId,
          scheduledAt: new Date(formData.date).toISOString()
        }
      });
      alert("Registration Successful! Slot updated in Database. 🎉");
      navigate('/staff/dashboard');
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <button 
        onClick={() => navigate('/staff/dashboard')}
        className="mb-8 text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-slate-100">
          
          <div className="bg-slate-900 p-10 text-white">
            <h2 className="text-3xl font-black tracking-tight">Direct Patient Registration</h2>
            <p className="text-slate-400 text-sm mt-2">Manual entry for walk-in or over-the-phone appointments.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <User size={16}/> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Full Name</label>
                  <input name="fullName" required onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition" placeholder="Kamal Perera" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">NIC Number</label>
                  <input name="nic" required onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition" placeholder="1999XXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contact Number</label>
                  <input name="phone" required onChange={handleInputChange} type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition" placeholder="07XXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Appointment Date</label>
                  <input name="date" required onChange={handleInputChange} type="date" value={formData.date} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition" />
                </div>
              </div>
            </div>

            <hr className="border-slate-50" />

            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                <Activity size={16}/> Service Type
              </h3>
              <div className="flex gap-4">
                <button type="button" onClick={() => setConsultationType('opd')} className={`flex-1 py-6 rounded-3xl font-black transition-all flex flex-col items-center gap-2 border-2 ${consultationType === 'opd' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                  🏥 General OPD
                </button>
                <button type="button" onClick={() => setConsultationType('specialist')} className={`flex-1 py-6 rounded-3xl font-black transition-all flex flex-col items-center gap-2 border-2 ${consultationType === 'specialist' ? 'bg-blue-50 border-blue-600 text-blue-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                  👨‍⚕️ Specialist
                </button>
              </div>
            </div>

            {consultationType === 'specialist' && (
              <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="block text-[10px] font-black text-blue-600 uppercase mb-3 tracking-widest">Assign Specialist Physician</label>
                <select 
                  name="doctorId" 
                  onChange={handleInputChange}
                  className="w-full p-4 bg-white border border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold transition shadow-sm"
                >
                  <option value="">-- Choose a Doctor --</option>
                  {docData?.getAllDoctors.map((doc: any) => {
                    // ✅ තෝරාගත් දිනයට අදාළ schedule එක සොයමු
                    const daySchedule = doc.schedules.find((s: any) => 
                      s.workingDate.split('T')[0] === formData.date
                    );
                    
                    const hasSeats = daySchedule && daySchedule.remainingSeats > 0;

                    return (
                      <option key={doc.id} value={doc.id} disabled={!hasSeats}>
                        Dr. {doc.firstName} {doc.lastName} ({doc.category.name}) 
                        {daySchedule 
                          ? ` - ${daySchedule.remainingSeats} Seats Available` 
                          : " - No Session on this date"}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <button 
              disabled={bookingLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all transform active:scale-[0.98] mt-6 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3"
            >
              {bookingLoading ? <Loader2 className="animate-spin" /> : "Complete Registration & Update Slots"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;