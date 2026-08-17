import React, { useState } from 'react';
import { Heart, Building, Wallet, ArrowRight, EyeOff, ShieldCheck, CheckCircle } from 'lucide-react';
import { generateTrxCode } from '../services/accountingService';

export default function InfaqView({ showToast, setActiveTab, selectedCategory, setSelectedCategory, campaigns, onAddTransaction }) {
  const [amount, setAmount] = useState(100000);
  const [method, setMethod] = useState('qris');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [notes, setNotes] = useState('');

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast("Nominal infaq harus lebih dari 0", "warning");
      return;
    }

    const selectedCmp = campaigns.find(c => c.slug === selectedCategory || c.id === selectedCategory) || campaigns[0];

    const newTrx = {
      id: `trx-${Date.now()}`,
      trx_code: generateTrxCode('IN'),
      type: 'IN',
      amount: Number(amount),
      date: new Date().toISOString().slice(0,10),
      program_id: selectedCmp.id,
      program_title: selectedCmp.title,
      category_id: selectedCmp.category_id,
      munfiq_name: donorName || 'Hamba Allah',
      munfiq_email: donorEmail,
      is_anonymous: isAnonymous,
      payment_method: method === 'qris' ? 'QRIS' : method === 'va' ? 'Virtual Account' : 'Transfer Bank Manual',
      status: 'verified', // Auto verified for demo
      proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
      notes: notes || 'Infaq online via website'
    };

    onAddTransaction(newTrx);
    showToast(`Alhamdulillah! Donasi sebesar Rp ${amount.toLocaleString('id-ID')} berhasil diterbitkan e-Receipt.`, "success");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in slide-in-from-bottom-6 duration-300">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Form */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-950 px-8 py-10 text-center text-white relative">
          <Heart size={44} className="mx-auto mb-3 text-amber-400 animate-pulse" />
          <h2 className="text-3xl font-extrabold mb-2">Formulir Infaq Syar'i (PSAK 109)</h2>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            Niatkan infaq terbaik Anda. Dana dicatat secara khusus dan transparan sesuai syariat.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          
          {/* 1. Pilih Program Campaign */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3 flex items-center justify-between">
              <span>1. Pilih Program / Kampanye Infaq</span>
              <span className="text-xs text-blue-700 font-normal">Sesuai Peruntukan Syar'i</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {campaigns.map((cmp) => {
                const isSelected = selectedCategory === cmp.slug || selectedCategory === cmp.id;
                return (
                  <button
                    key={cmp.id}
                    type="button"
                    onClick={() => setSelectedCategory(cmp.slug)}
                    className={`flex items-start p-4 rounded-2xl border-2 transition-all text-left cursor-pointer ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm scale-[1.01]' 
                        : 'border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building size={22} className={`mr-3 shrink-0 mt-0.5 ${isSelected ? 'text-blue-700' : 'text-slate-400'}`} />
                    <div>
                      <div className="font-bold text-sm leading-snug">{cmp.title}</div>
                      <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold text-slate-500 mt-1 inline-block">
                        {cmp.category_name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pilih Nominal Donasi */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">2. Nominal Infaq (Rp)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all cursor-pointer ${
                    amount === val 
                      ? 'border-blue-600 bg-blue-50 text-blue-800 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:border-blue-200'
                  }`}
                >
                  Rp {val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold">Rp</span>
              </div>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3.5 focus:ring-0 focus:border-blue-600 outline-none text-lg font-bold text-slate-800 transition-colors"
                placeholder="Masukkan nominal lainnya..."
              />
            </div>
          </div>

          {/* 3. Metode Pembayaran */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3">3. Metode Pembayaran</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMethod('qris')}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  method === 'qris' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-sm font-bold">QRIS Instant</div>
                <span className="text-[10px] text-slate-400 block">Gopay, OVO, Dana</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('va')}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  method === 'va' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-sm font-bold">Virtual Account</div>
                <span className="text-[10px] text-slate-400 block">BSI, BCA, Mandiri</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  method === 'transfer' ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold' : 'border-slate-200 text-slate-600'
                }`}
              >
                <div className="text-sm font-bold">Transfer Bank</div>
                <span className="text-[10px] text-slate-400 block">Manual Verifikasi</span>
              </button>
            </div>
          </div>

          {/* 4. Data Donatur & Toggle Hamba Allah */}
          <div className="mb-8 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700">4. Data Donatur</label>
              
              {/* Toggle Hamba Allah */}
              <label className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-1.5 rounded-full border border-slate-300 shadow-sm">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <EyeOff size={14} className={isAnonymous ? "text-amber-500" : "text-slate-400"} />
                <span className="text-xs font-bold text-slate-700">Hamba Allah (Anonim)</span>
              </label>
            </div>

            {!isAnonymous && (
              <div>
                <input 
                  type="text" 
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Nama Lengkap (Contoh: H. Ahmad Ridwan)" 
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 text-sm bg-white font-medium" 
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="email" 
                required
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                placeholder="Alamat Email (Untuk Kirim e-Receipt)" 
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 text-sm bg-white font-medium" 
              />
              <input 
                type="tel" 
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder="Nomor WhatsApp (Opsional)" 
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600 text-sm bg-white font-medium" 
              />
            </div>

            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pesan / Doa khusus (Opsional)..."
              className="w-full border border-slate-300 rounded-xl px-4 py-2 outline-none focus:border-blue-600 text-sm bg-white font-medium"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Tunaikan Infaq Sekarang</span>
            <ArrowRight size={20} />
          </button>
        </form>

      </div>
    </div>
  );
}
