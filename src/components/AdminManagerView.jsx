import React, { useState } from 'react';
import { Award, Plus, Building, ShieldCheck } from 'lucide-react';
import { formatRupiah } from '../services/accountingService';

export default function AdminManagerView({ showToast, campaigns = [], onAddCampaign }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-1');
  const [targetAmount, setTargetAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [imgUrl, setImgUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) {
      showToast("Judul dan Target Nominal wajib diisi", "warning");
      return;
    }

    const categoryNames = {
      'cat-1': 'Terikat (Muqayyad)',
      'cat-2': 'Tidak Terikat (Mutlaq)',
      'cat-3': 'Amil / Operasional'
    };

    const newCmp = {
      id: `cmp-${Date.now()}`,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: categoryId,
      category_name: categoryNames[categoryId] || 'Terikat',
      target_amount: Number(targetAmount),
      current_amount: 0,
      start_date: new Date().toISOString().slice(0,10),
      end_date: '2026-12-31',
      status: 'active',
      is_published: true,
      description: desc || 'Program kampanye penyaluran infaq baru.',
      img: imgUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
    };

    onAddCampaign(newCmp);
    showToast(`Program "${title}" berhasil ditambahkan & dipublikasikan!`, "success");

    setTitle('');
    setTargetAmount('');
    setDesc('');
    setImgUrl('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Superadmin Panel
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Manajemen Campaign & Audit Trail</h2>
          <p className="text-slate-500 text-sm">
            Kelola program kampanye infaq syar'i, target pencapaian, dan pemantauan audit trail.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-sm transition-colors text-sm cursor-pointer mt-4 md:mt-0"
        >
          <Plus size={18} />
          <span>{showAddForm ? 'Tutup Form' : 'Tambah Program Baru'}</span>
        </button>
      </div>

      {/* Form Tambah Program Baru */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl mb-10 space-y-5 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-slate-900 border-b pb-3">Form Buat Campaign Program Syar'i</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Judul Program Campaign</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Perluasan Perpustakaan Santri"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-rose-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kategori Akun Syar'i (PSAK 109)</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-rose-600 font-medium bg-white"
              >
                <option value="cat-1">Dana Infaq Terikat (Muqayyad)</option>
                <option value="cat-2">Dana Infaq Tidak Terikat (Mutlaq)</option>
                <option value="cat-3">Dana Amil / Operasional</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Nominal (Rp)</label>
              <input
                type="number"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="Contoh: 100000000"
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-rose-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL Foto Cover Program</label>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-rose-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Deskripsi & Peruntukan</label>
            <textarea
              rows="3"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Jelaskan detail peruntukan dana ini..."
              className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-rose-600 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors text-sm cursor-pointer shadow-md"
          >
            Publikasikan Program Kampanye
          </button>
        </form>
      )}

      {/* Grid Campaign Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((cmp) => (
          <div key={cmp.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-start space-x-4">
              <img 
                src={cmp.img} 
                alt={cmp.title} 
                className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80";
                }}
              />
              <div>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">
                  {cmp.category_name}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1">{cmp.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cmp.description}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-xs font-bold">
              <div>
                <span className="text-slate-400 block text-[10px]">Terkumpul</span>
                <span className="text-emerald-700 font-mono text-sm">{formatRupiah(cmp.current_amount)}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Target</span>
                <span className="text-slate-800 font-mono text-sm">{formatRupiah(cmp.target_amount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
