import React, { useState } from 'react';
import { 
  Home, Activity, Heart, FileText, Users, ShieldCheck, 
  Menu, X, LogOut, CheckCircle, ChevronDown, Award, PieChart
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeRole, setActiveRole, navigateToInfaq }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const rolesList = [
    { id: 'public', label: 'Donatur / Publik', badge: 'Publik', color: 'bg-emerald-600' },
    { id: 'bendahara', label: 'Bendahara / Keuangan', badge: 'Keuangan', color: 'bg-blue-600' },
    { id: 'pimpinan', label: 'Pimpinan / Ketua Lajnah', badge: 'Approval', color: 'bg-purple-600' },
    { id: 'admin', label: 'Superadmin Pusat', badge: 'Admin', color: 'bg-rose-600' },
  ];

  const currentRoleObj = rolesList.find(r => r.id === activeRole) || rolesList[0];

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: <Home size={18} /> },
    { id: 'kegiatan', label: 'Kegiatan', icon: <Activity size={18} /> },
    { id: 'transparansi', label: 'Transparansi', icon: <FileText size={18} /> },
    { id: 'alumni', label: 'Portal Alumni', icon: <Users size={18} /> },
  ];

  // Internal Management Nav Items
  const internalNavItems = [];
  if (activeRole === 'pimpinan' || activeRole === 'admin') {
    internalNavItems.push({ id: 'approval', label: 'Persetujuan (Approval)', icon: <ShieldCheck size={18} />, badge: 'Pimpinan' });
  }
  if (activeRole === 'bendahara' || activeRole === 'pimpinan' || activeRole === 'admin') {
    internalNavItems.push({ id: 'ledger', label: 'Laporan PSAK 109', icon: <PieChart size={18} /> });
    internalNavItems.push({ id: 'crm', label: 'Database Munfiq', icon: <Users size={18} /> });
  }
  if (activeRole === 'admin') {
    internalNavItems.push({ id: 'admin_mgmt', label: 'Kelola Campaign', icon: <Award size={18} /> });
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Banner Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Standar Syariat <strong>PSAK 109</strong> - Lajnah Maaliyah Al-Hasaniyyah</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-full text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Role Penguji:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] text-white ${currentRoleObj.color}`}>
                {currentRoleObj.label}
              </span>
              <ChevronDown size={14} />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Pilih Akses Pengguna
                </div>
                {rolesList.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setActiveRole(r.id);
                      setIsRoleDropdownOpen(false);
                      if (r.id === 'pimpinan') setActiveTab('approval');
                      else if (r.id === 'bendahara') setActiveTab('ledger');
                      else if (r.id === 'admin') setActiveTab('admin_mgmt');
                      else setActiveTab('beranda');
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      activeRole === r.id ? 'font-bold bg-blue-50 text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <span>{r.label}</span>
                    {activeRole === r.id && <CheckCircle size={14} className="text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center cursor-pointer space-x-3" onClick={() => setActiveTab('beranda')}>
            <img 
              src="/logo-dalwa.png" 
              alt="Lajnah Maaliyah Al Hasaniyyah Dalwa" 
              className="h-16 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/180x60/1e3a8a/ffffff?text=Lajnah+Maaliyah";
              }}
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id ? 'text-blue-800 bg-blue-50 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Internal Menu Items if logged in as management */}
            {internalNavItems.length > 0 && (
              <div className="border-l border-slate-200 pl-2 ml-1 flex items-center space-x-1">
                {internalNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 text-sm font-medium transition-colors relative cursor-pointer ${
                      activeTab === item.id ? 'text-purple-900 bg-purple-50 font-bold border border-purple-200' : 'text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 bg-amber-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Primary Action Button (INFAQ SEKARANG) */}
            <div className="pl-3">
              <button 
                onClick={() => navigateToInfaq('pembangunan')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer animate-pulse hover:animate-none text-sm"
              >
                <Heart size={16} />
                <span>INFAQ SEKARANG</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-blue-700 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full z-50">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium ${
                  activeTab === item.id ? 'text-blue-800 bg-blue-50 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {internalNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium ${
                  activeTab === item.id ? 'text-purple-800 bg-purple-50 font-bold' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button 
              onClick={() => {
                navigateToInfaq('pembangunan');
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-4 bg-amber-500 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 shadow-md"
            >
              <Heart size={18} />
              <span>INFAQ SEKARANG</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
