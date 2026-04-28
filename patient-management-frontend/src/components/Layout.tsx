import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* --- Sidebar (හැම පිටුවකම පේන කොටස) --- */}
      <div className="w-72 bg-slate-900 text-white p-6 hidden md:block sticky top-0 h-screen">
        <h1 className="text-2xl font-black mb-10 text-blue-400 tracking-tight text-center">Staff Portal</h1>
        <nav className="space-y-2">
          <Link to="/staff/dashboard" className="block w-full text-left p-3 rounded-xl hover:bg-blue-600 font-bold transition">Dashboard</Link>
          <Link to="/reception/register" className="block w-full text-left p-3 rounded-xl hover:bg-slate-800 transition font-medium">Register Patient</Link>
          <Link to="/reception/roster" className="block w-full text-left p-3 rounded-xl hover:bg-slate-800 transition font-medium">Doctor Roster</Link>
          <Link to="/reception/billing" className="block w-full text-left p-3 rounded-xl hover:bg-slate-800 transition font-medium">Billing</Link>
        </nav>
      </div>

      {/* --- Main Content Area (පිටුවෙන් පිටුවට මාරු වෙන කොටස) --- */}
      <div className="flex-1 overflow-y-auto">
        <Outlet /> {/* මෙතනින් තමා Register, Billing වගේ පිටු load වෙන්නේ */}
      </div>

    </div>
  );
};

export default Layout;