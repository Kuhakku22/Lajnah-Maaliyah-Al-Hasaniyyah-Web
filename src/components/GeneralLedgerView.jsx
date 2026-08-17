import React, { useState } from 'react';
import { 
  PieChart, FileSpreadsheet, Printer, Download, 
  ArrowDownLeft, ArrowUpRight, ShieldCheck, Wallet, RefreshCw
} from 'lucide-react';
import { formatRupiah, calculatePsak109Summary } from '../services/accountingService';

export default function GeneralLedgerView({ transactions = [], ledgers = [], campaigns = [] }) {
  const [activeSubTab, setActiveSubTab] = useState('mutasi'); // 'mutasi', 'neraca', 'cashflow', 'ledger'

  const summary = calculatePsak109Summary(transactions, campaigns);

  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Modul Akuntansi PSAK 109
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Laporan Keuangan & Buku Besar (Ledger)</h2>
          <p className="text-slate-500 text-sm">
            Sistem pencatatan Double-Entry Bookkeeping berstandar PSAK 109 (Zakat & Infaq).
          </p>
        </div>

        <button 
          onClick={handlePrintLedger}
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors text-sm cursor-pointer mt-4 md:mt-0"
        >
          <Printer size={18} />
          <span>Cetak Laporan PSAK 109 (PDF)</span>
        </button>
      </div>

      {/* Sub Tabs Nav */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('mutasi')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'mutasi' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          1. Laporan Perubahan Dana (Mutasi PSAK 109)
        </button>

        <button
          onClick={() => setActiveSubTab('neraca')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'neraca' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          2. Laporan Posisi Keuangan (Neraca)
        </button>

        <button
          onClick={() => setActiveSubTab('cashflow')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'cashflow' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          3. Laporan Arus Kas (Cashflow)
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
            activeSubTab === 'ledger' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          4. Jurnal Buku Besar (Double-Entry)
        </button>
      </div>

      {/* 1. TAB LAPORAN PERUBAHAN DANA (MUTASI PSAK 109) */}
      {activeSubTab === 'mutasi' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Laporan Perubahan Dana (Mutasi) - PSAK 109</h3>
            <p className="text-xs text-slate-500">Pemisahan pencatatan Saldo Dana Terikat, Dana Tidak Terikat, dan Dana Amil.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Komponen Dana Syar'i</th>
                  <th className="px-6 py-4 text-right">Saldo Awal</th>
                  <th className="px-6 py-4 text-right text-emerald-300">Penerimaan (+)</th>
                  <th className="px-6 py-4 text-right text-rose-300">Penyaluran (-)</th>
                  <th className="px-6 py-4 text-right font-extrabold text-amber-300">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div>1. Dana Infaq / Sedekah Terikat (Muqayyad)</div>
                    <span className="text-xs font-normal text-slate-400">Pembangunan Asrama, Santunan Yatim</span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 font-mono">{formatRupiah(150000000)}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700 font-mono">{formatRupiah(summary.terikatIn)}</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600 font-mono">{formatRupiah(summary.terikatOut)}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-blue-900 font-mono bg-blue-50">
                    {formatRupiah(150000000 + summary.terikatBalance)}
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div>2. Dana Infaq / Sedekah Tidak Terikat (Mutlaq)</div>
                    <span className="text-xs font-normal text-slate-400">Infaq umum fleksibel maslahat ummat</span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 font-mono">{formatRupiah(82000000)}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700 font-mono">{formatRupiah(summary.mutlaqIn)}</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600 font-mono">{formatRupiah(summary.mutlaqOut)}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-blue-900 font-mono bg-blue-50">
                    {formatRupiah(82000000 + summary.mutlaqBalance)}
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div>3. Dana Amil & Operasional</div>
                    <span className="text-xs font-normal text-slate-400">Operasional server, admin & hak amil</span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600 font-mono">{formatRupiah(18000000)}</td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-700 font-mono">{formatRupiah(summary.amilIn)}</td>
                  <td className="px-6 py-4 text-right font-bold text-rose-600 font-mono">{formatRupiah(summary.amilOut)}</td>
                  <td className="px-6 py-4 text-right font-extrabold text-blue-900 font-mono bg-blue-50">
                    {formatRupiah(18000000 + summary.amilBalance)}
                  </td>
                </tr>

                {/* TOTAL */}
                <tr className="bg-slate-100 font-extrabold text-slate-900 text-base">
                  <td className="px-6 py-4 uppercase">TOTAL DANA NETTO (PSAK 109)</td>
                  <td className="px-6 py-4 text-right font-mono">{formatRupiah(250000000)}</td>
                  <td className="px-6 py-4 text-right text-emerald-700 font-mono">{formatRupiah(summary.totalIn)}</td>
                  <td className="px-6 py-4 text-right text-rose-700 font-mono">{formatRupiah(summary.totalOut)}</td>
                  <td className="px-6 py-4 text-right text-blue-950 font-mono bg-amber-100 border-t-2 border-slate-900">
                    {formatRupiah(250000000 + summary.totalBalance)}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TAB LAPORAN POSISI KEUANGAN (NERACA) */}
      {activeSubTab === 'neraca' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Laporan Posisi Keuangan (Neraca)</h3>
            <p className="text-xs text-slate-500">Penyajian Aset Kas & Bank vs Kewajiban & Saldo Dana Netto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* SISI ASET */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider border-b pb-2">ASET (AKTIVA)</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Kas & Bank Syariah (BSI Utama)</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(210000000 + summary.totalBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Kas Tunai Brankas Lajnah</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(40000000)}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-slate-300 flex justify-between font-extrabold text-blue-950 text-base">
                <span>TOTAL ASET</span>
                <span className="font-mono">{formatRupiah(250000000 + summary.totalBalance)}</span>
              </div>
            </div>

            {/* SISI KEWAJIBAN & SALDO DANA */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider border-b pb-2">KEWAJIBAN & SALDO DANA (PASIVA)</h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Kewajiban / Hutang Operasional</span>
                  <span className="font-mono font-bold text-slate-800">Rp 0</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Saldo Dana Terikat (Muqayyad)</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(150000000 + summary.terikatBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Saldo Dana Tidak Terikat (Mutlaq)</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(82000000 + summary.mutlaqBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-700">Saldo Dana Amil</span>
                  <span className="font-mono font-bold text-slate-900">{formatRupiah(18000000 + summary.amilBalance)}</span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-slate-300 flex justify-between font-extrabold text-blue-950 text-base">
                <span>TOTAL PASIVA</span>
                <span className="font-mono">{formatRupiah(250000000 + summary.totalBalance)}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. TAB LAPORAN ARUS KAS (CASHFLOW) */}
      {activeSubTab === 'cashflow' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Laporan Arus Kas (Cashflow Statement)</h3>
            <p className="text-xs text-slate-500">Rincian realisasi arus kas masuk dan keluar dari aktivitas penerimaan infaq & penyaluran.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
              <h4 className="font-extrabold text-emerald-900 text-sm mb-2">1. Arus Kas dari Penerimaan Infaq (Inbound)</h4>
              <div className="flex justify-between text-sm font-bold text-emerald-800">
                <span>Total Realisasi Penerimaan Infaq</span>
                <span className="font-mono">+{formatRupiah(summary.totalIn)}</span>
              </div>
            </div>

            <div className="bg-rose-50 p-5 rounded-2xl border border-rose-200">
              <h4 className="font-extrabold text-rose-900 text-sm mb-2">2. Arus Kas dari Penyaluran Program (Outbound)</h4>
              <div className="flex justify-between text-sm font-bold text-rose-800">
                <span>Total Realisasi Penyaluran Program</span>
                <span className="font-mono">-{formatRupiah(summary.totalOut)}</span>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-lg">
              <div>
                <span className="text-xs text-blue-200 font-bold uppercase block">Kenaikan / Penurunan Bersih Kas</span>
                <h4 className="text-2xl font-extrabold">{formatRupiah(summary.totalBalance)}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB JURNAL BUKU BESAR (LEDGER) */}
      {activeSubTab === 'ledger' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Jurnal Buku Besar Double-Entry</h3>
            <p className="text-xs text-slate-500">Pencatatan Debit & Kredit otomatis per mutasi kas.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Tanggal</th>
                  <th className="px-5 py-3.5">Kode Akun</th>
                  <th className="px-5 py-3.5">Nama Akun Jurnal</th>
                  <th className="px-5 py-3.5 text-right">Debit</th>
                  <th className="px-5 py-3.5 text-right">Kredit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {ledgers.map((ldg) => (
                  <tr key={ldg.id} className="hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-medium text-slate-500">{ldg.created_at}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-900">{ldg.account_code}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">{ldg.account_name}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-emerald-700 font-mono">
                      {ldg.debit > 0 ? formatRupiah(ldg.debit) : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-rose-600 font-mono">
                      {ldg.credit > 0 ? formatRupiah(ldg.credit) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
