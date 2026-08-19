import React, { useState, useEffect } from 'react';
import { CheckCircle, RefreshCw, LogOut, Lock, User, Eye, EyeOff, ShieldAlert, Unlock, Clock, Download, PieChart as PieChartIcon, TrendingUp } from 'lucide-react';

// Public Portal Components
import PublicNavbar from './components/public/PublicNavbar';
import PublicFooter from './components/public/PublicFooter';
import BerandaView from './components/BerandaView';
import InfaqView from './components/InfaqView';
import TransparansiView from './components/TransparansiView';
import EReceiptModal from './components/EReceiptModal';
import ZakatCalculatorModal from './components/public/ZakatCalculatorModal';

// Data & Helpers
import { 
  INITIAL_USERS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_DISBURSEMENTS, 
  INITIAL_LEDGERS 
} from './data/mockData';

const CLOUD_API_URL = "https://jsonblob.com/api/jsonBlob/019fa8a1-d2b4-7f9a-ac25-79390c5dc9da";

export default function App() {
  const [publicActiveTab, setPublicActiveTab] = useState('beranda'); // 'beranda', 'kegiatan', 'transparansi', 'alumni', 'infaq'
  const [infaqCategory, setInfaqCategory] = useState('pembangunan-asrama');
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState(null);
  const [isZakatCalculatorOpen, setIsZakatCalculatorOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Core Persistent States (PSAK 109 & ERD) - Realtime Sync with Admin Portal
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lm_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('lm_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [disbursements, setDisbursements] = useState(() => {
    const saved = localStorage.getItem('lm_disbursements');
    return saved ? JSON.parse(saved) : INITIAL_DISBURSEMENTS;
  });

  const [ledgers, setLedgers] = useState(() => {
    const saved = localStorage.getItem('lm_ledgers');
    return saved ? JSON.parse(saved) : INITIAL_LEDGERS;
  });

  // Galeri Kegiatan Cloud State
  const DEFAULT_ACTIVITIES = [
    { id: 'keg-1', title: "Peletakan Batu Pertama Asrama Putra", date: "15 Juli 2026", desc: "Pembangunan tahap 1 asrama berkapasitas 500 santri.", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" },
    { id: 'keg-2', title: "Distribusi Sembako Fakir Miskin", date: "02 Juli 2026", desc: "Penyaluran dana Zakat Maal kepada 250 KK di Desa Binaan.", img: "https://images.unsplash.com/photo-1593113589914-07553f1bd82f?auto=format&fit=crop&q=80" },
  ];

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('kegiatan_list');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIVITIES;
  });
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('lm_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('lm_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('lm_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('lm_disbursements', JSON.stringify(disbursements)); }, [disbursements]);
  useEffect(() => { localStorage.setItem('lm_ledgers', JSON.stringify(ledgers)); }, [ledgers]);

  // Toast Handler
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const navigateToInfaq = (categorySlug) => {
    setInfaqCategory(categorySlug || 'pembangunan-asrama');
    setPublicActiveTab('infaq');
  };

  const handleOpenAdminPortal = () => {
    window.location.href = '/admin.html';
  };

  const handleApplyZakat = (zakatAmount, categorySlug) => {
    setInfaqCategory(categorySlug || 'santunan-yatim');
    setPublicActiveTab('infaq');
    showToast(`Nominal Zakat sebesar Rp ${zakatAmount.toLocaleString('id-ID')} telah disiapkan pada formulir.`, "success");
  };

  // Add new Inbound Transaction (Infaq)
  const handleAddTransaction = (newTrx) => {
    const updatedTrx = [newTrx, ...transactions];
    setTransactions(updatedTrx);

    // Update campaign amount
    const updatedCampaigns = campaigns.map(c => {
      if (c.id === newTrx.program_id) {
        return { ...c, current_amount: c.current_amount + Number(newTrx.amount) };
      }
      return c;
    });
    setCampaigns(updatedCampaigns);

    // Auto post ledger entries
    const newLedgerDebit = {
      id: `ldg-${Date.now()}-1`,
      transaction_id: newTrx.id,
      account_code: '101.100',
      account_name: 'Kas & Bank Syariah (Inbound)',
      debit: Number(newTrx.amount),
      credit: 0,
      balance: Number(newTrx.amount),
      created_at: newTrx.date
    };
    const newLedgerCredit = {
      id: `ldg-${Date.now()}-2`,
      transaction_id: newTrx.id,
      account_code: '301.100',
      account_name: `Penerimaan Infaq - ${newTrx.program_title}`,
      debit: 0,
      credit: Number(newTrx.amount),
      balance: Number(newTrx.amount),
      created_at: newTrx.date
    };
    setLedgers([newLedgerDebit, newLedgerCredit, ...ledgers]);

    // Open receipt modal
    setSelectedTransactionForReceipt(newTrx);
  };

  // Cloud Activities Sync
  const fetchCloudActivities = async (showNotification = false) => {
    setIsLoadingActivities(true);
    try {
      const res = await fetch(CLOUD_API_URL);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setActivities(data);
          localStorage.setItem('kegiatan_list', JSON.stringify(data));
          if (showNotification) {
            showToast("Galeri kegiatan diperbarui dari Cloud!", "success");
          }
        }
      }
    } catch (err) {
      console.warn("Gagal sync cloud:", err);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => { fetchCloudActivities(false); }, []);

  const handleAddActivity = async (newActivity) => {
    const updated = [newActivity, ...activities];
    setActivities(updated);
    localStorage.setItem('kegiatan_list', JSON.stringify(updated));
    setIsSyncing(true);
    try {
      await fetch(CLOUD_API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast("Kegiatan dipublikasikan ke Cloud!", "success");
    } catch (err) {
      showToast("Tersimpan secara lokal.", "warning");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteActivity = async (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
    localStorage.setItem('kegiatan_list', JSON.stringify(updated));
  };

  // =========================================
  // RENDER WEBSITE PUBLIK (DONATUR & MASYARAKAT)
  // =========================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Toast Notification */}
        {toast.show && (
          <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3.5 rounded-full shadow-2xl text-white flex items-center space-x-2 bg-blue-900 border border-blue-700 animate-in slide-in-from-top-4">
            <CheckCircle size={20} className="text-amber-400 shrink-0" />
            <span className="font-bold text-sm">{toast.message}</span>
          </div>
        )}

        {/* Public Navigation Bar */}
        <PublicNavbar 
          activeTab={publicActiveTab} 
          setActiveTab={setPublicActiveTab} 
          navigateToInfaq={navigateToInfaq} 
          onOpenAdminPortal={handleOpenAdminPortal} 
        />

        {/* E-Receipt Modal */}
        {selectedTransactionForReceipt && (
          <EReceiptModal 
            transaction={selectedTransactionForReceipt} 
            onClose={() => setSelectedTransactionForReceipt(null)} 
          />
        )}

        {/* Zakat Calculator Modal */}
        <ZakatCalculatorModal
          isOpen={isZakatCalculatorOpen}
          onClose={() => setIsZakatCalculatorOpen(false)}
          onApplyZakat={handleApplyZakat}
        />

        {/* Public Main Content Views */}
        <main className="pb-16">
          {publicActiveTab === 'beranda' && (
            <BerandaView 
              navigateToInfaq={navigateToInfaq} 
              setActiveTab={setPublicActiveTab} 
              transactions={transactions} 
              campaigns={campaigns} 
              onOpenZakatCalculator={() => setIsZakatCalculatorOpen(true)}
            />
          )}

          {publicActiveTab === 'kegiatan' && (
            <KegiatanView 
              activities={activities} 
              isLoadingActivities={isLoadingActivities} 
              onRefresh={() => fetchCloudActivities(true)} 
            />
          )}

          {publicActiveTab === 'transparansi' && (
            <TransparansiView 
              transactions={transactions} 
              campaigns={campaigns} 
              onSelectTransaction={(trx) => setSelectedTransactionForReceipt(trx)} 
            />
          )}

          {publicActiveTab === 'alumni' && (
            <PortalAlumniView 
              showToast={showToast} 
              activities={activities} 
              onAddActivity={handleAddActivity} 
              onDeleteActivity={handleDeleteActivity} 
              isSyncing={isSyncing} 
              onRefreshActivities={() => fetchCloudActivities(true)} 
              isLoadingActivities={isLoadingActivities} 
            />
          )}

          {publicActiveTab === 'infaq' && (
            <InfaqView 
              showToast={showToast} 
              setActiveTab={setPublicActiveTab} 
              selectedCategory={infaqCategory} 
              setSelectedCategory={setInfaqCategory} 
              campaigns={campaigns} 
              onAddTransaction={handleAddTransaction} 
              onOpenZakatCalculator={() => setIsZakatCalculatorOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Public Footer */}
      <PublicFooter 
        setActiveTab={setPublicActiveTab} 
        onOpenAdminPortal={handleOpenAdminPortal} 
      />
    </div>
  );
}

/* =========================================
   AUXILIARY PUBLIC VIEWS
   ========================================= */

function KegiatanView({ activities, isLoadingActivities, onRefresh }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Galeri Kegiatan & Penyaluran</h2>
          <p className="text-slate-500 text-sm">Dokumentasi penyaluran dana dan program kerja yang tersinkronisasi secara realtime.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoadingActivities}
            className="flex items-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoadingActivities ? "animate-spin text-blue-600" : "text-blue-600"} />
            <span>{isLoadingActivities ? "Memuat..." : "Refresh Galeri"}</span>
          </button>
        </div>
      </div>

      {isLoadingActivities && activities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <RefreshCw size={40} className="animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Memuat Galeri Kegiatan dari Server Cloud...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">Belum ada kegiatan yang ditambahkan ke galeri.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {activities.map((act, idx) => (
            <div key={idx} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow`}>
              <div className="md:w-1/2 h-64 md:h-auto relative bg-slate-100">
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
      )}
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
                className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:border-blue-600 outline-none text-sm font-medium text-slate-800 transition-colors"
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
                className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-12 py-3 focus:border-blue-600 outline-none text-sm font-medium text-slate-800 transition-colors"
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

        <div className="px-8 pb-8 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setShowDemoInfo(!showDemoInfo)}
            className="w-full mt-4 text-xs font-semibold text-blue-800 hover:text-blue-900 flex items-center justify-center space-x-1 py-2.5 rounded-xl bg-blue-50 border border-blue-100 transition-colors cursor-pointer"
          >
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PortalAlumniView({ showToast, activities, onAddActivity, onDeleteActivity, isSyncing, onRefreshActivities, isLoadingActivities }) {
  const [auth, setAuth] = useState(() => {
    const savedAuth = sessionStorage.getItem('alumni_auth');
    const savedName = sessionStorage.getItem('alumni_coordinator_name');
    const savedRegion = sessionStorage.getItem('alumni_coordinator_region');
    const savedRegionLabel = sessionStorage.getItem('alumni_coordinator_region_label');
    if (savedAuth === 'true') {
      return { isAuthenticated: true, name: savedName, region: savedRegion, regionLabel: savedRegionLabel };
    }
    return { isAuthenticated: false, name: '', region: '', regionLabel: '' };
  });

  const [selectedRegion, setSelectedRegion] = useState(auth.region === 'all' ? '' : auth.region);
  const [alumniName, setAlumniName] = useState('');
  const [setoranAmount, setSetoranAmount] = useState('');
  const [riwayatSetoran, setRiwayatSetoran] = useState([
    { nama: "Ahmad Abdullah", wilayah: "Jawa Timur", nominal: 1500000, waktu: "2 jam yang lalu" },
    { nama: "Budi Santoso", wilayah: "Jawa Tengah", nominal: 850000, waktu: "5 jam yang lalu" },
    { nama: "Siti Aminah", wilayah: "Jawa Barat", nominal: 1200000, waktu: "1 hari yang lalu" },
    { nama: "Hasanuddin", wilayah: "Luar Pulau Jawa", nominal: 2500000, waktu: "2 hari yang lalu" },
  ]);

  React.useEffect(() => {
    if (auth.region && auth.region !== 'all') {
      setSelectedRegion(auth.region);
    } else {
      setSelectedRegion('');
    }
  }, [auth.region]);

  const handleLoginSuccess = (account) => {
    const authState = { isAuthenticated: true, name: account.name, region: account.region, regionLabel: account.regionLabel };
    setAuth(authState);
    sessionStorage.setItem('alumni_auth', 'true');
    sessionStorage.setItem('alumni_coordinator_name', account.name);
    sessionStorage.setItem('alumni_coordinator_region', account.region);
    sessionStorage.setItem('alumni_coordinator_region_label', account.regionLabel);
    showToast(`Selamat datang kembali, ${account.name}!`, "success");
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, name: '', region: '', regionLabel: '' });
    sessionStorage.removeItem('alumni_auth');
    showToast("Anda telah keluar dari Portal Alumni.", "success");
  };

  const handleExport = () => {
    showToast("Laporan Rekapitulasi XLSX berhasil diunduh!", "success");
  };

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const numericAmount = Number(setoranAmount);
    const regionNameMap = { Jatim: "Jawa Timur", Jateng: "Jawa Tengah", Jabar: "Jawa Barat", LuarJawa: "Luar Pulau Jawa" };
    const newRecord = {
      nama: alumniName,
      wilayah: regionNameMap[selectedRegion] || selectedRegion || "Semua Wilayah",
      nominal: numericAmount,
      waktu: "Baru saja"
    };
    setRiwayatSetoran([newRecord, ...riwayatSetoran]);
    showToast(`Data Setoran ${alumniName} (${newRecord.wilayah}) sebesar ${formatRp(numericAmount)} berhasil disimpan`, "success");
    setAlumniName('');
    setSetoranAmount('');
  };

  const [activeFormTab, setActiveFormTab] = useState('setoran');
  const [kegiatanTitle, setKegiatanTitle] = useState('');
  const [kegiatanDate, setKegiatanDate] = useState('');
  const [kegiatanDesc, setKegiatanDesc] = useState('');
  const [kegiatanImg, setKegiatanImg] = useState(null);
  const [kegiatanImgUrl, setKegiatanImgUrl] = useState('');

  const handleKegiatanSubmit = (e) => {
    e.preventDefault();
    const finalImg = kegiatanImg || kegiatanImgUrl || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80";
    onAddActivity({ title: kegiatanTitle, date: kegiatanDate, desc: kegiatanDesc, img: finalImg });
    showToast("Kegiatan baru berhasil ditambahkan!", "success");
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-slate-200 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Portal Alumni</h2>
          <p className="text-slate-500 text-sm">Dashboard Manajemen Iuran & Analitik Infaq Wilayah.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              {auth.name.charAt(0)}
            </div>
            <div>
              <p className="text-[9px] text-blue-800 font-bold uppercase">Koordinator: {auth.regionLabel}</p>
              <p className="text-xs font-bold text-slate-800">{auth.name}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-xl cursor-pointer">
              <LogOut size={16} />
            </button>
          </div>
          <button onClick={handleExport} className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-sm text-sm cursor-pointer">
            <Download size={18} />
            <span>Ekspor Laporan (XLSX)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 mb-6">
                <PieChartIcon className="text-blue-700" />
                <h3 className="text-md font-bold text-slate-800">Distribusi Wilayah</h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-6 py-2">
                <div className="w-40 h-40 rounded-full shadow-inner border-4 border-white" style={{ background: 'conic-gradient(#1d4ed8 0% 45%, #3b82f6 45% 75%, #f59e0b 75% 90%, #ef4444 90% 100%)' }}></div>
                <div className="grid grid-cols-2 gap-3 w-full text-xs text-slate-700">
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div><span>Jatim (45%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Jateng (30%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span>Jabar (15%)</span></div>
                  <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span>Luar Jawa (10%)</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center space-x-2 mb-8">
                <TrendingUp className="text-blue-600" />
                <h3 className="text-md font-bold text-slate-800">Tren Nominal 6 Bulan</h3>
              </div>
              <div className="h-44 flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-200 relative">
                {[60, 45, 80, 55, 90, 75].map((val, idx) => (
                  <div key={idx} className="w-full flex flex-col items-center group relative">
                    <div className="w-full max-w-[30px] bg-blue-600/20 group-hover:bg-blue-600 transition-colors rounded-t-sm border-t-2 border-blue-600" style={{ height: `${val}%` }}></div>
                    <span className="absolute -bottom-5 text-[10px] font-medium text-slate-500">
                      {['Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
             <div className="flex border-b border-slate-200 mb-6">
               <button
                 type="button"
                 onClick={() => setActiveFormTab('setoran')}
                 className={`w-1/2 pb-3 font-bold text-sm border-b-2 text-center cursor-pointer ${
                   activeFormTab === 'setoran' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-400'
                 }`}
               >
                 Input Setoran
               </button>
               <button
                 type="button"
                 onClick={() => setActiveFormTab('kegiatan')}
                 className={`w-1/2 pb-3 font-bold text-sm border-b-2 text-center cursor-pointer ${
                   activeFormTab === 'kegiatan' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-400'
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
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white"
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
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nominal Setoran (Rp)</label>
                   <input 
                     type="number" 
                     required 
                     value={setoranAmount}
                     onChange={(e) => setSetoranAmount(e.target.value)}
                     placeholder="0" 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white" 
                   />
                 </div>

                 <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer">
                   Simpan Data Setoran
                 </button>
               </form>
             ) : (
               <form onSubmit={handleKegiatanSubmit} className="space-y-5">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Judul Kegiatan</label>
                   <input 
                     type="text" 
                     required 
                     value={kegiatanTitle}
                     onChange={(e) => setKegiatanTitle(e.target.value)}
                     placeholder="Contoh: Peletakan Batu Pertama" 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white font-medium" 
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
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white font-medium" 
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                   <textarea 
                     required 
                     rows="3"
                     value={kegiatanDesc}
                     onChange={(e) => setKegiatanDesc(e.target.value)}
                     placeholder="Detail kegiatan..." 
                     className="w-full border border-slate-300 rounded-lg px-4 py-2.5 outline-none text-sm bg-white font-medium" 
                   />
                 </div>

                 <button 
                   type="submit" 
                   disabled={isSyncing}
                   className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-60"
                 >
                   {isSyncing ? "Menyimpan..." : "Tambahkan Kegiatan"}
                 </button>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
