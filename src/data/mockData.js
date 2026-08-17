// Data awal berstandar PSAK 109 & ERD untuk Lajnah Maaliyah Al-Hasaniyyah

export const INITIAL_USERS = [
  { id: 'usr-1', name: 'Habib Husain Al-Hasani', email: 'pimpinan@alhasaniyyah.org', phone: '081234567890', role: 'pimpinan', region: 'all', regionLabel: 'Pimpinan / Ketua Lajnah' },
  { id: 'usr-2', name: 'Ustadz Ahmad Farisi', email: 'bendahara@alhasaniyyah.org', phone: '081234567891', role: 'bendahara', region: 'all', regionLabel: 'Bendahara / Keuangan' },
  { id: 'usr-3', name: 'Administrator Pusat', email: 'admin@alhasaniyyah.org', phone: '081234567892', role: 'admin', region: 'all', regionLabel: 'Superadmin System' },
  { id: 'usr-4', name: 'H. Muhammad Ridwan', email: 'm.ridwan@gmail.com', phone: '081987654321', role: 'munfiq', region: 'Jatim', regionLabel: 'Donatur (Munfiq)' },
  { id: 'usr-5', name: 'Hj. Fatimah Az-Zahra', email: 'fatimah@gmail.com', phone: '081555666777', role: 'munfiq', region: 'Jabar', regionLabel: 'Donatur (Munfiq)' },
];

export const INITIAL_FUNDS_CATEGORIES = [
  { id: 'cat-1', code: '1100', name: 'Dana Infaq Terikat (Muqayyad)', description: 'Dana yang diamanahkan khusus untuk program tertentu (Pembangunan, Santunan Yatim)', is_restricted: true },
  { id: 'cat-2', code: '1200', name: 'Dana Infaq Tidak Terikat (Mutlaq)', description: 'Dana infaq umum fleksibel untuk maslahat ummat sesuai kebijaksanaan Lajnah', is_restricted: false },
  { id: 'cat-3', code: '1300', name: 'Dana Amil & Operasional', description: 'Dana alokasi operasional server, administrasi, dan hak amil pengelola', is_restricted: false },
];

export const INITIAL_CAMPAIGNS = [
  {
    id: 'cmp-1',
    title: 'Infaq Pembangunan Asrama Santri Putra',
    slug: 'pembangunan-asrama',
    category_id: 'cat-1',
    category_name: 'Terikat (Muqayyad)',
    target_amount: 250000000,
    current_amount: 165000000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    is_published: true,
    description: 'Pembangunan gedung asrama 3 lantai berkapasitas 500 santri baru.',
    img: '/assets/pembangunan.jpeg'
  },
  {
    id: 'cmp-2',
    title: 'Santunan Rutin Yatim & Dhuafa',
    slug: 'santunan-yatim',
    category_id: 'cat-1',
    category_name: 'Terikat (Muqayyad)',
    target_amount: 50000000,
    current_amount: 38500000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    is_published: true,
    description: 'Bantuan beasiswa pendidikan dan sembako bulanan untuk 100 anak yatim binaan.',
    img: 'https://images.unsplash.com/photo-1593113589914-07553f1bd82f?auto=format&fit=crop&q=80'
  },
  {
    id: 'cmp-3',
    title: 'Infaq Umum Maslahat Ummat (Mutlaq)',
    slug: 'infaq-umum',
    category_id: 'cat-2',
    category_name: 'Tidak Terikat (Mutlaq)',
    target_amount: 100000000,
    current_amount: 92000000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    is_published: true,
    description: 'Dana infaq umum untuk kegiatan dakwah, kajian, serta kondisi darurat sosial.',
    img: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'
  },
  {
    id: 'cmp-4',
    title: 'Dana Operasional & Khidmat Amil Lajnah',
    slug: 'operasional-amil',
    category_id: 'cat-3',
    category_name: 'Amil / Operasional',
    target_amount: 30000000,
    current_amount: 18000000,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    status: 'active',
    is_published: true,
    description: 'Alokasi pemeliharaan infrastruktur IT, server, serta akomodasi tim pengelola.',
    img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: 'trx-101',
    trx_code: 'IN-2026-0801',
    type: 'IN',
    amount: 15000000,
    date: '2026-08-01',
    program_id: 'cmp-1',
    program_title: 'Infaq Pembangunan Asrama Santri Putra',
    category_id: 'cat-1',
    munfiq_id: 'usr-4',
    munfiq_name: 'H. Muhammad Ridwan',
    is_anonymous: false,
    payment_method: 'Transfer Bank (BSI)',
    status: 'verified',
    proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    notes: 'Infaq semen dan bata asrama lantai 2'
  },
  {
    id: 'trx-102',
    trx_code: 'IN-2026-0805',
    type: 'IN',
    amount: 5000000,
    date: '2026-08-05',
    program_id: 'cmp-2',
    program_title: 'Santunan Rutin Yatim & Dhuafa',
    category_id: 'cat-1',
    munfiq_id: 'usr-5',
    munfiq_name: 'Hj. Fatimah Az-Zahra',
    is_anonymous: true,
    payment_method: 'QRIS',
    status: 'verified',
    proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    notes: 'Infaq hamba Allah untuk santunan bulan Agustus'
  },
  {
    id: 'trx-103',
    trx_code: 'IN-2026-0810',
    type: 'IN',
    amount: 10000000,
    date: '2026-08-10',
    program_id: 'cmp-3',
    program_title: 'Infaq Umum Maslahat Ummat (Mutlaq)',
    category_id: 'cat-2',
    munfiq_id: null,
    munfiq_name: 'Hamba Allah',
    is_anonymous: true,
    payment_method: 'Virtual Account BCA',
    status: 'verified',
    proof_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    notes: 'Infaq mutlaq tidak terikat'
  },
  {
    id: 'trx-104',
    trx_code: 'OUT-2026-0812',
    type: 'OUT',
    amount: 25000000,
    date: '2026-08-12',
    program_id: 'cmp-1',
    program_title: 'Infaq Pembangunan Asrama Santri Putra',
    category_id: 'cat-1',
    munfiq_id: null,
    munfiq_name: '-',
    is_anonymous: false,
    payment_method: 'Kas Bank BSI',
    status: 'verified',
    proof_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
    notes: 'Pembelian Besi Beton & Semen Toko Bangunan Berkah'
  },
  {
    id: 'trx-105',
    trx_code: 'OUT-2026-0815',
    type: 'OUT',
    amount: 12000000,
    date: '2026-08-15',
    program_id: 'cmp-2',
    program_title: 'Santunan Rutin Yatim & Dhuafa',
    category_id: 'cat-1',
    munfiq_id: null,
    munfiq_name: '-',
    is_anonymous: false,
    payment_method: 'Kas Bank BSI',
    status: 'pending',
    proof_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
    notes: 'Draf penyaluran paket sembako 120 paket yatim binaan'
  }
];

export const INITIAL_DISBURSEMENTS = [
  {
    id: 'dsb-104',
    transaction_id: 'trx-104',
    requested_by: 'Ustadz Ahmad Farisi (Bendahara)',
    approved_by: 'Habib Husain Al-Hasani (Pimpinan)',
    approval_status: 'approved',
    approval_notes: 'Disetujui. Nota toko & kwitansi material lengkap.',
    receipt_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80',
    documentation_image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
    created_at: '2026-08-12 10:30'
  },
  {
    id: 'dsb-105',
    transaction_id: 'trx-105',
    requested_by: 'Ustadz Ahmad Farisi (Bendahara)',
    approved_by: null,
    approval_status: 'pending',
    approval_notes: 'Menunggu peninjauan & otorisasi Pimpinan Lajnah.',
    receipt_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80',
    documentation_image: 'https://images.unsplash.com/photo-1593113589914-07553f1bd82f?auto=format&fit=crop&q=80',
    created_at: '2026-08-15 14:15'
  }
];

export const INITIAL_LEDGERS = [
  {
    id: 'ldg-1',
    transaction_id: 'trx-101',
    account_code: '101.100',
    account_name: 'Kas & Bank - BSI Infaq Terikat',
    debit: 15000000,
    credit: 0,
    balance: 165000000,
    category_id: 'cat-1',
    created_at: '2026-08-01'
  },
  {
    id: 'ldg-2',
    transaction_id: 'trx-101',
    account_code: '301.100',
    account_name: 'Saldo Dana Terikat - Pembangunan',
    debit: 0,
    credit: 15000000,
    balance: 165000000,
    category_id: 'cat-1',
    created_at: '2026-08-01'
  },
  {
    id: 'ldg-3',
    transaction_id: 'trx-104',
    account_code: '301.100',
    account_name: 'Saldo Dana Terikat - Pembangunan',
    debit: 25000000,
    credit: 0,
    balance: 140000000,
    category_id: 'cat-1',
    created_at: '2026-08-12'
  },
  {
    id: 'ldg-4',
    transaction_id: 'trx-104',
    account_code: '101.100',
    account_name: 'Kas & Bank - BSI Infaq Terikat',
    debit: 0,
    credit: 25000000,
    balance: 140000000,
    category_id: 'cat-1',
    created_at: '2026-08-12'
  }
];
