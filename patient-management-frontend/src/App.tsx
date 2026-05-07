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
import { Toaster } from 'react-hot-toast'; 



// Role Security Component
const RoleRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  if (!userId) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role || "")) return <Navigate to="/login" replace />;
  return <Outlet />;
};

function App() {
  const currentUserId = localStorage.getItem("userId") || "";

  return (
    <Router>
      
      <Toaster
        position="top-center"
        toastOptions={{
         
          style: {
            borderRadius: '15px',
            background: '#0F172A', 
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            padding: '16px',
          },
          success: {
           
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            
            iconTheme: {
              primary: '#EF4444', // Red 500
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/specialists" element={<SpecialistDirectory />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

       

        {/* --- SUPER ADMIN ONLY --- */}
        <Route element={<RoleRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/staff" element={<SuperAdminStaffManagement />} />
            <Route path="/superadmin/logs" element={<SecurityAuditLogs />} />
            <Route path="/superadmin/financials" element={<FinancialReports />} />
            <Route path="/superadmin/insights" element={<DoctorPatientInsights />} />
            <Route path="/superadmin/SpecialistManagement" element={<SpecialistManagement />} />
          </Route>
        </Route>

        {/* --- ADMIN ONLY --- */}
        <Route element={<RoleRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminOverview />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
            <Route path="/admin/schedule" element={<DoctorScheduleManagement />} />
            <Route path="/admin/doctors" element={<DoctorManagement />} />
          </Route>
        </Route>

        {/* --- DOCTOR ONLY --- */}
        <Route element={<RoleRoute allowedRoles={['DOCTOR']} />}>
          <Route element={<DoctorLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<PatientConsultation />} />
            <Route path="/doctor/records" element={<NewMedicalRecord />} />
            <Route path="/doctor/schedule" element={<DoctorDutySchedule doctorId={currentUserId} />} />
          </Route>
        </Route>

        {/* --- RECEPTIONIST & STAFF --- */}
        <Route element={<RoleRoute allowedRoles={['RECEPTIONIST', 'STAFF', 'ADMIN']} />}>
          <Route element={<Layout />}>
            <Route path="/staff/dashboard" element={<StaffDashboard />} />
            <Route path="/reception/register" element={<RegisterPatient />} />
            <Route path="/reception/billing" element={<BillingPage />} />
            <Route path="/reception/roster" element={<DoctorRoster />} />
          </Route>
        </Route>

        {/* --- Default 404 --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;