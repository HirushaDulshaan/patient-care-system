import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Users,
  UserPlus,
  Calendar,
  PieChart,
  LogOut,
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isStaffOpen, setIsStaffOpen] = useState(true); 

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* --- Admin Sidebar --- */}
      <div className="w-80 bg-slate-950 text-white p-8 hidden md:block sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-black text-white italic text-xl">A</span>
          </div>
          <h1 className="text-xl font-black tracking-tighter">ADMIN PANEL</h1>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 w-full text-left p-4 rounded-2xl font-bold transition-all ${isActive("/admin/dashboard") ? "bg-white/10 text-white border border-white/10 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <PieChart size={20} />
            Overview
          </Link>

          {/* --- COLLAPSIBLE STAFF MANAGEMENT --- */}
          <div className="space-y-1">
            <button
              onClick={() => setIsStaffOpen(!isStaffOpen)}
              className={`flex items-center justify-between w-full text-left p-4 rounded-2xl font-bold transition-all ${location.pathname.includes("/admin/manage-") ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
            >
              <div className="flex items-center gap-3">
                <Users size={20} />
                User Management
              </div>
              {isStaffOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isStaffOpen && (
              <div className="ml-6 pl-4 border-l border-white/10 space-y-1 animate-in slide-in-from-top-2 duration-300">
                <Link
                  to="/admin/staff"
                  className={`block w-full text-left p-3 rounded-xl text-sm font-bold transition-all ${isActive("/admin/staff") ? "text-blue-400 bg-blue-400/5" : "text-slate-500 hover:text-slate-200"}`}
                >
                  • Support Staff Members
                </Link>
                <Link
                  to="/admin/doctors"
                  className={`block w-full text-left p-3 rounded-xl text-sm font-bold transition-all ${isActive("/admin/doctors") ? "text-blue-400 bg-blue-400/5" : "text-slate-500 hover:text-slate-200"}`}
                >
                  • Medical Specialists
                </Link>
              </div>
            )}
          </div>

          {/* Schedule Link */}
          <Link
            to="/admin/schedule"
            className={`flex items-center gap-3 w-full text-left p-4 rounded-2xl font-bold transition-all ${isActive("/admin/schedule") ? "bg-white/10 text-white border border-white/10 shadow-xl" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
          >
            <Calendar size={20} />
            Doctor Roster
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-8 left-8 right-8">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 w-full p-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={16} />
            LOGOUT SESSION
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
