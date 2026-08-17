import React from 'react';
import { 
  Wallet, ShieldCheck, Activity, Users, Building, 
  ArrowUpRight, ArrowDownLeft, CheckCircle, AlertTriangle, ChevronRight
} from 'lucide-react';
import { formatRupiah, calculatePsak109Summary } from '../../services/accountingService';

export default function AdminOverview({ 
  adminUser, 
  transactions = [], 
  disbursements = [], 
  campaigns = [], 
  setActiveAdminTab 
}) {
  const summary = calculatePsak109Summary(transactions, campaigns);
  const pendingCount = disbursements.filter(d => d.approval_status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full uppercase inline-block mb-3">
            Dashboard Eksekutif Pengurus
          </span>
          <h2 className="text-3xl font-extrabold mb-2">Selamat Datang Kembali, {adminUser.name}!</h2>
          <p className="text-blue-200 text-sm max-w-xl leading-relaxed">
            Anda terautentikasi sebagai <strong className="text-white">{adminUser.roleLabel}</strong>. Seluruh aktivitas pencatatan keuangan tersinkronisasi otomatis dengan standar akuntansi PSAK 109.
          </p>
        </div>
      </div>

      {/* Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Kas & Bank Berjalan</p>
            <h3 className="text-2xl font-extrabold text-blue-950">{formatRupiah(summary.totalBalance)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">PSAK 109 Verified</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Wallet size={24} />
          </div>
        </div>

        <div 
          onClick={() => setActiveAdminTab('approval')}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between cursor-pointer hover:border-purple-300 transition-all group"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Otorisasi Pimpinan</p>
            <h3 className="text-2xl font-extrabold text-purple-900">{pendingCount} Pengajuan</h3>
            <span className="text-[11px] text-purple-600 font-bold block mt-1 group-hover:underline">
              {pendingCount > 0 ? 'Menunggu peninjauan →' : 'Semua telah ditinjau'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Realisasi Infaq</p>
            <h3 className="text-2xl font-extrabold text-emerald-700">{formatRupiah(summary.totalIn)}</h3>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Inbound Verified</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ArrowDownLeft size={24} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Penyaluran</p>
            <h3 className="text-2xl font-extrabold text-rose-600">{formatRupiah(summary.totalOut)}</h3>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">Outbound Realisasi</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ArrowUpRight size={24} />
          </div>
        </div>

      </div>

      {/* Breakdown Dana Syar'i PSAK 109 */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Alokasi Saldo Syar'i (PSAK 109)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 uppercase block mb-1">1. Dana Terikat (Muqayyad)</span>
            <h4 className="text-2xl font-extrabold text-blue-950">{formatRupiah(summary.terikatBalance)}</h4>
            <p className="text-xs text-slate-600 mt-2">Pembangunan Asrama, Santunan Yatim</p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase block mb-1">2. Dana Tidak Terikat (Mutlaq)</span>
            <h4 className="text-2xl font-extrabold text-amber-950">{formatRupiah(summary.mutlaqBalance)}</h4>
            <p className="text-xs text-slate-600 mt-2">Infaq umum maslahat ummat</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-bold text-emerald-800 uppercase block mb-1">3. Dana Amil & Operasional</span>
            <h4 className="text-2xl font-extrabold text-emerald-950">{formatRupiah(summary.amilBalance)}</h4>
            <p className="text-xs text-slate-600 mt-2">Operasional IT, server & amil</p>
          </div>
        </div>
      </div>

    </div>
  );
}
