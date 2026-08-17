import React from 'react';
import { 
  Heart, FileText, Building, Users, Globe, Wallet, 
  Activity, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp
} from 'lucide-react';
import { formatRupiah, calculatePsak109Summary } from '../services/accountingService';

export default function BerandaView({ navigateToInfaq, setActiveTab, transactions, campaigns }) {
  const summary = calculatePsak109Summary(transactions, campaigns);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative bg-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/bg-hero.png" 
            alt="Gedung Pondok Lajnah" 
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/85 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col justify-center min-h-[520px]">
          <div className="flex items-center space-x-2 mb-4">
            <span className="inline-flex items-center space-x-1.5 py-1 px-3.5 rounded-full bg-blue-900/80 text-blue-200 text-xs font-semibold border border-blue-700/60 shadow-sm backdrop-blur-md">
              <ShieldCheck size={14} className="text-amber-400" />
              <span>Standar Akuntansi PSAK 109</span>
            </span>
            <span className="inline-flex items-center py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/40">
              Transparan 100%
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl">
            Satu Langkah Infaq Anda,<br/> 
            <span className="text-amber-400">Jutaan Kebaikan Tercipta.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            Salurkan Infaq Terikat, Sedekah, dan Zakat Anda melalui <strong>Lajnah Maaliyah Al-Hasaniyyah</strong>. Pencatatan keuangan syariah yang akuntabel, terpisah secara syar'i, dan dipublikasikan secara terbuka.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigateToInfaq('pembangunan')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Heart size={20} />
              <span>Mulai Donasi Sekarang</span>
            </button>
            <button 
              onClick={() => setActiveTab('transparansi')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all text-lg flex items-center justify-center space-x-2 cursor-pointer"
            >
              <FileText size={20} />
              <span>Lihat Transparansi Dana</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Financial Tracker Widgets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Donasi Terkumpul</p>
              <h3 className="text-2xl font-extrabold text-blue-900">{formatRupiah(summary.totalIn)}</h3>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
                <CheckCircle2 size={12} className="mr-1" /> Terverifikasi PSAK 109
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Wallet size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Penyaluran</p>
              <h3 className="text-2xl font-extrabold text-blue-800">{formatRupiah(summary.totalOut)}</h3>
              <span className="text-[11px] text-blue-600 font-semibold flex items-center mt-1">
                <Activity size={12} className="mr-1" /> Otorisasi Pimpinan
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Saldo Kas Berjalan</p>
              <h3 className="text-2xl font-extrabold text-emerald-600">{formatRupiah(summary.totalBalance)}</h3>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Dana Terikat: {formatRupiah(summary.terikatBalance)}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Heart size={24} />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Program Kampanye</p>
              <h3 className="text-2xl font-extrabold text-slate-800">{summary.activeCampaigns} Program</h3>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Aktif & Transparan
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <Building size={24} />
            </div>
          </div>

        </div>
      </div>

      {/* Main Campaign List with Progress Bars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-blue-700 font-bold text-xs uppercase tracking-wider">Program Unggulan</span>
            <h2 className="text-3xl font-bold text-slate-800 mt-1">Salurkan Infaq Pada Campaign Syar'i</h2>
          </div>
          <button 
            onClick={() => setActiveTab('transparansi')}
            className="text-blue-700 font-bold text-sm hover:text-blue-900 flex items-center space-x-1 mt-4 md:mt-0"
          >
            <span>Lihat Laporan Transparansi Lengkap</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((cmp) => {
            const pct = cmp.target_amount > 0 
              ? Math.min(100, Math.round((cmp.current_amount / cmp.target_amount) * 100))
              : 100;

            return (
              <div key={cmp.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-200 overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="h-52 overflow-hidden relative bg-slate-100">
                    <img 
                      src={cmp.img} 
                      alt={cmp.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-blue-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 backdrop-blur-md">
                      <Building size={14} className="text-amber-400" />
                      <span>{cmp.category_name}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{cmp.title}</h3>
                    <p className="text-slate-600 text-xs mb-6 line-clamp-2 leading-relaxed">{cmp.description}</p>

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Terkumpul</span>
                        <span className="text-blue-800">{pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs pt-1">
                        <span className="font-bold text-slate-800">{formatRupiah(cmp.current_amount)}</span>
                        {cmp.target_amount > 0 && (
                          <span className="text-slate-400">Target: {formatRupiah(cmp.target_amount)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button 
                    onClick={() => navigateToInfaq(cmp.slug || 'pembangunan')} 
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-colors shadow-sm text-sm cursor-pointer"
                  >
                    Donasi Sekarang
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
