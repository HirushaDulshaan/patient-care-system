import React from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { gql } from "@apollo/client";
import { useLazyQuery, useQuery } from "@apollo/client/react";
import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  Clock,
  Settings,
  LogOut,
  Bell,
  Search,
  Loader2,
} from "lucide-react";


const GET_DOCTOR_PROFILE = gql`
  query GetDoctorProfile($userId: String!) {
    getDoctorDashboardStats(userId: $userId) {
      firstName
      lastName
      # මෙතනට ඔයාගේ Backend එකෙන් Category Name එක එනවා නම් ඒකත් දාන්න පුළුවන්
    }
  }
`;

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = localStorage.getItem("userId") || "";

  const isActive = (path: string) => location.pathname === path;

  // 2. Fetch Doctor Data
  const { data, loading } = useQuery(GET_DOCTOR_PROFILE, {
    variables: { userId: currentUserId },
    skip: !currentUserId,
  });

  const doctor = data?.getDoctorDashboardStats;

  const menuItems = [
    {
      name: "My Dashboard",
      path: "/doctor/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Patient Roster",
      path: "/doctor/patients",
      icon: <UserRound size={20} />,
    },
    {
      name: "Medical Records",
      path: "/doctor/records",
      icon: <ClipboardList size={20} />,
    },
    {
      name: "Duty Schedule",
      path: "/doctor/schedule",
      icon: <Clock size={20} />,
    },
  ];

  const handleLogout = () => {
    
    localStorage.clear();
    sessionStorage.clear();

    
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* --- Doctor Sidebar --- */}
      <div className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        {/* Brand/Hospital Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3 transition-transform hover:scale-105 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-black text-white text-xl">M</span>
            </div>
            <h1 className="text-lg font-black tracking-tighter text-slate-800 uppercase">
              Medic-OS
            </h1>
          </div>
        </div>

        {/* Doctor Profile Mini Card (Dynamic) */}
        <div className="px-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
              On Duty Now
            </p>

            {loading ? (
              <Loader2 className="animate-spin text-slate-500 mb-2" size={16} />
            ) : (
              <>
                <h2 className="text-sm font-black truncate tracking-tight">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  Clinical Specialist
                </p>
              </>
            )}

            {/* Subtle background icon */}
            <LayoutDashboard
              className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-700"
              size={80}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 w-full p-4 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div
                className={
                  isActive(item.path) ? "text-white" : "text-blue-500/60"
                }
              >
                {item.icon}
              </div>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-100 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 text-slate-400 font-bold hover:text-slate-600 transition-all rounded-xl hover:bg-slate-50">
            <Settings size={18} />
            <span className="text-xs">Account Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-rose-500 font-black hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-xs uppercase tracking-widest">
              Sign Out System
            </span>
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
