import React, { useState } from 'react';
import { 
  FileText, Download, Wallet, Activity, ShieldCheck, 
  CheckCircle, ArrowUpRight, ArrowDownLeft, Eye, Printer, Search
} from 'lucide-react';
import { formatRupiah, calculatePsak109Summary } from '../services/accountingService';

export default function TransparansiView({ transactions = [], campaigns = [], onSelectTransaction }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const summary = calculatePsak109Summary(transactions, campaigns);

  const verifiedTrx = transactions.filter(t => t.status === 'verified');

  const filteredTrx = verifiedTrx.filter(t => {
    const matchesCat = filterCategory === 'all' || t.category_id === filterCategory;
    const matchesSearch = t.program_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.trx_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.is_anonymous ? 'hamba allah' : t.munfiq_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-200 gap-4">
        <div>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 inline-block">
            Standard Syariat PSAK 109
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">Transparansi Keuangan Publik</h2>
          <p className="text-slate-500 text-sm mt-1">
            Laporan pertanggungjawaban real-time penerimaan dan penyaluran dana infaq Lajnah Maaliyah Al-Hasaniyyah.
          </p>
        </div>

        <button 
          onClick={handlePrintReport}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors text-sm cursor-pointer self-start md:self-auto"
        >
          <Printer size={18} />
          <span>Cetak Laporan Publik (PDF)</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-800 to-blue-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Penerimaan Infaq</p>
            <h3 className="text-3xl font-extrabold">{formatRupiah(summary.totalIn)}</h3>
            <p className="text-xs text-blue-200 mt-2">
              Terikat: {formatRupiah(summary.terikatIn)} | Mutlaq: {formatRupiah(summary.mutlaqIn)}
            </p>
          </div>
          <Wallet size={100} className="absolute -right-6 -bottom-6 text-blue-700/40" />
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Penyaluran Realisasi</p>
            <h3 className="text-3xl font-extrabold">{formatRupiah(summary.totalOut)}</h3>
            <p className="text-xs text-blue-100 mt-2">
              Penyaluran Terikat: {formatRupiah(summary.terikatOut)}
            </p>
          </div>
          <Activity size={100} className="absolute -right-6 -bottom-6 text-blue-500/40" />
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Saldo Kas Kasih Ummat</p>
            <h3 className="text-3xl font-extrabold">{formatRupiah(summary.totalBalance)}</h3>
            <p className="text-xs text-emerald-100 mt-2">
              Saldo Terikat: {formatRupiah(summary.terikatBalance)}
            </p>
          </div>
          <ShieldCheck size={100} className="absolute -right-6 -bottom-6 text-emerald-500/40" />
        </div>
      </div>

      {/* Search & Category Filters */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi / program..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'all' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Jenis
            </button>
            <button
              onClick={() => setFilterCategory('cat-1')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'cat-1' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Terikat (Muqayyad)
            </button>
            <button
              onClick={() => setFilterCategory('cat-2')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                filterCategory === 'cat-2' ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tidak Terikat
            </button>
          </div>
        </div>

        {/* Table Log Penyaluran & Penerimaan */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-5 py-3.5">Kode / Tanggal</th>
                <th className="px-5 py-3.5">Tipe</th>
                <th className="px-5 py-3.5">Donatur / Program</th>
                <th className="px-5 py-3.5">Nominal</th>
                <th className="px-5 py-3.5 text-center">E-Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTrx.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-400 text-sm">
                    Tidak ada log transaksi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredTrx.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-xs text-slate-800">{trx.trx_code}</div>
                      <div className="text-xs text-slate-400">{trx.date}</div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      {trx.type === 'IN' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <ArrowDownLeft size={14} className="mr-1" /> Kas Masuk
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <ArrowUpRight size={14} className="mr-1" /> Penyaluran
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-800">{trx.program_title}</div>
                      <div className="text-xs text-slate-500">
                        Donatur: <strong>{trx.is_anonymous ? 'Hamba Allah' : trx.munfiq_name}</strong>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-extrabold whitespace-nowrap">
                      <span className={trx.type === 'IN' ? 'text-emerald-700' : 'text-rose-600'}>
                        {trx.type === 'IN' ? '+' : '-'} {formatRupiah(trx.amount)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onSelectTransaction(trx)}
                        className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Eye size={14} />
                        <span>Kwitansi</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
