import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldAlert, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AdminLoginView({ onLoginSuccess, onBackToPublic }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemoInfo, setShowDemoInfo] = useState(true);

  const ADMIN_ACCOUNTS = {
    pimpinan: { username: 'pimpinan', password: 'pimpinan123', name: 'Habib Husain Al-Hasani', role: 'pimpinan', roleLabel: 'Pimpinan / Ketua Lajnah' },
    bendahara: { username: 'bendahara', password: 'bendahara123', name: 'Ustadz Ahmad Farisi', role: 'bendahara', roleLabel: 'Bendahara / Keuangan' },
    admin: { username: 'admin', password: 'admin123', name: 'Administrator Pusat', role: 'admin', roleLabel: 'Superadmin Pusat' },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const account = ADMIN_ACCOUNTS[username];
    if (account && account.password === password) {
      onLoginSuccess(account);
    } else {
      setError('Username atau Kata Sandi Pengurus salah! Silakan periksa kembali.');
    }
  };

  const handleQuickLogin = (accKey) => {
    const acc = ADMIN_ACCOUNTS[accKey];
    if (acc) {
      onLoginSuccess(acc);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden animate-in fade-in">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-950 to-purple-950 opacity-90"></div>
      <div className="absolute top-10 left-10 text-white/5 font-extrabold text-9xl pointer-events-none">PSAK 109</div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-semibold mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Website Publik</span>
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-blue-900/80 text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-700 shadow-xl backdrop-blur-md">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Portal Admin Lajnah Maaliyah</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sistem Internal Pengurus (Bendahara, Pimpinan, & Superadmin)
          </p>
        </div>

        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-3.5 rounded-2xl text-xs flex items-center space-x-2">
                <ShieldAlert size={18} className="shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username Pengurus</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: pimpinan, bendahara, admin"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kata Sandi (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all text-sm cursor-pointer"
            >
              Masuk ke Dashboard Internal
            </button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-3">
              Quick Login Demo Pengurus (1-Klik):
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('pimpinan')}
                className="bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs py-2 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center"
              >
                Pimpinan
              </button>
              <button
                onClick={() => handleQuickLogin('bendahara')}
                className="bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-200 text-xs py-2 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center"
              >
                Bendahara
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs py-2 px-2 rounded-xl font-bold transition-colors cursor-pointer text-center"
              >
                Superadmin
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
