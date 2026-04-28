import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserRound, 
  ClipboardList, 
  Clock, 
  Settings, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: 'My Dashboard', path: '/doctor/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patient Roster', path: '/doctor/patients', icon: <UserRound size={20} /> },
    { name: 'Medical Records', path: '/doctor/records', icon: <ClipboardList size={20} /> },
    { name: 'Duty Schedule', path: '/doctor/schedule', icon: <Clock size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      
      {/* --- Doctor Sidebar --- */}
      <div className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
        
        {/* Brand/Hospital Logo */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="font-black text-white text-xl">M</span>
            </div>
            <h1 className="text-lg font-black tracking-tighter text-slate-800">MEDIC-OS</h1>
          </div>
        </div>

        {/* Doctor Profile Mini Card */}
        <div className="px-6 mb-8">
           <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">On Duty</p>
              <h2 className="text-sm font-bold truncate">Dr. Ruwan Kumara</h2>
              <p className="text-[10px] text-slate-400 font-medium">Cardiologist</p>
              {/* Subtle background icon */}
              <LayoutDashboard className="absolute -right-4 -bottom-4 opacity-10" size={80} />
           </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 w-full p-4 rounded-2xl font-bold transition-all ${
                isActive(item.path) 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-100 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 text-slate-400 font-bold hover:text-slate-600 transition-all">
            <Settings size={18} />
            <span className="text-xs">Account Settings</span>
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 w-full p-3 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span className="text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Doctor Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-5 flex justify-between items-center sticky top-0 z-20">
           <div className="relative w-96 hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                type="text" 
                placeholder="Search patient by Name or ID..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
           </div>
           
           <div className="flex items-center gap-6">
              {/* Notification Bell */}
              <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-8 w-[1px] bg-slate-100"></div>

              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Room</p>
                    <p className="text-sm font-black text-slate-800">Room #102</p>
                 </div>
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                    RK
                 </div>
              </div>
           </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default DoctorLayout;