import React, { useState } from 'react';
import { X, Calculator, Wallet, Coins, Briefcase, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../../services/accountingService';

export default function ZakatCalculatorModal({ isOpen, onClose, onApplyZakat }) {
  const [activeTab, setActiveTab] = useState('profesi'); // 'profesi', 'maal', 'emas'

  // Standard Syariat Parameters (Standar 85 gr Emas = Rp 1.000.000 / gr => Nisab Rp 85.000.000 / thn = Rp 7.083.333 / bln)
  const GOLD_PRICE_PER_GRAM = 1000000;
  const NISAB_GOLD_GRAMS = 85;
  const NISAB_MAAL_YEARLY = NISAB_GOLD_GRAMS * GOLD_PRICE_PER_GRAM; // Rp 85.000.000
  const NISAB_PROFESI_MONTHLY = Math.round(NISAB_MAAL_YEARLY / 12); // ~Rp 7.083.333
  const NISAB_SILVER_GRAMS = 595;
  const SILVER_PRICE_PER_GRAM = 12000;

  // State Zakat Profesi
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [otherIncome, setOtherIncome] = useState('');
  
  // State Zakat Maal
  const [savingsAmount, setSavingsAmount] = useState('');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [shortDebts, setShortDebts] = useState('');

  // State Zakat Emas / Perak
  const [goldGrams, setGoldGrams] = useState('');
  const [silverGrams, setSilverGrams] = useState('');

  if (!isOpen) return null;

  // 1. Calculations - Profesi
  const totalMonthlyIncome = (Number(monthlyIncome) || 0) + (Number(otherIncome) || 0);
  const isProfesiObligatory = totalMonthlyIncome >= NISAB_PROFESI_MONTHLY;
  const profesiZakatAmount = isProfesiObligatory ? Math.round(totalMonthlyIncome * 0.025) : 0;

  // 2. Calculations - Maal
  const totalMaalAssets = (Number(savingsAmount) || 0) + (Number(investmentAmount) || 0) - (Number(shortDebts) || 0);
  const netMaalAssets = Math.max(0, totalMaalAssets);
  const isMaalObligatory = netMaalAssets >= NISAB_MAAL_YEARLY;
  const maalZakatAmount = isMaalObligatory ? Math.round(netMaalAssets * 0.025) : 0;

  // 3. Calculations - Emas & Perak
  const goldValue = (Number(goldGrams) || 0) * GOLD_PRICE_PER_GRAM;
  const silverValue = (Number(silverGrams) || 0) * SILVER_PRICE_PER_GRAM;
  const isGoldObligatory = (Number(goldGrams) || 0) >= NISAB_GOLD_GRAMS;
  const isSilverObligatory = (Number(silverGrams) || 0) >= NISAB_SILVER_GRAMS;
  
  const goldZakatAmount = isGoldObligatory ? Math.round(goldValue * 0.025) : 0;
  const silverZakatAmount = isSilverObligatory ? Math.round(silverValue * 0.025) : 0;
  const totalEmasPerakZakat = goldZakatAmount + silverZakatAmount;

  const handlePayZakat = (amount, categoryName) => {
    if (amount <= 0) return;
    onApplyZakat(amount, 'santunan-yatim'); // Or Zakat category
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 relative my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-950 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
              <Calculator size={22} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold tracking-tight">Kalkulator Zakat Syar'i</h3>
              <p className="text-xs text-blue-200">Hitung kewajiban Zakat Profesi, Maal, & Emas sesuai NISAB Syariat</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
          <button
            onClick={() => setActiveTab('profesi')}
            className={`pb-3 px-4 font-bold text-xs flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profesi' ? 'border-blue-700 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase size={16} />
            <span>Zakat Profesi</span>
          </button>

          <button
            onClick={() => setActiveTab('maal')}
            className={`pb-3 px-4 font-bold text-xs flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'maal' ? 'border-blue-700 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet size={16} />
            <span>Zakat Maal (Tabungan)</span>
          </button>

          <button
            onClick={() => setActiveTab('emas')}
            className={`pb-3 px-4 font-bold text-xs flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'emas' ? 'border-blue-700 text-blue-900 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins size={16} />
            <span>Zakat Emas & Perak</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* TAB 1: ZAKAT PROFESI */}
          {activeTab === 'profesi' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-100 text-xs text-blue-900 flex items-start space-x-2.5">
                <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Ketentuan Nisab Zakat Profesi / Penghasilan:</p>
                  <p className="mt-0.5 text-blue-800">
                    Nisab setara 85 gr emas/tahun atau <strong>{formatRupiah(NISAB_PROFESI_MONTHLY)} / bulan</strong>. Kadar zakat adalah <strong>2,5%</strong> dari total pendapatan bersih.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Penghasilan Utama (Per Bulan)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="Contoh: 10000000"
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Bonus / Penghasilan Lainnya (Per Bulan)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(e.target.value)}
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isProfesiObligatory ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Wajib Zakat</span>
                  {isProfesiObligatory ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1 text-emerald-600" /> Wajib Zakat Profesi
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
                      Belum Mencapai Nisab
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-500">Nominal Zakat Wajib (2,5%):</span>
                    <h4 className="text-2xl font-extrabold text-blue-950 mt-0.5">{formatRupiah(profesiZakatAmount)}</h4>
                  </div>
                  {isProfesiObligatory && (
                    <button
                      onClick={() => handlePayZakat(profesiZakatAmount, 'Zakat Profesi')}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Tunaikan Zakat Ini</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ZAKAT MAAL */}
          {activeTab === 'maal' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start space-x-2.5">
                <ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Ketentuan Nisab Zakat Maal (Tabungan / Deposito):</p>
                  <p className="mt-0.5 text-amber-800">
                    Harta simpanan yang bertahan 1 tahun (haul) dengan nisab setara 85 gr emas (<strong>{formatRupiah(NISAB_MAAL_YEARLY)}</strong>). Kadar zakat: <strong>2,5%</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Tabungan / Rekening / Deposito</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={savingsAmount}
                      onChange={(e) => setSavingsAmount(e.target.value)}
                      placeholder="Contoh: 90000000"
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Investasi / Saham / Surat Berharga</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Hutang Jatuh Tempo (Pengurang Harta)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      value={shortDebts}
                      onChange={(e) => setShortDebts(e.target.value)}
                      placeholder="0"
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                isMaalObligatory ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Wajib Zakat Maal</span>
                  {isMaalObligatory ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1 text-emerald-600" /> Wajib Zakat Maal
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
                      Belum Mencapai Nisab ({formatRupiah(NISAB_MAAL_YEARLY)})
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-500">Nominal Zakat Maal Wajib (2,5%):</span>
                    <h4 className="text-2xl font-extrabold text-blue-950 mt-0.5">{formatRupiah(maalZakatAmount)}</h4>
                  </div>
                  {isMaalObligatory && (
                    <button
                      onClick={() => handlePayZakat(maalZakatAmount, 'Zakat Maal')}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Tunaikan Zakat Ini</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ZAKAT EMAS & PERAK */}
          {activeTab === 'emas' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200 text-xs text-purple-900 flex items-start space-x-2.5">
                <ShieldCheck size={18} className="text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Ketentuan Nisab Emas & Perak:</p>
                  <p className="mt-0.5 text-purple-800">
                    Nisab Emas: <strong>85 Gram</strong>. Nisab Perak: <strong>595 Gram</strong>. Kadar Zakat: <strong>2,5%</strong> dari total nilai logam mulia simpanan.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kepemilikan Emas (Gram)</label>
                  <input
                    type="number"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(e.target.value)}
                    placeholder="Contoh: 100"
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Nisab: 85 gram ({formatRupiah(NISAB_MAAL_YEARLY)})</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kepemilikan Perak (Gram)</label>
                  <input
                    type="number"
                    value={silverGrams}
                    onChange={(e) => setSilverGrams(e.target.value)}
                    placeholder="Contoh: 600"
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 bg-white"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Nisab: 595 gram ({formatRupiah(NISAB_SILVER_GRAMS * SILVER_PRICE_PER_GRAM)})</span>
                </div>
              </div>

              {/* Result Box */}
              <div className={`p-5 rounded-2xl border transition-all ${
                totalEmasPerakZakat > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Zakat Logam Mulia</span>
                  {totalEmasPerakZakat > 0 ? (
                    <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={14} className="mr-1 text-emerald-600" /> Wajib Zakat Emas/Perak
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-200 px-2.5 py-1 rounded-full">
                      Belum Mencapai Nisab
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-xs text-slate-500">Nominal Zakat Logam Mulia (2,5%):</span>
                    <h4 className="text-2xl font-extrabold text-blue-950 mt-0.5">{formatRupiah(totalEmasPerakZakat)}</h4>
                  </div>
                  {totalEmasPerakZakat > 0 && (
                    <button
                      onClick={() => handlePayZakat(totalEmasPerakZakat, 'Zakat Emas & Perak')}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                    >
                      <span>Tunaikan Zakat Ini</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Kalkulator berlandaskan standar syariat PSAK 109 & Baznas
          </span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
