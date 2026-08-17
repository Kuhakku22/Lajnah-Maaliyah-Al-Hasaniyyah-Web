import React, { useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';
import { formatRupiah, validateProgramBalance } from '../services/accountingService';

export default function ApprovalView({ 
  showToast, 
  transactions = [], 
  disbursements = [], 
  campaigns = [], 
  onApproveDisbursement, 
  onRejectDisbursement 
}) {
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Find all pending disbursement transactions
  const pendingDisbursements = disbursements.filter(d => d.approval_status === 'pending');

  const getTransactionDetail = (trxId) => {
    return transactions.find(t => t.id === trxId);
  };

  const handleApprove = (disbursementId, trxId) => {
    const trx = getTransactionDetail(trxId);
    if (trx) {
      const balanceCheck = validateProgramBalance(trx.program_id, trx.amount, transactions, campaigns);
      if (!balanceCheck.valid) {
        showToast(balanceCheck.message, "warning");
        return;
      }
    }

    onApproveDisbursement(disbursementId, trxId, approvalNotes || 'Disetujui oleh Pimpinan Lajnah');
    setSelectedDisbursement(null);
    setApprovalNotes('');
    showToast("Pengeluaran kas telah DISETUJUI oleh Pimpinan & otomatis diposting ke Jurnal Ledger.", "success");
  };

  const handleReject = (disbursementId, trxId) => {
    onRejectDisbursement(disbursementId, trxId, approvalNotes || 'Ditolak oleh Pimpinan Lajnah');
    setSelectedDisbursement(null);
    setApprovalNotes('');
    showToast("Pengeluaran kas telah DITOLAK.", "warning");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Otorisasi Pimpinan Lajnah
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Dashboard Persetujuan (Approval System)</h2>
          <p className="text-slate-500 text-sm">
            Tinjau draf pengeluaran kas dari Bendahara, validasi nota toko, bukti kegiatan, dan kecukupan saldo dana Terikat.
          </p>
        </div>

        <div className="bg-white border border-purple-200 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm mt-4 md:mt-0">
          <ShieldCheck size={28} className="text-purple-700" />
          <div>
            <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider block">Menunggu Otorisasi</span>
            <span className="text-lg font-bold text-slate-800">{pendingDisbursements.length} Pengajuan</span>
          </div>
        </div>
      </div>

      {pendingDisbursements.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <CheckCircle size={56} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Semua Pengeluaran Telah Ditinjau!</h3>
          <p className="text-slate-500 text-sm">
            Tidak ada draf pengeluaran kas yang membutuhkan otorisasi Pimpinan saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Disbursement List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Daftar Draf Pengeluaran</h3>

            {pendingDisbursements.map((dsb) => {
              const trx = getTransactionDetail(dsb.transaction_id);
              if (!trx) return null;
              
              const isSelected = selectedDisbursement?.id === dsb.id;
              const balanceCheck = validateProgramBalance(trx.program_id, trx.amount, transactions, campaigns);

              return (
                <div
                  key={dsb.id}
                  onClick={() => setSelectedDisbursement(dsb)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    isSelected ? 'border-purple-600 shadow-md ring-2 ring-purple-100' : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{trx.trx_code}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      Pending Approval
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-800 text-sm mb-1">{trx.program_title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{trx.notes}</p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Pengajuan:</span>
                    <span className="font-extrabold text-rose-600 text-base">{formatRupiah(trx.amount)}</span>
                  </div>

                  {!balanceCheck.valid && (
                    <div className="mt-3 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] p-2 rounded-lg flex items-center space-x-1.5">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>Saldo program tidak mencukupi!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Disbursement Detail Inspection Panel */}
          <div className="lg:col-span-2">
            {selectedDisbursement ? (
              (() => {
                const trx = getTransactionDetail(selectedDisbursement.transaction_id);
                if (!trx) return null;
                const balanceCheck = validateProgramBalance(trx.program_id, trx.amount, transactions, campaigns);

                return (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs text-purple-700 font-bold uppercase tracking-wider block mb-1">Pemeriksaan Otorisasi</span>
                        <h3 className="text-2xl font-extrabold text-slate-900">{trx.program_title}</h3>
                        <p className="text-xs text-slate-400 mt-1">Diajukan oleh: {selectedDisbursement.requested_by}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">Nominal Pengeluaran</span>
                        <span className="text-2xl font-extrabold text-rose-600">{formatRupiah(trx.amount)}</span>
                      </div>
                    </div>

                    {/* Saldo Checking Box */}
                    <div className={`p-4 rounded-2xl border ${balanceCheck.valid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                      <div className="flex items-center space-x-2 font-bold text-sm mb-1">
                        {balanceCheck.valid ? <CheckCircle className="text-emerald-600" size={18} /> : <AlertTriangle className="text-rose-600" size={18} />}
                        <span>Status Kecukupan Saldo Program Syar'i</span>
                      </div>
                      <p className="text-xs">{balanceCheck.message}</p>
                    </div>

                    {/* Attachment Proof Images */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center space-x-2">
                        <ImageIcon size={16} className="text-slate-500" />
                        <span>Dokumentasi & Attachment Wajib (Nota Toko / Kwitansi)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <p className="text-xs font-bold text-slate-600 mb-2">1. Nota Toko / Receipt Material</p>
                          <img 
                            src={selectedDisbursement.receipt_image || trx.proof_image} 
                            alt="Nota" 
                            className="w-full h-40 object-cover rounded-xl border border-slate-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                          <p className="text-xs font-bold text-slate-600 mb-2">2. Foto Dokumentasi Kegiatan</p>
                          <img 
                            src={selectedDisbursement.documentation_image || trx.proof_image} 
                            alt="Foto Kegiatan" 
                            className="w-full h-40 object-cover rounded-xl border border-slate-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1593113589914-07553f1bd82f?auto=format&fit=crop&q=80";
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Approval Action Form */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Catatan Otorisasi Pimpinan (Opsional)</label>
                        <textarea
                          rows="2"
                          value={approvalNotes}
                          onChange={(e) => setApprovalNotes(e.target.value)}
                          placeholder="Masukkan alasan atau arahan persetujuan..."
                          className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-purple-600"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleApprove(selectedDisbursement.id, trx.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer shadow-md"
                        >
                          <CheckCircle size={18} />
                          <span>Setujui Pengeluaran (Approve)</span>
                        </button>

                        <button
                          onClick={() => handleReject(selectedDisbursement.id, trx.id)}
                          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm cursor-pointer shadow-md"
                        >
                          <XCircle size={18} />
                          <span>Tolak Pengeluaran (Reject)</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                <FileText size={48} className="mx-auto mb-3" />
                <p className="font-semibold text-sm">Pilih salah satu draf pengeluaran di sebelah kiri untuk ditinjau.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
