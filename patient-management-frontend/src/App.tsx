import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

// Admin Pages
import StaffManagement from "./pages/Admin/StaffManagement";
import DoctorScheduleManagement from "./pages/Admin/DoctorScheduleManagement";

// Receptionist Pages
import RegisterPatient from "./pages/Reciptinets/RegisterPatient";
import DoctorRoster from "./pages/Reciptinets/DoctorRoster";
import BillingPage from "./pages/Reciptinets/BillingPage";

// Staff/Doctor Pages
import StaffDashboard from "./pages/Reciptinets/StaffDashboard";
import PrescriptionEntry from "./pages/staff/PrescriptionEntry";

// Common
import HomePage from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import DoctorManagement from "./pages/Admin/DoctorManagement";
import SuperAdminLayout from "./components/SuperAdminLayout";
import SuperAdminDashboard from "./pages/SuperAdmin/SuperAdminDashboard";
import SuperAdminStaffManagement from "./pages/SuperAdmin/SuperAdminStaffManagement";
import SecurityAuditLogs from "./pages/SuperAdmin/SecurityAuditLogs";
import FinancialReports from "./pages/SuperAdmin/FinancialReports";
import DoctorPatientInsights from "./pages/SuperAdmin/DoctorPatientInsights";
import DoctorLayout from "./components/DoctorLayout";
import PatientConsultation from "./pages/Doctor/PatientConsultation";
import NewMedicalRecord from "./pages/Doctor/NewMedicalRecord";
import BookAppointment from "./pages/BookAppointment";
import SpecialistDirectory from "./pages/SpecialistDirectory";
import PaymentSuccess from "./pages/PaymentSuccess";
import SpecialistManagement from "./pages/SuperAdmin/Specialist Management";
import DoctorDutySchedule from "./pages/Doctor/DoctorDutySchedule";
import DoctorDashboard from "./pages/Doctor/DoctorDashBoard";

// ✅ 1. ProtectedRoute Component
// මේකෙන් තමයි බලන්නේ user ලොග් වෙලාද ඉන්නේ කියලා.
const ProtectedRoute = () => {
  const userId = localStorage.getItem("userId");
  
  // userId එක නැත්නම් කෙලින්ම login එකට යවනවා. 
  // 'replace' එක නිසා back button එකෙන් Dashboard එකට එන්න බැහැ.
  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  const currentUserId = localStorage.getItem("userId") || "";

  return (
    <Router>
      <Routes>
        {/* --- Public Routes (ඕනෑම කෙනෙක්ට බලන්න පුළුවන්) --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/specialists" element={<SpecialistDirectory />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* --- Private / Protected Routes (ලොග් වුණොත් විතරයි බලන්න පුළුවන්) --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* --- Admin Group --- */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminOverview />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/schedule" element={<DoctorScheduleManagement />} />
            <Route path="/admin/doctors" element={<DoctorManagement />} />
          </Route>

          {/* --- Receptionist Routes --- */}
          <Route element={<Layout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/reception/register" element={<RegisterPatient />} />
            <Route path="/reception/billing" element={<BillingPage />} />
            <Route path="/reception/roster" element={<DoctorRoster />} />
          </Route>

          {/* --- Super Admin Routes --- */}
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/staff" element={<SuperAdminStaffManagement />} />
            <Route path="/superadmin/logs" element={<SecurityAuditLogs />} />
            <Route path="/superadmin/financials" element={<FinancialReports />} />
            <Route path="/superadmin/insights" element={<DoctorPatientInsights />} />
            <Route path="/superadmin/SpecialistManagement" element={<SpecialistManagement />} />
          </Route>

          {/* --- Doctor Routes --- */}
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<PatientConsultation />} />
            <Route path="/doctor/records" element={<NewMedicalRecord />} />
            <Route 
              path="/doctor/schedule" 
              element={<DoctorDutySchedule doctorId={currentUserId} />} 
            />
          </Route>

          {/* Staff/Medical Routes */}
          <Route path="/staff/prescription" element={<PrescriptionEntry />} />
        </Route>

        {/* --- Default & 404 Logic --- */}
        {/* URL එක වැරදුණොත් හෝ පේජ් එක නැත්නම් Login එකට යවමු */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;