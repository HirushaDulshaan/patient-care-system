import { useState } from 'react';

const StaffManagement = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Staff Management</h2>
                        <p className="text-slate-500 font-medium mt-1">Manage hospital support staff including Nurses and Receptionists.</p>
                    </div>
                    <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-xs uppercase tracking-widest">
                        Administrator Mode
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- Left: Registration Form --- */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-black text-slate-800 mb-6">Register New Staff</h3>

                            <form className="space-y-4">
                                {/* Basic Info */}
                                <input type="text" placeholder="First Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                                <input type="text" placeholder="Last Name" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                                <input type="text" placeholder="Contact Number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                                <input type="email" placeholder="Email Address" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:ring-2 focus:ring-blue-500 transition-all" />
                                
                                {/* Address Details */}
                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Address Details</label>
                                    <input type="text" placeholder="Address Line 1" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm mb-3" />
                                    <input type="text" placeholder="Address Line 2" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm mb-3" />
                                    <input type="text" placeholder="City" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                                </div>

                                {/* Designation Selection */}
                                <div className="pt-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Assign Role</label>
                                    <select className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl outline-none font-black text-blue-600 text-sm appearance-none">
                                        <option value="Nurse">Nurse</option>
                                        <option value="Receptionist">Receptionist</option>
                                        <option value="Pharmacist">Pharmacist</option>
                                    </select>
                                </div>

                                <button className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] mt-6 shadow-xl active:scale-95 transition-all">
                                    COMPLETE REGISTRATION
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- Right: Staff Directory --- */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Active Support Staff</h3>
                                <div className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Verified Staff</div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <th className="pb-4">Staff Member</th>
                                            <th className="pb-4">Designation</th>
                                            <th className="pb-4">Contact Info</th>
                                            <th className="pb-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {/* Sample Staff Row */}
                                        <tr className="hover:bg-slate-50/50 transition">
                                            <td className="py-6">
                                                <p className="font-bold text-slate-800 text-sm">Sanduni Perera</p>
                                                <p className="text-[10px] text-slate-400">Main Street, Kandy</p>
                                            </td>
                                            <td className="py-6">
                                                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">Nurse</span>
                                            </td>
                                            <td className="py-6">
                                                <p className="text-[11px] font-bold text-slate-600">sanduni@hospital.com</p>
                                                <p className="text-[10px] text-slate-400">+94 77 123 4567</p>
                                            </td>
                                            <td className="py-6 text-right">
                                                <button className="text-slate-300 hover:text-red-500 font-black text-[10px] transition">DELETE</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StaffManagement;