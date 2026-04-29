import React from 'react';
import { Heart, Activity, Shield, Phone, Clock, MapPin, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* --- 1. Navbar --- */}
      <nav className="flex justify-between items-center px-10 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-50">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs italic">M</div>
          <span>MEDIC<span className="text-blue-600">OS</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
          <a href="#" className="hover:text-blue-600 transition">Services</a>
          <a href="#" className="hover:text-blue-600 transition">Doctors</a>
          <a href="#" className="hover:text-blue-600 transition">About Us</a>
          <a href="#" className="hover:text-blue-600 transition">Contact</a>
        </div>
        <button onClick={() => navigate('/login')} className="bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100">
           Staff Portal
        </button>
      </nav>

      {/* --- 2. Hero Section --- */}
      <section className="px-10 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-inner">
             <Shield size={14} /> Certified Medical Excellence
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter text-slate-900">
            Advanced Care <br /> 
            <span className="text-blue-600">For Your Life.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-md">
            Dedicated to providing specialized medical treatment and personalized health management services in Sri Lanka.
          </p>
          <div className="flex gap-4">
             <button onClick={() => navigate("/book-appointment")} className="bg-blue-600 text-white px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center gap-3">
               Book Appointment <ArrowRight size={16} />
             </button>
             <button onClick={() => navigate("/specialists")} className="bg-white border border-slate-200 px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
               Our Specialists
             </button>
          </div>
        </div>
        
        {/* Visual Decoration */}
        <div className="relative animate-in zoom-in duration-700">
           <div className="bg-slate-900 aspect-square rounded-[4rem] relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent"></div>
              {/* Medical Pulse Animation (Optional CSS) */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <Activity size={180} className="text-white/10" />
              </div>
           </div>
           {/* Floating Info Card */}
           <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <UserCheck size={24}/>
                 </div>
                 <div>
                    <p className="text-2xl font-black text-slate-900">2,500+</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Happy Patients</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* --- 3. Key Services --- */}
      <section className="bg-slate-50 px-10 py-24 rounded-[5rem] mx-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Our Services</p>
             <h2 className="text-4xl font-black tracking-tight">Specialized Medical Areas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Cardiology", desc: "Expert heart care and vascular diagnostics.", icon: <Heart className="text-rose-500" /> },
              { title: "General OPD", desc: "Routine health checkups and basic treatments.", icon: <Activity className="text-blue-500" /> },
              { title: "Laboratory", desc: "Advanced blood tests and diagnostic reports.", icon: <Shield className="text-emerald-500" /> },
            ].map((service, i) => (
              <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all">
                  {service.icon}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-2">{service.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 4. Footer Info --- */}
      <footer className="px-10 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-4">
           <div className="flex items-center gap-2 font-black text-xl tracking-tighter">
             <div className="w-6 h-6 bg-blue-600 rounded-lg"></div>
             <span>MEDICOS</span>
           </div>
           <p className="text-slate-400 text-xs font-medium leading-relaxed">
             Providing the best clinical care for patients in Colombo and surrounding areas since 2010.
           </p>
        </div>
        <div className="space-y-4">
           <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Contact Us</h5>
           <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs font-bold text-slate-500"><Phone size={14}/> 011 234 5678</p>
              <p className="flex items-center gap-2 text-xs font-bold text-slate-500"><MapPin size={14}/> 123, Medical Rd, Colombo</p>
           </div>
        </div>
        <div className="space-y-4">
           <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Opening Hours</h5>
           <p className="flex items-center gap-2 text-xs font-bold text-slate-500"><Clock size={14}/> 24/7 Emergency Care</p>
           <p className="text-[10px] text-slate-400 italic">OPD: 8.00 AM - 10.00 PM</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;