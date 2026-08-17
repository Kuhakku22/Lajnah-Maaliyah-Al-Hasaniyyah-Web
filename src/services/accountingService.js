// Service Akuntansi & Logika Kalkulasi PSAK 109

export function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

/**
 * Menghitung ringkasan keuangan PSAK 109 (Dana Terikat, Tidak Terikat, & Amil)
 */
export function calculatePsak109Summary(transactions = [], campaigns = []) {
  let totalIn = 0;
  let totalOut = 0;

  let terikatIn = 0;
  let terikatOut = 0;

  let mutlaqIn = 0;
  let mutlaqOut = 0;

  let amilIn = 0;
  let amilOut = 0;

  const verifiedTrx = transactions.filter(t => t.status === 'verified');

  verifiedTrx.forEach(t => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'IN') {
      totalIn += amt;
      if (t.category_id === 'cat-1') terikatIn += amt;
      else if (t.category_id === 'cat-2') mutlaqIn += amt;
      else if (t.category_id === 'cat-3') amilIn += amt;
    } else if (t.type === 'OUT') {
      totalOut += amt;
      if (t.category_id === 'cat-1') terikatOut += amt;
      else if (t.category_id === 'cat-2') mutlaqOut += amt;
      else if (t.category_id === 'cat-3') amilOut += amt;
    }
  });

  const totalBalance = totalIn - totalOut;
  const terikatBalance = terikatIn - terikatOut;
  const mutlaqBalance = mutlaqIn - mutlaqOut;
  const amilBalance = amilIn - amilOut;

  // Active campaigns count
  const activeCampaigns = campaigns.filter(c => c.status === 'active' && c.is_published).length;

  return {
    totalIn,
    totalOut,
    totalBalance,
    terikatIn,
    terikatOut,
    terikatBalance,
    mutlaqIn,
    mutlaqOut,
    mutlaqBalance,
    amilIn,
    amilOut,
    amilBalance,
    activeCampaigns
  };
}

/**
 * Validasi apakah saldo program / kategori cukup untuk pengeluaran (Muqayyad check)
 */
export function validateProgramBalance(programId, amount, transactions = [], campaigns = []) {
  const campaign = campaigns.find(c => c.id === programId);
  if (!campaign) return { valid: false, message: 'Program tidak ditemukan' };

  // Calculate current verified balance for this program
  const progIn = transactions
    .filter(t => t.program_id === programId && t.type === 'IN' && t.status === 'verified')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const progOut = transactions
    .filter(t => t.program_id === programId && t.type === 'OUT' && t.status === 'verified')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const availableBalance = progIn - progOut;

  if (amount > availableBalance) {
    return {
      valid: false,
      availableBalance,
      message: `Saldo program "${campaign.title}" tidak mencukupi. Saldo tersedia: ${formatRupiah(availableBalance)}, Pengajuan: ${formatRupiah(amount)}`
    };
  }

  return {
    valid: true,
    availableBalance,
    message: 'Saldo mencukupi'
  };
}

/**
 * Generate E-Receipt Code unik
 */
export function generateTrxCode(type = 'IN') {
  const dateStr = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${type}-${dateStr}-${randomNum}`;
}
