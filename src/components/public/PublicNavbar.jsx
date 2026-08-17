import React, { useState } from 'react';
import { Home, Activity, FileText, Users, Heart, ShieldCheck, Menu, X } from 'lucide-react';

export default function PublicNavbar({ activeTab, setActiveTab, navigateToInfaq }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: <Home size={18} /> },
    { id: 'kegiatan', label: 'Kegiatan', icon: <Activity size={18} /> },
    { id: 'transparansi', label: 'Transparansi', icon: <FileText size={18} /> },
    { id: 'alumni', label: 'Portal Alumni', icon: <Users size={18} /> },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      {/* Top Standard Syariat Bar */}
      <div className="bg-blue-950 text-slate-200 py-1.5 px-4 text-xs font-medium border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck size={14} className="text-amber-400" />
            <span>Standard Syariat Akuntansi <strong>PSAK 109</strong> - Lajnah Maaliyah Al-Hasaniyyah</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Transparan & Amanah 100%
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('beranda')}>
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
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id ? 'text-blue-900 bg-blue-50 font-bold' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Primary Action Button (INFAQ SEKARANG) */}
            <div className="pl-4">
              <button 
                onClick={() => navigateToInfaq('pembangunan-asrama')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer animate-pulse hover:animate-none text-sm"
              >
                <Heart size={18} />
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
                  activeTab === item.id ? 'text-blue-900 bg-blue-50 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            <button 
              onClick={() => {
                navigateToInfaq('pembangunan-asrama');
                setIsMobileMenuOpen(false);
              }}
              className="w-full mt-2 bg-amber-500 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 shadow-md"
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
