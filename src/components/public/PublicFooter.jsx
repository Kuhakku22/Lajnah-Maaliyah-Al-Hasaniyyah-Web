import React from 'react';

export default function PublicFooter({ setActiveTab }) {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-white text-lg font-bold mb-3">Lajnah Maaliyah Al-Hasaniyyah Dalwa</h2>
          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Lembaga resmi pengelola infaq, sedekah, dan dana kemaslahatan ummat berbasis standar akuntansi syariah <strong>PSAK 109</strong>.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><button onClick={() => setActiveTab('beranda')} className="hover:text-blue-400 cursor-pointer">Beranda</button></li>
            <li><button onClick={() => setActiveTab('transparansi')} className="hover:text-blue-400 cursor-pointer">Transparansi Keuangan Publik</button></li>
            <li><button onClick={() => setActiveTab('alumni')} className="hover:text-blue-400 cursor-pointer">Portal Alumni</button></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Kontak & Sekretariat</h3>
          <p className="text-sm text-slate-400">Jl. Pesantren No. 1, Kota Santri, Indonesia</p>
          <p className="text-sm text-slate-400 mt-2">Email: info@alhasaniyyah.org</p>
          <p className="text-sm text-slate-400 mt-1">Telp: (021) 1234-5678</p>
        </div>
      </div>
    </footer>
  );
}
