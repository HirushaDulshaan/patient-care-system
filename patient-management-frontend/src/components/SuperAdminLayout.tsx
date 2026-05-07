import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarClock,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const SuperAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      name: "Insights Overview",
      path: "/superadmin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Staff Management",
      path: "/superadmin/staff",
      icon: <Users size={20} />,
    },
    {
      name: "Doctor Specialist",
      path: "/superadmin/SpecialistManagement",
      icon: <Stethoscope size={20} />,
    },
    {
      name: "Doctor Roster",
      path: "/superadmin/insights",
      icon: <CalendarClock size={20} />,
    },
    {
      name: "Security Audit Logs",
      path: "/superadmin/logs",
      icon: <ShieldCheck size={20} />,
    },
    {
      name: "Financial Reports",
      path: "/superadmin/financials",
      icon: <BarChart3 size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* --- Sidebar --- */}
      <div className="w-80 bg-slate-950 text-white p-8 hidden md:flex flex-col sticky top-0 h-screen shadow-2xl">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="font-black text-white italic text-xl">S</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none">
              SUPER ADMIN
            </h1>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Hospital Control
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between group w-full p-4 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
              {isActive(item.path) && (
                <ChevronRight
                  size={14}
                  className="animate-in slide-in-from-left-2"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 space-y-4">
          <button className="flex items-center gap-3 w-full p-4 text-slate-500 font-bold hover:text-white transition-colors">
            <Settings size={20} />
            <span className="text-sm">System Settings</span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center gap-2 w-full p-4 bg-red-500/10 text-red-500 rounded-2xl font-black text-xs uppercase hover:bg-red-500 hover:text-white transition-all active:scale-95"
          >
            <LogOut size={16} />
            TERMINATE SESSION
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
