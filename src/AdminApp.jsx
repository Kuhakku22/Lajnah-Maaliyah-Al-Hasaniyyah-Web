import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

import AdminLoginView from './components/admin/AdminLoginView';
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './components/admin/AdminOverview';
import ApprovalView from './components/ApprovalView';
import GeneralLedgerView from './components/GeneralLedgerView';
import MunfiqCrmView from './components/MunfiqCrmView';
import PublicContentMgmt from './components/admin/PublicContentMgmt';
import AdminManagerView from './components/AdminManagerView';
import EReceiptModal from './components/EReceiptModal';

import { 
  INITIAL_USERS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_DISBURSEMENTS, 
  INITIAL_LEDGERS 
} from './data/mockData';

const CLOUD_API_URL = "https://jsonblob.com/api/jsonBlob/019fa8a1-d2b4-7f9a-ac25-79390c5dc9da";

export default function AdminApp() {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = sessionStorage.getItem('lm_admin_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState(null);

  // Core Data States (PSAK 109 & ERD)
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

  // Sync state to localStorage
  useEffect(() => { localStorage.setItem('lm_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('lm_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { localStorage.setItem('lm_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('lm_disbursements', JSON.stringify(disbursements)); }, [disbursements]);
  useEffect(() => { localStorage.setItem('lm_ledgers', JSON.stringify(ledgers)); }, [ledgers]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Approve Disbursement (Pimpinan Action)
  const handleApproveDisbursement = (disbursementId, trxId, notes) => {
    setDisbursements(disbursements.map(d => 
      d.id === disbursementId 
        ? { ...d, approval_status: 'approved', approved_by: adminUser?.name || 'Pimpinan Lajnah', approval_notes: notes } 
        : d
    ));

    let approvedTrx = null;
    setTransactions(transactions.map(t => {
      if (t.id === trxId) {
        approvedTrx = { ...t, status: 'verified' };
        return approvedTrx;
      }
      return t;
    }));

    if (approvedTrx) {
      const ledgerOutDebit = {
        id: `ldg-${Date.now()}-out1`,
        transaction_id: approvedTrx.id,
        account_code: '501.100',
        account_name: `Beban Penyaluran - ${approvedTrx.program_title}`,
        debit: Number(approvedTrx.amount),
        credit: 0,
        balance: Number(approvedTrx.amount),
        created_at: approvedTrx.date
      };
      const ledgerOutCredit = {
        id: `ldg-${Date.now()}-out2`,
        transaction_id: approvedTrx.id,
        account_code: '101.100',
        account_name: 'Kas & Bank Syariah (Outbound)',
        debit: 0,
        credit: Number(approvedTrx.amount),
        balance: Number(approvedTrx.amount),
        created_at: approvedTrx.date
      };
      setLedgers([ledgerOutDebit, ledgerOutCredit, ...ledgers]);
    }
  };

  // Reject Disbursement
  const handleRejectDisbursement = (disbursementId, trxId, notes) => {
    setDisbursements(disbursements.map(d => 
      d.id === disbursementId ? { ...d, approval_status: 'rejected', approval_notes: notes } : d
    ));
    setTransactions(transactions.map(t => t.id === trxId ? { ...t, status: 'rejected' } : t));
  };

  // Add Campaign
  const handleAddCampaign = (newCmp) => {
    setCampaigns([newCmp, ...campaigns]);
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

  // Admin Auth Handlers
  const handleAdminLoginSuccess = (account) => {
    setAdminUser(account);
    sessionStorage.setItem('lm_admin_auth', JSON.stringify(account));
    setActiveAdminTab('overview');
    showToast(`Selamat datang di Portal Admin Lajnah, ${account.name}!`, "success");
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    sessionStorage.removeItem('lm_admin_auth');
    showToast("Anda telah keluar dari Portal Admin.", "success");
  };

  if (!adminUser) {
    return (
      <AdminLoginView 
        onLoginSuccess={handleAdminLoginSuccess} 
        onBackToPublic={() => window.location.href = '/'} 
      />
    );
  }

  return (
    <AdminLayout
      adminUser={adminUser}
      activeAdminTab={activeAdminTab}
      setActiveAdminTab={setActiveAdminTab}
      onLogout={handleAdminLogout}
      onGoToPublic={() => window.location.href = '/'}
    >
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-16 right-8 z-50 px-6 py-3.5 rounded-2xl shadow-2xl text-white flex items-center space-x-2 bg-blue-900 border border-blue-700 animate-in slide-in-from-top-4">
          <CheckCircle size={20} className="text-amber-400 shrink-0" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* E-Receipt Modal */}
      {selectedTransactionForReceipt && (
        <EReceiptModal 
          transaction={selectedTransactionForReceipt} 
          onClose={() => setSelectedTransactionForReceipt(null)} 
        />
      )}

      {activeAdminTab === 'overview' && (
        <AdminOverview 
          adminUser={adminUser} 
          transactions={transactions} 
          disbursements={disbursements} 
          campaigns={campaigns} 
          setActiveAdminTab={setActiveAdminTab} 
        />
      )}

      {activeAdminTab === 'approval' && (
        <ApprovalView 
          showToast={showToast} 
          transactions={transactions} 
          disbursements={disbursements} 
          campaigns={campaigns} 
          onApproveDisbursement={handleApproveDisbursement} 
          onRejectDisbursement={handleRejectDisbursement} 
        />
      )}

      {activeAdminTab === 'ledger' && (
        <GeneralLedgerView 
          transactions={transactions} 
          ledgers={ledgers} 
          campaigns={campaigns} 
        />
      )}

      {activeAdminTab === 'crm' && (
        <MunfiqCrmView 
          transactions={transactions} 
          users={users} 
          onSelectTransaction={(trx) => setSelectedTransactionForReceipt(trx)} 
        />
      )}

      {activeAdminTab === 'public_mgmt' && (
        <PublicContentMgmt 
          showToast={showToast} 
          campaigns={campaigns} 
          onAddCampaign={handleAddCampaign} 
          activities={activities} 
          onAddActivity={handleAddActivity} 
          onDeleteActivity={handleDeleteActivity} 
          isSyncing={isSyncing} 
          onRefreshActivities={() => fetchCloudActivities(true)} 
          isLoadingActivities={isLoadingActivities} 
        />
      )}

      {activeAdminTab === 'admin_mgmt' && (
        <AdminManagerView 
          showToast={showToast} 
          campaigns={campaigns} 
          onAddCampaign={handleAddCampaign} 
        />
      )}
    </AdminLayout>
  );
}
