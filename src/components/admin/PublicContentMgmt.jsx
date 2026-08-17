import React, { useState } from 'react';
import { Building, Award, Plus, Activity, RefreshCw, Trash2, Image as ImageIcon } from 'lucide-react';
import { formatRupiah } from '../../services/accountingService';

export default function PublicContentMgmt({ 
  showToast, 
  campaigns = [], 
  onAddCampaign,
  activities = [], 
  onAddActivity, 
  onDeleteActivity, 
  isSyncing, 
  onRefreshActivities, 
  isLoadingActivities 
}) {
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' or 'activities'

  // Campaign Form State
  const [showAddCampaignForm, setShowAddCampaignForm] = useState(false);
  const [cmpTitle, setCmpTitle] = useState('');
  const [cmpCategoryId, setCmpCategoryId] = useState('cat-1');
  const [cmpTarget, setCmpTarget] = useState('');
  const [cmpDesc, setCmpDesc] = useState('');
  const [cmpImg, setCmpImg] = useState('');

  // Activity Form State
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actImgUrl, setActImgUrl] = useState('');

  const handleCampaignSubmit = (e) => {
    e.preventDefault();
    const categoryNames = {
      'cat-1': 'Terikat (Muqayyad)',
      'cat-2': 'Tidak Terikat (Mutlaq)',
      'cat-3': 'Amil / Operasional'
    };

    const newCmp = {
      id: `cmp-${Date.now()}`,
      title: cmpTitle,
      slug: cmpTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category_id: cmpCategoryId,
      category_name: categoryNames[cmpCategoryId] || 'Terikat',
      target_amount: Number(cmpTarget),
      current_amount: 0,
      start_date: new Date().toISOString().slice(0,10),
      end_date: '2026-12-31',
      status: 'active',
      is_published: true,
      description: cmpDesc,
      img: cmpImg || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
    };

    onAddCampaign(newCmp);
    showToast(`Program "${cmpTitle}" dipublikasikan ke Website Publik!`, "success");
    setCmpTitle('');
    setCmpTarget('');
    setCmpDesc('');
    setCmpImg('');
    setShowAddCampaignForm(false);
  };

  const handleActivitySubmit = (e) => {
    e.preventDefault();
    const newAct = {
      title: actTitle,
      date: actDate,
      desc: actDesc,
      img: actImgUrl || 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80'
    };
    onAddActivity(newAct);
    showToast("Kegiatan baru berhasil dipublikasikan ke Galeri Publik!", "success");
    setActTitle('');
    setActDate('');
    setActDesc('');
    setActImgUrl('');
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase">
            Konten Manager Publik
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Pengaturan Konten Website Publik</h2>
          <p className="text-slate-500 text-sm">
            Kelola kampanye program infaq dan galeri kegiatan yang tampil langsung pada Website Publik.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'campaigns' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          1. Kelola Program Campaign
        </button>
        <button
          onClick={() => setActiveTab('activities')}
          className={`pb-4 px-6 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
            activeTab === 'activities' ? 'border-blue-700 text-blue-700 font-extrabold' : 'border-transparent text-slate-500'
          }`}
        >
          2. Kelola Galeri Kegiatan Publik
        </button>
      </div>

      {/* 1. CAMPAIGN MANAGER */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Daftar Campaign Aktif</h3>
            <button
              onClick={() => setShowAddCampaignForm(!showAddCampaignForm)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              <span>{showAddCampaignForm ? 'Tutup Form' : 'Buat Campaign Baru'}</span>
            </button>
          </div>

          {showAddCampaignForm && (
            <form onSubmit={handleCampaignSubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4 animate-in slide-in-from-top-2">
              <h4 className="font-bold text-slate-900 border-b pb-2">Form Buat Campaign Program Syar'i</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Judul Campaign</label>
                  <input
                    type="text"
                    required
                    value={cmpTitle}
                    onChange={(e) => setCmpTitle(e.target.value)}
                    placeholder="Contoh: Perluasan Masjid Lajnah"
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kategori Akun Syar'i</label>
                  <select
                    value={cmpCategoryId}
                    onChange={(e) => setCmpCategoryId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600 bg-white"
                  >
                    <option value="cat-1">Terikat (Muqayyad)</option>
                    <option value="cat-2">Tidak Terikat (Mutlaq)</option>
                    <option value="cat-3">Amil / Operasional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target Nominal (Rp)</label>
                  <input
                    type="number"
                    required
                    value={cmpTarget}
                    onChange={(e) => setCmpTarget(e.target.value)}
                    placeholder="0"
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL Foto Cover</label>
                  <input
                    type="text"
                    value={cmpImg}
                    onChange={(e) => setCmpImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Deskripsi Campaign</label>
                <textarea
                  rows="2"
                  value={cmpDesc}
                  onChange={(e) => setCmpDesc(e.target.value)}
                  placeholder="Detail peruntukan..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                />
              </div>

              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow">
                Publikasikan Campaign Baru
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((cmp) => (
              <div key={cmp.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start space-x-4">
                  <img src={cmp.img} alt={cmp.title} className="w-20 h-20 object-cover rounded-2xl border border-slate-200 shrink-0" />
                  <div>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase">{cmp.category_name}</span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{cmp.title}</h4>
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
      )}

      {/* 2. ACTIVITY MANAGER */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <form onSubmit={handleActivitySubmit} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 border-b pb-2">Upload Kegiatan Penyaluran Baru</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  placeholder="Contoh: Distribusi Sembako Tahap 2"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tanggal Kegiatan</label>
                <input
                  type="text"
                  required
                  value={actDate}
                  onChange={(e) => setActDate(e.target.value)}
                  placeholder="Contoh: 17 Agustus 2026"
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Deskripsi Kegiatan</label>
              <textarea
                rows="2"
                required
                value={actDesc}
                onChange={(e) => setActDesc(e.target.value)}
                placeholder="Tuliskan rincian kegiatan..."
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">URL Foto Kegiatan</label>
              <input
                type="text"
                value={actImgUrl}
                onChange={(e) => setActImgUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full border border-slate-300 rounded-xl p-3 text-sm outline-none focus:border-blue-600"
              />
            </div>

            <button type="submit" disabled={isSyncing} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow disabled:opacity-50">
              {isSyncing ? "Menyimpan..." : "Publikasikan ke Galeri Publik"}
            </button>
          </form>

          {/* Activity List */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="font-bold text-sm text-slate-800">Daftar Galeri Kegiatan ({activities.length})</span>
              <button onClick={onRefreshActivities} disabled={isLoadingActivities} className="text-xs text-blue-700 font-bold flex items-center space-x-1">
                <RefreshCw size={12} className={isLoadingActivities ? "animate-spin" : ""} />
                <span>Sync Cloud</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                      <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                  </div>
                  <button onClick={() => onDeleteActivity(idx)} className="text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold">
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
