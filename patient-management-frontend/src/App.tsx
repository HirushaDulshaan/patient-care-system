import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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
import Login from "./pages/Login";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AdminOverview from "./pages/Admin/AdminOverview";
import DoctorManagement from "./pages/Admin/DoctorManagement";
import SuperAdminLayout from "./components/SuperAdminLayout";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminStaffManagement from "./pages/SuperAdmin/SuperAdminStaffManagement";
import SecurityAuditLogs from "./pages/SuperAdmin/SecurityAuditLogs";
import FinancialReports from "./pages/SuperAdmin/FinancialReports";
import DoctorPatientInsights from "./pages/SuperAdmin/DoctorPatientInsights";
import DoctorLayout from "./components/DoctorLayout";
import PatientConsultation from "./pages/Doctor/PatientConsultation";
import NewMedicalRecord from "./pages/Doctor/NewMedicalRecord";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* --- Admin Group --- */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminOverview />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/schedule" element={<DoctorScheduleManagement />} />                                 
          <Route path="/admin/doctors" element={<DoctorManagement />} />
        </Route>

        {/* Receptionist Routes */}
        <Route element={<Layout />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/reception/register" element={<RegisterPatient />} />
          <Route path="/reception/billing" element={<BillingPage />} />
          <Route path="/reception/roster" element={<DoctorRoster />} />
        </Route>

        {/* Super Admin Routes */}
        <Route element={<SuperAdminLayout />}>
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />                                   
          <Route path="/superadmin/staff"element={<SuperAdminStaffManagement />}  />          
          <Route path="/superadmin/logs" element={<SecurityAuditLogs />} />
          <Route path="/superadmin/financials" element={<FinancialReports />} />
          <Route  path="/superadmin/insights" element={<DoctorPatientInsights />} />                                 
        </Route>

        <Route element={<DoctorLayout />}>
          <Route path="/doctor/dashboard" element={<StaffDashboard />} />
          <Route path="/doctor/patients" element={<PatientConsultation />} />
          <Route path="/doctor/records" element={<NewMedicalRecord />} />
          <Route path="/doctor/schedule" element={<DoctorScheduleManagement />}  />                                 
        </Route>

        {/* Staff/Medical Routes */}
        <Route path="/staff/prescription" element={<PrescriptionEntry />} />

        {/* Default Route - Logic එකට අනුව මුලින්ම Login එකට යවමු */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* 404 - Page Not Found එකක් ආවොත් Login එකටම යවමු */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
