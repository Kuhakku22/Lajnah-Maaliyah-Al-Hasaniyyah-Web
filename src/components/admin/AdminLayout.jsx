import React from 'react';
import { 
  LayoutDashboard, ShieldCheck, PieChart, Users, Award, 
  Globe, LogOut, ExternalLink, ChevronRight
} from 'lucide-react';

export default function AdminLayout({ 
  adminUser, 
  activeAdminTab, 
  setActiveAdminTab, 
  onLogout, 
  onGoToPublic, 
  children 
}) {
  const menuItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'approval', label: 'Approval System (Otorisasi)', icon: <ShieldCheck size={18} /> },
    { id: 'ledger', label: 'Laporan PSAK 109 & Ledger', icon: <PieChart size={18} /> },
    { id: 'crm', label: 'Database Munfiq & Kas', icon: <Users size={18} /> },
    { id: 'public_mgmt', label: 'Kelola Konten Publik', icon: <Globe size={18} /> },
    { id: 'admin_mgmt', label: 'Kelola Campaign & User', icon: <Award size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 shadow-2xl z-30">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-900 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-amber-400 font-extrabold flex items-center justify-center text-sm border border-blue-700 shadow-md">
              LM
            </div>
            <div>
              <h1 className="font-extrabold text-white text-sm tracking-wide">PORTAL ADMIN</h1>
              <p className="text-[10px] text-slate-500 font-medium">Lajnah Maaliyah Al-Hasaniyyah</p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-4 bg-slate-900/80 rounded-2xl border border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-extrabold text-sm border border-blue-600">
                {adminUser.name ? adminUser.name.charAt(0) : 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{adminUser.name || 'Pengurus Lajnah'}</p>
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded border bg-blue-900 text-blue-200 border-blue-700 mt-0.5">
                  Pengurus Terpadu
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Menu Items */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Menu Utama Admin Lajnah
            </div>
            {menuItems.map((item) => {
              const isActive = activeAdminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveAdminTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Actions */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          {onGoToPublic && (
            <button
              onClick={onGoToPublic}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-800"
            >
              <div className="flex items-center space-x-2">
                <ExternalLink size={14} />
                <span>Lihat Website Publik</span>
              </div>
              <ChevronRight size={14} />
            </button>
          )}

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            <span>Keluar Portal Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Admin Top Header */}
        <header className="bg-white border-b border-slate-200 py-4 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium">System Online - Realtime Dual-Way Cloud Sync</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-500">Status Akses:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-800 border-emerald-300">
              Admin Lajnah Maaliyah
            </span>
          </div>
        </header>

        {/* Dynamic Admin Body */}
        <main className="p-8 flex-1">
          {children}
        </main>
      </div>

    </div>
  );
}
