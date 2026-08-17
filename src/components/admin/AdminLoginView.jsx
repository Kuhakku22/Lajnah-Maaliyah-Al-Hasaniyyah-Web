import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function AdminLoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Single unified admin login credentials
    if ((username === 'admin' || username === 'lajnah') && (password === 'admin123' || password === 'lajnah123')) {
      onLoginSuccess({
        id: 'usr-admin',
        name: 'Pengurus Lajnah Maaliyah',
        role: 'admin',
        roleLabel: 'Admin Lajnah Maaliyah'
      });
    } else {
      setError('Username atau Kata Sandi Admin salah! Silakan periksa kembali.');
    }
  };

  const handleOneClickLogin = () => {
    onLoginSuccess({
      id: 'usr-admin',
      name: 'Pengurus Lajnah Maaliyah',
      role: 'admin',
      roleLabel: 'Admin Lajnah Maaliyah'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden animate-in fade-in">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-950 to-purple-950 opacity-90"></div>
      <div className="absolute top-10 left-10 text-white/5 font-extrabold text-9xl pointer-events-none">PSAK 109</div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-900/80 text-amber-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-700 shadow-xl backdrop-blur-md">
            <ShieldCheck size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Portal Admin Lajnah Maaliyah</h2>
          <p className="mt-2 text-sm text-slate-400">
            Masuk ke Sistem Pengelolaan Internal
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username admin..."
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
              Masuk ke Portal Admin
            </button>
          </form>

          {/* Quick Demo Login Button */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleOneClickLogin}
              className="w-full bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs py-2.5 px-4 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Masuk Langsung (1-Klik Demo Admin)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
