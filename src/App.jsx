import React, { useState } from 'react';
import { 
  Home, Activity, Heart, FileText, Users, Download, 
  Menu, X, ArrowRight, Wallet, CheckCircle, Building, 
  Globe, AlertTriangle, TrendingUp, PieChart as PieChartIcon,
  Upload, Clock, Lock, Unlock, User, Eye, EyeOff, LogOut, 
  Info, ShieldAlert
} from 'lucide-react';
import pembangunanImg from './assets/pembangunan.jpeg';


export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [infaqCategory, setInfaqCategory] = useState('pembangunan');

  const navigateToInfaq = (category) => {
    setInfaqCategory(category);
    setActiveTab('infaq');
  };

  const DEFAULT_ACTIVITIES = [
    { title: "Peletakan Batu Pertama Asrama Putra", date: "15 Juli 2026", desc: "Pembangunan tahap 1 asrama berkapasitas 500 santri.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" },
    { title: "Distribusi Sembako Fakir Miskin", date: "02 Juli 2026", desc: "Penyaluran dana Zakat Maal kepada 250 KK di Desa Binaan.", img: "https://images.unsplash.com/photo-1593113589914-07553f1bd82f?auto=format&fit=crop&q=80" },
  ];

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('kegiatan_list');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });

  const handleAddActivity = (newActivity) => {
    const updated = [newActivity, ...activities];
    setActivities(updated);
    localStorage.setItem('kegiatan_list', JSON.stringify(updated));
  };

  const handleDeleteActivity = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
    localStorage.setItem('kegiatan_list', JSON.stringify(updated));
  };



  // Custom Toast Message Handler
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: <Home size={18} /> },
    { id: 'kegiatan', label: 'Kegiatan', icon: <Activity size={18} /> },
    { id: 'transparansi', label: 'Transparansi', icon: <FileText size={18} /> },
    { id: 'alumni', label: 'Portal Alumni', icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg text-white flex items-center space-x-2 transition-all duration-300 ${toast.type === 'success' ? 'bg-blue-700' : 'bg-blue-600'}`}>
          <CheckCircle size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            {/* Logo & Brand */}
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('beranda')}>
              <img 
                src="/logo-dalwa.png" 
                alt="Lajnah Maaliyah Al Hasaniyyah Dalwa" 
                className="h-20 object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 text-sm font-medium transition-colors ${
                    activeTab === item.id ? 'text-blue-800 bg-blue-50' : 'text-slate-600 hover:text-blue-700 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Primary Action Button (INFAQ) */}
              <div className="pl-4">
                <button 
                  onClick={() => navigateToInfaq('pembangunan')}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 animate-pulse hover:animate-none"
                >
                  <Heart size={18} />
                  <span>INFAQ SEKARANG</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-600 hover:text-blue-700 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg absolute w-full z-50">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left font-medium ${
                    activeTab === item.id ? 'text-blue-800 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <button 
                onClick={() => {
                  navigateToInfaq('pembangunan');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 bg-amber-500 text-white px-4 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 shadow-md"
              >
                <Heart size={18} />
                <span>INFAQ SEKARANG</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pb-16">
        {activeTab === 'beranda' && <BerandaView navigateToInfaq={navigateToInfaq} setActiveTab={setActiveTab} />}
        {activeTab === 'kegiatan' && <KegiatanView activities={activities} />}
        {activeTab === 'transparansi' && <TransparansiView />}
        {activeTab === 'alumni' && (
          <PortalAlumniView 
            showToast={showToast} 
            activities={activities}
            onAddActivity={handleAddActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
        {activeTab === 'infaq' && (
          <InfaqView 
            showToast={showToast} 
            setActiveTab={setActiveTab} 
            selectedCategory={infaqCategory}
            setSelectedCategory={setInfaqCategory}
          />
        )}
      </main>



      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-white text-lg font-bold mb-4">Lajnah Maaliyah Al Hasaniyyah Dalwa</h2>
            <p className="text-sm text-slate-400 mb-4">
              Lembaga resmi pengelola infaq, zakat, dan dana sosial untuk kemaslahatan ummat and pembangunan peradaban Islam yang transparan dan amanah.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setActiveTab('beranda')} className="hover:text-blue-400">Beranda</button></li>
              <li><button onClick={() => setActiveTab('transparansi')} className="hover:text-blue-400">Transparansi Dana</button></li>
              <li><button onClick={() => setActiveTab('alumni')} className="hover:text-blue-400">Portal Alumni</button></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak Kami</h3>
            <p className="text-sm text-slate-400">Jl. Pesantren No. 1, Kota Santri, Indonesia</p>
            <p className="text-sm text-slate-400 mt-2">Email: info@alhasaniyyah.org</p>
            <p className="text-sm text-slate-400 mt-2">Telp: (021) 1234-5678</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================
   COMPONENTS PER HALAMAN
   ========================================= */

function BerandaView({ navigateToInfaq, setActiveTab }) {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="relative bg-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/bg-hero.png" 
            alt="Gedung Pondok" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col justify-center min-h-[500px]">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-900/50 text-blue-200 text-sm font-semibold mb-4 border border-blue-800 w-max">
            #BersamaMembangunUmmat
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 max-w-3xl">
            Satu Langkah Infaq Anda,<br/> 
            <span className="text-amber-400">Jutaan Kebaikan Tercipta.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl leading-relaxed">
            Mari salurkan Infaq, Zakat, dan sedekah Anda melalui Lajnah Maaliyah Al Hasaniyyah Dalwa. Kami menjamin transparansi 100% untuk setiap rupiah yang diamanahkan.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigateToInfaq('pembangunan')}
              className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center space-x-2"
            >
              <Heart size={20} />
              <span>Mulai Donasi</span>
            </button>
            <button 
              onClick={() => setActiveTab('transparansi')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold transition-all text-lg flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>Lihat Transparansi</span>
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Program Pilihan Kami</h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src={pembangunanImg} alt="Pembangunan" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Building size={14} /> <span>Pembangunan</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Infaq Pembangunan Pondok</h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">Dukungan dana untuk perluasan asrama santri dan fasilitas belajar mengajar di lingkungan Pondok.</p>
              <button onClick={() => navigateToInfaq('pembangunan')} className="w-full py-3 border border-blue-700 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Donasi Sekarang</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80" alt="Zakat" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Users size={14} /> <span>Zakat & Amil</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Zakat Maal & Distribusi Fakir</h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">Tunaikan kewajiban Zakat Maal Anda. Dana akan disalurkan kepada asnaf yang berhak, terutama fakir miskin.</p>
              <button onClick={() => navigateToInfaq('zakat')} className="w-full py-3 border border-blue-700 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Tunaikan Zakat</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80" alt="Bansos" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1">
                <Globe size={14} /> <span>Kemanusiaan</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Bansos & Santunan Yatim</h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">Donasi darurat kemanusiaan internasional, mitigasi bencana alam, dan santunan rutin untuk Anak Yatim.</p>
              <button onClick={() => navigateToInfaq('bansos')} className="w-full py-3 border border-blue-700 text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors">Bantu Mereka</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KegiatanView({ activities }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Galeri Kegiatan & Penyaluran</h2>
      </div>
      <div className="space-y-12">
        {activities.map((act, idx) => (
          <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden`}>
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={act.img} alt={act.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-blue-700 font-semibold mb-2">{act.date}</span>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{act.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransparansiView() {
  const transactions = [
    { id: 'TRX-9981', date: '16 Jul 2026', project: 'Pembangunan Asrama Lt. 2', amount: 25000000, type: 'out', receipt: 'KWT-011' },
    { id: 'TRX-9980', date: '15 Jul 2026', project: 'Operasional Tukang', amount: 5500000, type: 'out', receipt: 'KWT-010' },
  ];
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Transparansi Keuangan</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-700 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 mb-1 font-medium">Total Penerimaan</p>
            <h3 className="text-3xl font-bold">{formatRp(125000000)}</h3>
          </div>
          <Wallet size={80} className="absolute -right-4 -bottom-4 text-blue-600 opacity-50" />
        </div>
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-100 mb-1 font-medium">Total Penyaluran</p>
            <h3 className="text-3xl font-bold">{formatRp(51000000)}</h3>
          </div>
          <Activity size={80} className="absolute -right-4 -bottom-4 text-blue-500 opacity-50" />
        </div>
        <div className="bg-amber-500 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-amber-100 mb-1 font-medium">Saldo Berjalan</p>
            <h3 className="text-3xl font-bold">{formatRp(74000000)}</h3>
          </div>
          <AlertTriangle size={80} className="absolute -right-4 -bottom-4 text-amber-400 opacity-50" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Log Penyaluran Infaq</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-sm text-slate-500 border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Tanggal</th>
                <th className="px-6 py-4 font-semibold">Nama Penyaluran</th>
                <th className="px-6 py-4 font-semibold">Nominal Keluar</th>
                <th className="px-6 py-4 font-semibold text-center">Kuitansi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((trx, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{trx.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{trx.project}</td>
                  <td className="px-6 py-4 text-rose-600 font-semibold">{formatRp(trx.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {trx.receipt}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const COORDINATOR_ACCOUNTS = {
  koor_jatim: { password: 'jatim123', name: 'Ustadz Ahmad', region: 'Jatim', regionLabel: 'Jawa Timur' },
  koor_jateng: { password: 'jateng123', name: 'Ustadz Budi', region: 'Jateng', regionLabel: 'Jawa Tengah' },
  koor_jabar: { password: 'jabar123', name: 'Ustadzah Siti', region: 'Jabar', regionLabel: 'Jawa Barat' },
  koor_luar: { password: 'luar123', name: 'Ustadz Hasan', region: 'LuarJawa', regionLabel: 'Luar Pulau Jawa' },
  admin: { password: 'admin123', name: 'Administrator Pusat', region: 'all', regionLabel: 'Semua Wilayah' },
};

function AlumniLoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const account = COORDINATOR_ACCOUNTS[username];
    if (account && account.password === password) {
      onLoginSuccess(account);
    } else {
      setError('Nama Koordinator atau Password salah! Silakan coba lagi.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-br from-blue-800 to-blue-950 px-8 py-10 text-center text-white relative">
          <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-md">
            <Lock className="text-blue-200" size={20} />
          </div>
          <h2 className="text-2xl font-extrabold mb-2">Portal Khusus Koordinator</h2>
          <p className="text-blue-100 text-sm">Silakan masukkan nama koordinator dan password Anda untuk mengakses dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center space-x-2">
              <ShieldAlert size={16} className="shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nama Koordinator / Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: koor_jatim"
                className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-blue-600 focus:ring-0 outline-none text-sm font-medium text-slate-800 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Sandi (Password)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-12 py-3 focus:border-blue-600 focus:ring-0 outline-none text-sm font-medium text-slate-800 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <Unlock size={16} />
            <span>Masuk ke Portal</span>
          </button>
        </form>

        {/* Demo Info Toggle */}
        <div className="px-8 pb-8 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="w-full mt-4 text-xs font-semibold text-blue-800 hover:text-blue-900 flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100/50 transition-colors cursor-pointer"
          >
            <Info size={14} />
            <span>{showDemoInfo ? "Sembunyikan Akun Demo" : "Lihat Akun Demo (Untuk Pengujian)"}</span>
          </button>

          {showDemoInfo && (
            <div className="mt-3 bg-white border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 max-h-48 overflow-y-auto shadow-inner animate-in slide-in-from-top-2 duration-200">
              <p className="font-semibold text-slate-800 text-[12px] border-b pb-1">Silakan gunakan kredensial demo berikut:</p>
              <div className="space-y-1 bg-slate-50 p-2 rounded">
                <div><strong>Admin Pusat:</strong> <code>admin</code> / <code>admin123</code></div>
                <div><strong>Koor Jatim:</strong> <code>koor_jatim</code> / <code>jatim123</code></div>
                <div><strong>Koor Jateng:</strong> <code>koor_jateng</code> / <code>jateng123</code></div>
                <div><strong>Koor Jabar:</strong> <code>koor_jabar</code> / <code>jabar123</code></div>
                <div><strong>Koor Luar:</strong> <code>koor_luar</code> / <code>luar123</code></div>
              </div>
              <p className="text-[10px] text-slate-400 italic">Wilayah koordinator otomatis terkunci di form setelah login.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PortalAlumniView({ showToast, activities, onAddActivity, onDeleteActivity }) {
  const [auth, setAuth] = useState(() => {

    const savedAuth = sessionStorage.getItem('alumni_auth');
    const savedName = sessionStorage.getItem('alumni_coordinator_name');
    const savedRegion = sessionStorage.getItem('alumni_coordinator_region');
    const savedRegionLabel = sessionStorage.getItem('alumni_coordinator_region_label');
    
    if (savedAuth === 'true') {
      return {
        isAuthenticated: true,
        name: savedName,
        region: savedRegion,
        regionLabel: savedRegionLabel
      };
    }
    return {
      isAuthenticated: false,
      name: '',
      region: '',
      regionLabel: ''
    };
  });

  const [selectedRegion, setSelectedRegion] = useState(auth.region === 'all' ? '' : auth.region);
  const [alumniName, setAlumniName] = useState('');
  const [setoranAmount, setSetoranAmount] = useState('');
  
  // Make riwayat setoran stateful so that form inputs append new rows dynamically
  const [riwayatSetoran, setRiwayatSetoran] = useState([
    { nama: "Ahmad Abdullah", wilayah: "Jawa Timur", nominal: 1500000, waktu: "2 jam yang lalu" },
    { nama: "Budi Santoso", wilayah: "Jawa Tengah", nominal: 850000, waktu: "5 jam yang lalu" },
    { nama: "Siti Aminah", wilayah: "Jawa Barat", nominal: 1200000, waktu: "1 hari yang lalu" },
    { nama: "Hasanuddin", wilayah: "Luar Pulau Jawa", nominal: 2500000, waktu: "2 hari yang lalu" },
  ]);

  // Sync region when auth credentials load/change
  React.useEffect(() => {
    if (auth.region && auth.region !== 'all') {
      setSelectedRegion(auth.region);
    } else {
      setSelectedRegion('');
    }
  }, [auth.region]);

  const handleLoginSuccess = (account) => {
    const authState = {
      isAuthenticated: true,
      name: account.name,
      region: account.region,
      regionLabel: account.regionLabel
    };
    setAuth(authState);
    sessionStorage.setItem('alumni_auth', 'true');
    sessionStorage.setItem('alumni_coordinator_name', account.name);
    sessionStorage.setItem('alumni_coordinator_region', account.region);
    sessionStorage.setItem('alumni_coordinator_region_label', account.regionLabel);
    showToast(`Selamat datang kembali, ${account.name}!`, "success");
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      name: '',
      region: '',
      regionLabel: ''
    });
    sessionStorage.removeItem('alumni_auth');
    sessionStorage.removeItem('alumni_coordinator_name');
    sessionStorage.removeItem('alumni_coordinator_region');
    sessionStorage.removeItem('alumni_coordinator_region_label');
    showToast("Anda telah keluar dari Portal Alumni.", "success");
  };

  const handleExport = () => {
    showToast("Laporan Rekapitulasi XLSX berhasil diunduh!", "success");
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(setoranAmount);
    const formattedAmount = formatRp(numericAmount);
    
    const regionNameMap = {
      Jatim: "Jawa Timur",
      Jateng: "Jawa Tengah",
      Jabar: "Jawa Barat",
      LuarJawa: "Luar Pulau Jawa"
    };

    const newRecord = {
      nama: alumniName,
      wilayah: regionNameMap[selectedRegion] || selectedRegion || "Semua Wilayah",
      nominal: numericAmount,
      waktu: "Baru saja"
    };

    setRiwayatSetoran([newRecord, ...riwayatSetoran]);
    showToast(`Data Setoran ${alumniName} (${newRecord.wilayah}) sebesar ${formattedAmount} berhasil disimpan ke Database`, "success");
    
    // Reset Form (tapi biarkan region terisi jika terkunci)
    setAlumniName('');
    setSetoranAmount('');
  };

  // Tab & Form states for Kegiatan
  const [activeFormTab, setActiveFormTab] = useState('setoran'); // 'setoran' or 'kegiatan'
  const [kegiatanTitle, setKegiatanTitle] = useState('');
  const [kegiatanDate, setKegiatanDate] = useState('');
  const [kegiatanDesc, setKegiatanDesc] = useState('');
  const [kegiatanImg, setKegiatanImg] = useState(null);
  const [kegiatanImgUrl, setKegiatanImgUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran berkas terlalu besar (maksimal 2MB untuk upload langsung). Gunakan tautan URL untuk berkas besar.", "warning");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKegiatanImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKegiatanSubmit = (e) => {
    e.preventDefault();
    const finalImg = kegiatanImg || kegiatanImgUrl || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80";
    
    const newActivity = {
      title: kegiatanTitle,
      date: kegiatanDate,
      desc: kegiatanDesc,
      img: finalImg
    };

    onAddActivity(newActivity);
    showToast("Kegiatan baru berhasil ditambahkan ke Galeri!", "success");

    // Reset Form
    setKegiatanTitle('');
    setKegiatanDate('');
    setKegiatanDesc('');
    setKegiatanImg(null);
    setKegiatanImgUrl('');
  };


  if (!auth.isAuthenticated) {
    return <AlumniLoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      {/* Header Portal Alumni dengan Info Login & Tombol Logout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Portal Alumni</h2>
          <p className="text-slate-500 text-sm">Dashboard Manajemen Iuran & Analitik Infaq Wilayah.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Info Login Card */}
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              {auth.name.charAt(0)}
            </div>
            <div>
              <p className="text-[9px] text-blue-800 font-bold uppercase tracking-wider">Koordinator: {auth.regionLabel}</p>
              <p className="text-xs font-bold text-slate-800">{auth.name}</p>
            </div>
            <button 
              onClick={handleLogout}
              title="Keluar dari Portal" 
              className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 hover:bg-rose-50 rounded-xl cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
          <button onClick={handleExport} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-sm transition-colors text-sm cursor-pointer">
            <Download size={18} />
            <span>Ekspor Laporan (XLSX)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Charts & Tabel */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card: Pemetaan Wilayah */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 mb-6">
                <PieChartIcon className="text-blue-700" />
                <h3 className="text-md font-bold text-slate-800">Distribusi Wilayah</h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 py-2">
                <div 
                  className="w-40 h-40 rounded-full shadow-inner border-4 border-white"
                  style={{ background: 'conic-gradient(#1d4ed8 0% 45%, #3b82f6 45% 75%, #f59e0b 75% 90%, #ef4444 90% 100%)' }}
                ></div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span className="text-xs text-slate-700">Jatim (45%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-slate-700">Jateng (30%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs text-slate-700">Jabar (15%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-xs text-slate-700">Luar Jawa (10%)</span></div>
                </div>
              </div>
            </div>

            {/* Card: Tren Bar Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 mb-8">
                <TrendingUp className="text-blue-600" />
                <h3 className="text-md font-bold text-slate-800">Tren Nominal 6 Bulan</h3>
              </div>
              <div className="h-44 flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-200 relative">
                {[60, 45, 80, 55, 90, 75].map((val, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center group relative">
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-[10px] py-1 px-2 rounded transition-opacity whitespace-nowrap">
                      Rp {val} Juta
                    </div>
                    <div 
                      className="w-full max-w-[30px] bg-blue-600/20 group-hover:bg-blue-600 transition-colors rounded-t-sm border-t-2 border-blue-600" 
                      style={{ height: `${val}%` }}
                    ></div>
                    <span className="absolute -bottom-5 text-[10px] font-medium text-slate-500">
                      {['Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'][idx]}
                    </span>
                  </div>
                ))}
              </div>
           </div>

           {/* Kelola Galeri Kegiatan */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <Activity className="text-slate-500" size={18} />
                   <h3 className="text-md font-bold text-slate-800">Kelola Galeri Kegiatan</h3>
                 </div>
                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">{activities.length} Kegiatan</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {activities.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img src={item.img} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                      <div className="max-w-[250px] md:max-w-[400px]">
                        <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteActivity(idx)} 
                      className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
           </div>

         </div>

          {/* Tabel Riwayat Setoran Alumni Baru */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center space-x-2">
                <Clock className="text-slate-500" size={18} />
                <h3 className="text-md font-bold text-slate-800">Riwayat Setoran Kolektif Terakhir</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white text-xs text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-3 font-semibold">Nama Alumni</th>
                      <th className="px-6 py-3 font-semibold">Wilayah Koor.</th>
                      <th className="px-6 py-3 font-semibold">Nominal</th>
                      <th className="px-6 py-3 font-semibold">Waktu Masuk</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {riwayatSetoran.map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-700">{item.nama}</td>
                        <td className="px-6 py-4 text-slate-500"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{item.wilayah}</span></td>
                        <td className="px-6 py-4 font-semibold text-blue-700">{formatRp(item.nominal)}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{item.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>

        </div>

        {/* Kolom Kanan: Form Input Terikat */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
             {/* Tab Form Headers */}
             <div className="flex border-b border-slate-200 mb-6">
               <button
                 type="button"
                 onClick={() => setActiveFormTab('setoran')}
                 className={`w-1/2 pb-3 font-bold text-sm transition-colors border-b-2 text-center cursor-pointer ${
                   activeFormTab === 'setoran' 
                     ? 'border-blue-700 text-blue-700' 
                     : 'border-transparent text-slate-400 hover:text-slate-600'
                 }`}
               >
                 Input Setoran
               </button>
               <button
                 type="button"
                 onClick={() => setActiveFormTab('kegiatan')}
                 className={`w-1/2 pb-3 font-bold text-sm transition-colors border-b-2 text-center cursor-pointer ${
                   activeFormTab === 'kegiatan' 
                     ? 'border-blue-700 text-blue-700' 
                     : 'border-transparent text-slate-400 hover:text-slate-600'
                 }`}
               >
                 Upload Kegiatan
               </button>
             </div>

             {activeFormTab === 'setoran' ? (
               <form onSubmit={handleFormSubmit} className="space-y-5">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Koordinator Wilayah</label>
                   <select 
                     required 
                     value={selectedRegion}
                     onChange={(e) => setSelectedRegion(e.target.value)}
                     disabled={auth.region !== 'all'}
                     className={`w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm ${auth.region !== 'all' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white'}`}
                   >
                     <option value="">Pilih Wilayah...</option>
                     <option value="Jatim">Jawa Timur</option>
                     <option value="Jateng">Jawa Tengah</option>
                     <option value="Jabar">Jawa Barat</option>
                     <option value="LuarJawa">Luar Pulau Jawa</option>
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nama Alumni (Penyetor)</label>
                   <input 
                     type="text" 
                     required 
                     value={alumniName}
                     onChange={(e) => setAlumniName(e.target.value)}
                     placeholder="Contoh: Ahmad Abdullah" 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Setoran (Rp)</label>
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <span className="text-slate-500 sm:text-sm">Rp</span>
                     </div>
                     <input 
                       type="number" 
                       required 
                       value={setoranAmount}
                       onChange={(e) => setSetoranAmount(e.target.value)}
                       placeholder="0" 
                       className="w-full border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white" 
                     />
                   </div>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Bukti Transfer</label>
                   <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                     <Upload size={24} className="mx-auto text-slate-400 mb-2 group-hover:text-blue-600 transition-colors" />
                     <span className="text-xs text-slate-500">Klik untuk unggah resi (JPG/PNG/PDF)</span>
                   </div>
                 </div>

                 <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer">
                   Simpan Data Setoran
                 </button>
               </form>
             ) : (
               <form onSubmit={handleKegiatanSubmit} className="space-y-5">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan / Penyaluran</label>
                   <input 
                     type="text" 
                     required 
                     value={kegiatanTitle}
                     onChange={(e) => setKegiatanTitle(e.target.value)}
                     placeholder="Contoh: Peletakan Batu Pertama" 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white font-medium" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                   <input 
                     type="text" 
                     required 
                     value={kegiatanDate}
                     onChange={(e) => setKegiatanDate(e.target.value)}
                     placeholder="Contoh: 17 Juli 2026" 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white font-medium" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Kegiatan</label>
                   <textarea 
                     required 
                     rows="3"
                     value={kegiatanDesc}
                     onChange={(e) => setKegiatanDesc(e.target.value)}
                     placeholder="Tuliskan detail kegiatan atau penyaluran dana..." 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white font-medium" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Opsi A: Unggah Foto Utama</label>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleImageChange}
                     className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none text-xs bg-white cursor-pointer" 
                   />
                   {kegiatanImg && (
                     <div className="mt-2 relative">
                       <img src={kegiatanImg} alt="Preview" className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                       <button 
                         type="button" 
                         onClick={() => setKegiatanImg(null)} 
                         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rose-600 text-white rounded-full px-3 py-1 font-bold text-xs shadow hover:bg-rose-700 transition-colors"
                       >
                         Hapus Preview
                       </button>
                     </div>
                   )}
                 </div>

                 <div className="text-center text-xs font-bold text-slate-400 my-2">atau</div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Opsi B: Tautan (URL) Foto / Video</label>
                   <input 
                     type="text" 
                     value={kegiatanImgUrl}
                     onChange={(e) => setKegiatanImgUrl(e.target.value)}
                     placeholder="https://images.unsplash.com/..." 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none text-sm bg-white font-medium" 
                   />
                   <p className="text-[10px] text-slate-400 mt-1 italic">Gunakan opsi B ini jika file gambar/video sangat besar atau di-hosting online.</p>
                 </div>

                 <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer">
                   Tambahkan Kegiatan
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfaqView({ showToast, setActiveTab, selectedCategory, setSelectedCategory }) {
  const [amount, setAmount] = useState(100000);
  const [method, setMethod] = useState('qris');

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const handlePayment = (e) => {
    e.preventDefault();
    const categoryNames = {
      pembangunan: 'Infaq Pembangunan Pondok',
      zakat: 'Zakat Maal & Distribusi Fakir',
      bansos: 'Bansos & Santunan Yatim'
    };
    showToast(`Mengalihkan pembayaran ${categoryNames[selectedCategory] || 'Infaq'} sebesar Rp ${amount.toLocaleString('id-ID')} ke Midtrans...`, "success");
    setTimeout(() => {
      setActiveTab('beranda');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-blue-700 px-8 py-10 text-center text-white">
          <Heart size={48} className="mx-auto mb-4 text-blue-200" />
          <h2 className="text-3xl font-extrabold mb-2">Formulir Infaq & Donasi</h2>
          <p className="text-blue-100">Semoga pahala mengalir deras bagi Anda dan keluarga.</p>
        </div>
        
        <form onSubmit={handlePayment} className="p-8">
          {/* 1. Kategori Donasi */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-4">1. Pilih Kategori Donasi</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSelectedCategory('pembangunan')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedCategory === 'pembangunan' 
                    ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md scale-[1.02]' 
                    : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <Building size={28} className={`mb-3 ${selectedCategory === 'pembangunan' ? 'text-blue-700' : 'text-slate-500'}`} />
                <div className="font-bold text-sm text-center">Infaq Pembangunan</div>
                <span className="text-[10px] text-slate-500 mt-1 text-center">Perluasan Asrama Santri</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedCategory('zakat')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedCategory === 'zakat' 
                    ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md scale-[1.02]' 
                    : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <Wallet size={28} className={`mb-3 ${selectedCategory === 'zakat' ? 'text-blue-700' : 'text-slate-500'}`} />
                <div className="font-bold text-sm text-center">Zakat Maal</div>
                <span className="text-[10px] text-slate-500 mt-1 text-center">Penyaluran Asnaf Fakir</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedCategory('bansos')}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  selectedCategory === 'bansos' 
                    ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md scale-[1.02]' 
                    : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <Heart size={28} className={`mb-3 ${selectedCategory === 'bansos' ? 'text-blue-700' : 'text-slate-500'}`} />
                <div className="font-bold text-sm text-center">Bansos & Yatim</div>
                <span className="text-[10px] text-slate-500 mt-1 text-center">Donasi Kemanusiaan</span>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-4">2. Pilih Nominal Donasi</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {presetAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                    amount === val 
                      ? 'border-blue-600 bg-blue-50 text-blue-800' 
                      : 'border-slate-200 text-slate-600 hover:border-blue-200'
                  }`}
                >
                  Rp {val.toLocaleString('id-ID')}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-500 font-semibold">Rp</span>
              </div>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-4 focus:ring-0 focus:border-blue-600 outline-none text-lg font-bold text-slate-800 transition-colors"
                placeholder="Nominal lainnya..."
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-4">3. Metode Pembayaran</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setMethod('qris')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  method === 'qris' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-slate-800 mb-1">QRIS</div>
                <span className="text-xs text-slate-500">Gopay, OVO, Dana</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('va')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  method === 'va' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-slate-800 mb-1">Virtual Account</div>
                <span className="text-xs text-slate-500">BCA, BNI, Mandiri</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('transfer')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  method === 'transfer' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-lg font-bold text-slate-800 mb-1">Transfer Bank</div>
                <span className="text-xs text-slate-500">Manual Verifikasi</span>
              </button>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <label className="block text-sm font-bold text-slate-700 mb-2">4. Data Donatur</label>
            <input type="text" placeholder="Nama Lengkap (Opsional)" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-colors" />
            <input type="email" required placeholder="Alamat Email (Untuk kuitansi)" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-colors" />
          </div>

          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer">
            <span>Lanjutkan Pembayaran</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
