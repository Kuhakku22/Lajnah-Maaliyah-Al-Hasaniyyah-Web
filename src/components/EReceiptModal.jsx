import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck, Heart } from 'lucide-react';
import { formatRupiah } from '../services/accountingService';

export default function EReceiptModal({ transaction, onClose }) {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const donorDisplayName = transaction.is_anonymous ? 'Hamba Allah' : (transaction.munfiq_name || 'Hamba Allah');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none">
        
        {/* Header Action Bar (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-emerald-400" size={20} />
            <span className="font-bold text-sm">E-Receipt / Kwitansi Resmi (PSAK 109)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-printable" className="p-8 sm:p-10 bg-white">
          
          {/* Header Branding */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">LAJNAH MAALIYAH AL-HASANIYYAH</h2>
              <p className="text-xs text-slate-600 font-medium">Lembaga Pengelola Infaq & Zakat Terdaftar (PSAK 109)</p>
              <p className="text-[11px] text-slate-400 mt-1">Jl. Pesantren No. 1, Kota Santri | Email: info@alhasaniyyah.org</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full uppercase border border-emerald-300">
                VERIFIED E-RECEIPT
              </span>
              <p className="text-xs text-slate-500 font-mono mt-2">{transaction.trx_code}</p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center my-6">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">TANDA TERIMA INFAQ / SEDEKAH</h3>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-1 rounded-full"></div>
          </div>

          {/* Details Table */}
          <div className="space-y-4 text-sm text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-200/80 mb-6">
            <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-slate-500 font-medium">Nomor Transaksi</span>
              <span className="col-span-2 font-mono font-bold text-slate-800">{transaction.trx_code}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-slate-500 font-medium">Tanggal Diterima</span>
              <span className="col-span-2 font-semibold text-slate-800">{transaction.date}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-slate-500 font-medium">Telah Diterima Dari</span>
              <span className="col-span-2 font-bold text-blue-900 text-base">{donorDisplayName}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-slate-500 font-medium">Program Donasi</span>
              <span className="col-span-2 font-semibold text-slate-800">{transaction.program_title || 'Infaq Umum'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-slate-200/60 pb-3">
              <span className="text-slate-500 font-medium">Metode Pembayaran</span>
              <span className="col-span-2 font-medium text-slate-800">{transaction.payment_method || 'Transfer Bank'}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 items-center pt-1">
              <span className="text-slate-500 font-medium">Jumlah Terbilang</span>
              <div className="col-span-2 bg-emerald-600 text-white font-extrabold text-lg px-4 py-2 rounded-xl shadow-inner">
                {formatRupiah(transaction.amount)}
              </div>
            </div>
          </div>

          {/* Signatures & Stamp */}
          <div className="grid grid-cols-2 gap-4 items-end mt-8 pt-4">
            <div className="flex items-center space-x-3 bg-blue-50 p-3 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                QR
              </div>
              <div className="text-[10px] text-blue-800">
                <p className="font-bold">Otentikasi Digital</p>
                <p>Status: PSAK 109 Validated</p>
                <p className="text-slate-400">{new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="text-center text-xs">
              <p className="text-slate-400 mb-12">Pengurus Lajnah Maaliyah,</p>
              <p className="font-bold text-slate-900 underline">Ustadz Ahmad Farisi</p>
              <p className="text-[10px] text-slate-500">Bendahara Umum</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 italic">
            "Jazakumullahu khairan katsiran. Semoga infaq ini menjadi amal jariyah yang terus mengalir pahalanya."
          </div>
        </div>

        {/* Action Footer (Hidden in Print) */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-right print:hidden">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
