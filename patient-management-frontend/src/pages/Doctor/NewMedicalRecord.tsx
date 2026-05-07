import { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Trash2,
  Save,
  FileEdit,
  ClipboardCheck,
  AlertCircle,
  User,
  Activity,
  Weight,
  Clock,
  Loader2,
  Users,
} from "lucide-react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const GET_PENDING_APPOINTMENTS = gql`
  query GetPendingConsultations($userId: String!) {
    # 👈 මෙතන $userId
    getPendingConsultations(userId: $userId) {
      # 👈 මෙතන userId: $userId
      id
      patient {
        id
        fullName
      }
      scheduledAt
    }
  }
`;


const SAVE_MEDICAL_RECORD = gql`
  mutation SaveMedicalRecord(
    $appointmentId: String!
    $patientName: String!
    $age: String!
    $complaint: String!
    $diagnosis: String!
    $medicines: [MedicineInput!]!
    $weight: String
    $guardianName: String
    $specialAdvice: String
    $nextVisitDate: String
  ) {
    saveMedicalRecord(
      appointmentId: $appointmentId
      patientName: $patientName
      age: $age
      complaint: $complaint
      diagnosis: $diagnosis
      medicines: $medicines
      weight: $weight
      guardianName: $guardianName
      specialAdvice: $specialAdvice
      nextVisitDate: $nextVisitDate
    )
  }
`;

const NewMedicalRecord = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId") || "";

  // States
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "Once Daily (OD)" },
  ]);

 
  const {
    data: pendingData,
    loading: loadingQueue,
    error: queryError,
  } = useQuery(GET_PENDING_APPOINTMENTS, {
    variables: { userId: currentUserId },
    skip: !currentUserId,
    pollInterval: 10000, 
  });

  // Debugging logs
  useEffect(() => {
    if (queryError) console.error("GraphQL Query Error:", queryError);
    if (pendingData)
      console.log("Current Queue:", pendingData.getPendingConsultations);
  }, [pendingData, queryError]);

  const handlePatientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appId = e.target.value;
    setSelectedAppointmentId(appId);
    const selectedApp = pendingData?.getPendingConsultations.find(
      (a: any) => a.id === appId,
    );
    if (selectedApp) {
      setPatientName(selectedApp.patient.fullName);
    } else {
      setPatientName("");
    }
  };

  const [saveRecord, { loading: saving }] = useMutation(SAVE_MEDICAL_RECORD, {
    onCompleted: () => {
      toast.success("Consultation has been saved successfully.");
      navigate("/doctor/dashboard");
    },
    onError: (err) => {
      console.error("Mutation Error Details:", err);
      toast.error("Error saving consultation.");
    },
  });

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "Once Daily (OD)" },
    ]);
  };

  const removeMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const updatedMeds = [...medicines];
    updatedMeds[index] = { ...updatedMeds[index], [field]: value };
    setMedicines(updatedMeds);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAppointmentId)
      return alert("Please select a patient from the queue!");

    const formData = new FormData(e.currentTarget);

    await saveRecord({
      variables: {
        appointmentId: selectedAppointmentId,
        patientName: patientName,
        age: formData.get("age") as string,
        weight: formData.get("weight") as string,
        guardianName: formData.get("guardianName") as string,
        complaint: formData.get("complaint") as string,
        diagnosis: formData.get("diagnosis") as string,
        specialAdvice: formData.get("specialAdvice") as string,
        nextVisitDate: formData.get("nextVisitDate") || null,
        medicines: medicines.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
        })),
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans animate-in fade-in duration-500 pb-20">
      <div className="max-w-5xl mx-auto space-y-8 mt-10">
        {/* --- Header & Queue Selection --- */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              New Consultation
            </h2>
            <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-blue-600" /> Clinical Entry
              Portal
            </p>
          </div>

          <div className="w-full md:w-1/2 space-y-2">
            <label className="text-[10px] font-black text-blue-600 uppercase ml-4 tracking-widest flex items-center gap-2">
              <Users size={14} /> Active Patient Queue
            </label>
            <select
              value={selectedAppointmentId}
              onChange={handlePatientSelect}
              className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none font-black text-slate-700 text-sm focus:ring-4 focus:ring-blue-100 transition-all shadow-inner"
            >
              <option value="">
                {loadingQueue
                  ? "Loading patients..."
                  : "-- Select Waiting Patient --"}
              </option>
              {pendingData?.getPendingConsultations.map((app: any) => (
                <option key={app.id} value={app.id}>
                  {app.patient.fullName}
                </option>
              ))}
            </select>
            {queryError && (
              <p className="text-red-500 text-[10px] ml-4 font-bold">
                Failed to load queue
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- SECTION 1: PATIENT IDENTIFICATION --- */}
          <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
              <User size={16} className="text-blue-500" /> 1. Selected Patient
              Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">
                  Confirmed Name
                </label>
                <div className="relative group">
                  <User
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500"
                    size={20}
                  />
                  <input
                    readOnly
                    value={patientName}
                    placeholder="Select patient from queue above"
                    className="w-full p-6 pl-16 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none font-black text-slate-700 text-lg cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">
                  Age (Years/Months)
                </label>
                <input
                  name="age"
                  required
                  type="text"
                  placeholder="e.g. 24 Y"
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/5 font-black text-slate-700 text-lg transition-all"
                />
              </div>

              <div className="md:col-span-4 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">
                  Weight (kg)
                </label>
                <div className="relative group">
                  <Weight
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                    size={20}
                  />
                  <input
                    name="weight"
                    type="text"
                    placeholder="e.g. 65.5 kg"
                    className="w-full p-6 pl-16 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/5 font-black text-slate-700 text-lg transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-8 space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">
                  Parent / Guardian Name
                </label>
                <input
                  name="guardianName"
                  type="text"
                  placeholder="Mother/Father name (if child)"
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/5 font-bold text-slate-700 transition-all"
                />
              </div>
            </div>
          </div>

          {/* --- SECTION 2: DIAGNOSIS --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FileEdit size={16} className="text-blue-500" /> 2. Observation &
              Diagnosis
            </h3>
            <div className="space-y-6">
              <textarea
                name="complaint"
                required
                rows={2}
                placeholder="Chief Complaint (රෝග ලක්ෂණ)..."
                className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/5 font-medium text-slate-700 transition-all resize-none mb-4 shadow-inner"
              ></textarea>
              <textarea
                name="diagnosis"
                required
                rows={3}
                placeholder="Final clinical diagnosis (නිගමනය)..."
                className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-blue-500/5 font-medium text-slate-700 transition-all resize-none shadow-inner"
              ></textarea>
            </div>
          </div>

          {/* --- SECTION 3: PRESCRIPTION --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Pill size={16} className="text-emerald-500" /> 3. Medication
                Plan
              </h3>
              <button
                type="button"
                onClick={addMedicine}
                className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 px-5 py-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95"
              >
                <Plus size={16} /> ADD DRUG
              </button>
            </div>

            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-50 hover:border-emerald-100 transition-all shadow-sm"
                >
                  <div className="col-span-5 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Drug Name
                    </label>
                    <input
                      required
                      type="text"
                      value={med.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      placeholder="e.g. Paracetamol 500mg"
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Dosage
                    </label>
                    <input
                      required
                      type="text"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      placeholder="e.g. 1 Tablet"
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                    />
                  </div>
                  <div className="col-span-3 space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                      Frequency
                    </label>
                    <select
                      value={med.frequency}
                      onChange={(e) =>
                        handleMedicineChange(index, "frequency", e.target.value)
                      }
                      className="w-full p-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-xs text-slate-600"
                    >
                      <option>Once Daily (OD)</option>
                      <option>Twice Daily (BD)</option>
                      <option>Thrice Daily (TDS)</option>
                      <option>As Needed (PRN)</option>
                      <option>Before Meal (AC)</option>
                    </select>
                  </div>
                  <div className="col-span-1 text-right pt-6">
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- SECTION 4: ADVICE & FOLLOW-UP (Light Version) --- */}
          <div className="bg-white p-10 rounded-[3rem] border border-blue-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <ClipboardCheck size={16} /> 4. Final Advice & Follow-up
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Special Advice */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
                    Special Advice
                  </label>
                  <div className="relative group">
                    <input
                      name="specialAdvice"
                      type="text"
                      placeholder="Dietary restrictions or rest etc."
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 placeholder-slate-300 focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Follow-up Date */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">
                    Follow-up Date
                  </label>
                  <div className="relative group">
                    <input
                      name="nextVisitDate"
                      type="date"
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/5 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

          
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-blue-900 pointer-events-none">
              <AlertCircle size={250} />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-6 pt-6">
            <button
              type="button"
              onClick={() => navigate("/doctor/dashboard")}
              className="flex-1 py-6 bg-white border border-slate-200 text-slate-400 font-black rounded-[2rem] hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]"
            >
              Discard Entry
            </button>
            <button
              type="submit"
              disabled={saving || !selectedAppointmentId}
              className={`flex-[2.5] py-6 text-white font-black rounded-[2rem] shadow-2xl transition-all active:scale-95 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 ${!selectedAppointmentId ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 shadow-blue-500/30 hover:bg-blue-700"}`}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              {saving ? "SAVING DATA..." : "Complete & Save Consultation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMedicalRecord;
