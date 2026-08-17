import React, { useState } from 'react';
import { Users, User, Mail, Phone, Heart, Search, EyeOff, CheckCircle } from 'lucide-react';
import { formatRupiah } from '../services/accountingService';

export default function MunfiqCrmView({ transactions = [], users = [], onSelectTransaction }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Extract donors from transactions & users list
  const donorsMap = {};

  transactions.forEach(t => {
    if (t.type === 'IN' && t.status === 'verified') {
      const isAnon = t.is_anonymous;
      const key = isAnon ? 'hamba-allah' : (t.munfiq_email || t.munfiq_name || 'unknown');
      
      if (!donorsMap[key]) {
        donorsMap[key] = {
          id: key,
          name: isAnon ? 'Hamba Allah (Anonim)' : (t.munfiq_name || 'Donatur'),
          email: isAnon ? '-' : (t.munfiq_email || '-'),
          phone: isAnon ? '-' : (t.munfiq_phone || '-'),
          is_anonymous: isAnon,
          total_donation: 0,
          donation_count: 0,
          last_donation_date: t.date,
          transactions: []
        };
      }

      donorsMap[key].total_donation += Number(t.amount);
      donorsMap[key].donation_count += 1;
      donorsMap[key].transactions.push(t);
    }
  });

  const donorsList = Object.values(donorsMap);

  const filteredDonors = donorsList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
              CRM Donatur (Munfiq / Muhsinin)
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Database Donatur & Muhsinin</h2>
          <p className="text-slate-500 text-sm">
            Modul CRM sederhana untuk mencatat histori donasi, kontak, dan opsi kerahasiaan Hamba Allah.
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center space-x-3 shadow-sm">
            <Users size={24} className="text-blue-700" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Munfiq</span>
              <span className="text-lg font-bold text-slate-800">{donorsList.length} Donatur</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama donatur atau email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Table Donatur */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Nama Donatur (Munfiq)</th>
                <th className="px-6 py-4">Kontak Email / Phone</th>
                <th className="px-6 py-4 text-center">Jumlah Donasi</th>
                <th className="px-6 py-4 text-right">Total Akumulasi</th>
                <th className="px-6 py-4 text-center">Donasi Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                    Belum ada data donatur yang terdaftar.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center space-x-2">
                        {donor.is_anonymous ? (
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                            <EyeOff size={16} />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                            {donor.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-slate-900">{donor.name}</p>
                          {donor.is_anonymous && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                              Dirahasiakan di Publik
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div>{donor.email}</div>
                      <div className="text-slate-400">{donor.phone}</div>
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-slate-800">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-full text-xs font-mono">
                        {donor.donation_count} x Donasi
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right font-extrabold text-emerald-700 font-mono text-base">
                      {formatRupiah(donor.total_donation)}
                    </td>

                    <td className="px-6 py-4 text-center text-xs text-slate-500 font-medium">
                      {donor.last_donation_date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
