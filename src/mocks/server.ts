import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type {
  Aktivitas,
  AuthResponse,
  Pegawai,
  StatistikResponse,
  User,
  UserRole
} from '../types';

interface Credential {
  identifiers: string[];
  password: string;
  user: User;
}

interface SessionContext {
  token: string;
  user: User;
}

const credentials: Credential[] = [
  {
    identifiers: ['admin@gmail.com', 'admin', 'admin_hcgs'],
    password: 'admin123',
    user: {
      id: 1,
      nama: 'Amelia Kusuma',
      role: 'admin_hcgs',
      roles: ['admin_hcgs', 'pegawai'],
      email: 'admin@gmail.com',
      pegawaiId: 1
    }
  },
  {
    identifiers: ['pegawai@gmail.com', 'nrp0002', 'pegawai'],
    password: 'pegawai123',
    user: {
      id: 2,
      nama: 'Rizky Saputra',
      role: 'pegawai',
      roles: ['pegawai'],
      email: 'pegawai@gmail.com',
      pegawaiId: 2
    }
  },
  {
    identifiers: ['finance@gmail.com', 'finance'],
    password: 'finance123',
    user: {
      id: 3,
      nama: 'Nadia Finance',
      role: 'admin_finance',
      roles: ['admin_finance'],
      email: 'finance@gmail.com'
    }
  },
  {
    identifiers: ['officer@gmail.com', 'officer'],
    password: 'officer123',
    user: {
      id: 4,
      nama: 'Bima Officer',
      role: 'officer_site',
      roles: ['officer_site', 'pegawai'],
      email: 'officer@gmail.com',
      pegawaiId: 4
    }
  }
];

const sessions = new Map<string, User>();

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const resolveSession = (config: AxiosRequestConfig): SessionContext | null => {
  const authHeader =
    (config.headers?.Authorization as string | undefined) ||
    (config.headers?.authorization as string | undefined);

  if (!authHeader) return null;

  const token = authHeader.replace('Bearer', '').trim();
  if (!token) return null;

  const user = sessions.get(token);
  if (!user) return null;

  return { token, user: clone(user) };
};

const requireAuth = (
  config: AxiosRequestConfig,
  roles?: UserRole[]
): { ok: true; session: SessionContext } | { ok: false; response: [number, { message: string }] } => {
  const session = resolveSession(config);
  if (!session) {
    return { ok: false, response: [401, { message: 'Tidak terautentikasi.' }] };
  }

  if (roles && roles.length > 0 && !roles.includes(session.user.role)) {
    return { ok: false, response: [403, { message: 'Anda tidak memiliki akses.' }] };
  }

  return { ok: true, session };
};

const createSamplePegawai = (): Pegawai[] => {
  const now = new Date();
  return Array.from({ length: 25 }).map((_, index) => {
    const kontrak = index % 2 === 0;
    const tanggalMasuk = new Date(now);
    tanggalMasuk.setFullYear(now.getFullYear() - (index % 6));
    const akhirKontrak = new Date(now);
    akhirKontrak.setDate(now.getDate() + (index + 1) * 7);

    return {
      id: index + 1,
      nrp: `NRP${String(index + 1).padStart(4, '0')}`,
      nama_lengkap: `Pegawai ${index + 1}`,
      jabatan: kontrak ? 'Staff Kontrak' : 'Staff Tetap',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: '1990-01-01',
      alamat_ktp: 'Jl. Contoh No. 123',
      tanggal_masuk: tanggalMasuk.toISOString().split('T')[0],
      status_kepegawaian: kontrak ? 'Kontrak' : 'Permanen',
      akhir_kontrak: kontrak ? akhirKontrak.toISOString().split('T')[0] : null,
      no_hp: '081234567890',
      email: `pegawai${index + 1}@contoh.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
};

const pegawaiData = createSamplePegawai();

const pegawaiAdmin = pegawaiData.find((pegawai) => pegawai.id === 1);
if (pegawaiAdmin) {
  Object.assign(pegawaiAdmin, {
    nrp: 'NRP0001',
    nama_lengkap: 'Amelia Kusuma',
    jabatan: 'Head of Corporate Services',
    tempat_lahir: 'Surabaya',
    tanggal_lahir: '1990-08-21',
    alamat_ktp: 'Jl. Merdeka No. 10, Surabaya',
    tanggal_masuk: '2015-03-15',
    status_kepegawaian: 'Permanen',
    akhir_kontrak: null,
    no_hp: '081234567891',
    email: 'admin@gmail.com'
  });
}

const pegawaiDemo = pegawaiData.find((pegawai) => pegawai.id === 2);
if (pegawaiDemo) {
  Object.assign(pegawaiDemo, {
    nrp: 'NRP0002',
    nama_lengkap: 'Rizky Saputra',
    jabatan: 'Staff Operasional',
    tempat_lahir: 'Malang',
    tanggal_lahir: '1994-05-12',
    alamat_ktp: 'Jl. Pahlawan No. 45, Malang',
    tanggal_masuk: '2019-04-01',
    status_kepegawaian: 'Kontrak',
    akhir_kontrak: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    no_hp: '081245678900',
    email: 'pegawai@gmail.com'
  });
}

const pegawaiOfficer = pegawaiData.find((pegawai) => pegawai.id === 4);
if (pegawaiOfficer) {
  Object.assign(pegawaiOfficer, {
    nrp: 'NRP0004',
    nama_lengkap: 'Bima Officer',
    jabatan: 'Site Officer',
    tempat_lahir: 'Jakarta',
    tanggal_lahir: '1992-02-02',
    alamat_ktp: 'Jl. Melati No. 7, Jakarta',
    tanggal_masuk: '2017-07-10',
    status_kepegawaian: 'Permanen',
    akhir_kontrak: null,
    no_hp: '081298765432',
    email: 'officer@gmail.com'
  });
}

const aktivitasData: Aktivitas[] = Array.from({ length: 12 }).map((_, index) => ({
  id: index + 1,
  judul: `Aktivitas ${index + 1}`,
  deskripsi: 'Perubahan data pegawai melalui portal.',
  waktu: new Date(Date.now() - index * 60 * 60 * 1000).toISOString()
}));

export const initMockServer = (http: AxiosInstance) => {
  const mock = new MockAdapter(http, { delayResponse: 300 });

  mock.onPost('/api/login').reply((config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data ?? '{}');
    const identifier = String(payload.nrp ?? '').trim().toLowerCase();
    const password = String(payload.password ?? '').trim();

    const credential = credentials.find((cred) =>
      cred.identifiers.some((value) => value.toLowerCase() === identifier)
    );

    if (!credential || credential.password !== password) {
      return [401, { message: 'Email atau kata sandi tidak sesuai.' }];
    }

    const token = `mock-token-${credential.user.role}-${credential.user.id}`;
    const sessionUser = clone(credential.user);
    sessions.set(token, sessionUser);

    const response: AuthResponse = {
      token,
      user: clone(sessionUser)
    };

    return [200, response];
  });

  mock.onPost('/api/logout').reply((config: AxiosRequestConfig) => {
    const session = resolveSession(config);
    if (session) {
      sessions.delete(session.token);
    }
    return [204];
  });

  mock.onPost('/api/auth/verify-password').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const payload = JSON.parse(config.data ?? '{}');
    const password = String(payload.password ?? '').trim();

    if (!password) {
      return [422, { message: 'Kata sandi wajib diisi.' }];
    }

    const credential = credentials.find((cred) => cred.user.id === guard.session.user.id);
    if (!credential) {
      return [404, { message: 'Akun tidak ditemukan.' }];
    }

    if (credential.password !== password) {
      return [401, { message: 'Kata sandi tidak sesuai.' }];
    }

    return [200, { valid: true }];
  });

  mock.onPost('/api/auth/switch-role').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config);
    if (!guard.ok) return guard.response;

    const payload = JSON.parse(config.data ?? '{}');
    const targetRole = String(payload.role ?? '').trim() as UserRole;
    const password = String(payload.password ?? '').trim();

    if (!targetRole) {
      return [422, { message: 'Peran tujuan wajib dipilih.' }];
    }

    if (!password) {
      return [422, { message: 'Kata sandi wajib diisi.' }];
    }

    const credential = credentials.find((cred) => cred.user.id === guard.session.user.id);
    if (!credential) {
      return [404, { message: 'Akun tidak ditemukan.' }];
    }

    if (!credential.user.roles.includes(targetRole)) {
      return [403, { message: 'Anda tidak memiliki akses ke peran tersebut.' }];
    }

    if (credential.password !== password) {
      return [401, { message: 'Kata sandi tidak sesuai.' }];
    }

    const updatedUser: User = {
      ...credential.user,
      role: targetRole,
      roles: [...credential.user.roles]
    };

    sessions.set(guard.session.token, clone(updatedUser));

    const response: AuthResponse = {
      token: guard.session.token,
      user: clone(updatedUser)
    };

    return [200, response];
  });

  mock.onGet('/api/profil').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config);
    if (!guard.ok) return guard.response;
    return [200, guard.session.user];
  });

  mock.onGet('/api/pegawai').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const params = config.params || {};
    const search = (params.search as string | undefined)?.toLowerCase() ?? '';
    const page = Number(params.page ?? 1);
    const perPage = Number(params.per_page ?? 10);

    const filtered = pegawaiData.filter((item) =>
      item.nrp.toLowerCase().includes(search) || item.nama_lengkap.toLowerCase().includes(search)
    );

    const start = (page - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return [200, {
      data: clone(paginated),
      meta: {
        total: filtered.length,
        per_page: perPage,
        current_page: page
      }
    }];
  });

  mock.onGet(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const id = Number(config.url?.split('/').pop());
    const item = pegawaiData.find((pegawai) => pegawai.id === id);
    if (!item) {
      return [404, { message: 'Pegawai tidak ditemukan.' }];
    }
    return [200, clone(item)];
  });

  mock.onPost('/api/pegawai').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const payload = JSON.parse(config.data ?? '{}');
    const id = pegawaiData.length + 1;
    const newPegawai: Pegawai = {
      ...payload,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    pegawaiData.push(newPegawai);
    return [201, clone(newPegawai)];
  });

  mock.onPut(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const id = Number(config.url?.split('/').pop());
    const payload = JSON.parse(config.data ?? '{}');
    const index = pegawaiData.findIndex((pegawai) => pegawai.id === id);
    if (index === -1) {
      return [404, { message: 'Pegawai tidak ditemukan.' }];
    }
    const updated: Pegawai = {
      ...pegawaiData[index],
      ...payload,
      updated_at: new Date().toISOString()
    };
    pegawaiData[index] = updated;
    return [200, clone(updated)];
  });

  mock.onDelete(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const id = Number(config.url?.split('/').pop());
    const index = pegawaiData.findIndex((pegawai) => pegawai.id === id);
    if (index === -1) {
      return [404, { message: 'Pegawai tidak ditemukan.' }];
    }
    pegawaiData.splice(index, 1);
    return [204];
  });

  mock.onGet('/api/pegawai/me').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['pegawai']);
    if (!guard.ok) return guard.response;

    const pegawaiId = guard.session.user.pegawaiId;
    if (!pegawaiId) {
      return [404, { message: 'Data pegawai tidak ditemukan.' }];
    }

    const item = pegawaiData.find((pegawai) => pegawai.id === pegawaiId);
    if (!item) {
      return [404, { message: 'Data pegawai tidak ditemukan.' }];
    }

    return [200, clone(item)];
  });

  mock.onPut('/api/pegawai/me').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['pegawai']);
    if (!guard.ok) return guard.response;

    const pegawaiId = guard.session.user.pegawaiId;
    if (!pegawaiId) {
      return [404, { message: 'Data pegawai tidak ditemukan.' }];
    }

    const index = pegawaiData.findIndex((pegawai) => pegawai.id === pegawaiId);
    if (index === -1) {
      return [404, { message: 'Data pegawai tidak ditemukan.' }];
    }

    const payload = JSON.parse(config.data ?? '{}');
    const allowedFields: Array<keyof Pegawai> = [
      'nama_lengkap',
      'tempat_lahir',
      'tanggal_lahir',
      'alamat_ktp',
      'no_hp',
      'email'
    ];

    const updated: Pegawai = {
      ...pegawaiData[index],
      updated_at: new Date().toISOString()
    };

    allowedFields.forEach((field) => {
      if (field in payload) {
        (updated as any)[field] = payload[field];
      }
    });

    pegawaiData[index] = updated;

    return [200, clone(updated)];
  });

  mock.onGet('/api/pegawai/statistik').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config, ['admin_hcgs']);
    if (!guard.ok) return guard.response;

    const jumlahPegawai = pegawaiData.length;
    const lengkap = Math.round(jumlahPegawai * 0.78);
    const habisKontrak = pegawaiData
      .filter((pegawai) => pegawai.akhir_kontrak)
      .sort((a, b) => (a.akhir_kontrak ?? '').localeCompare(b.akhir_kontrak ?? ''))
      .slice(0, 5);

    const response: StatistikResponse = {
      jumlahPegawai,
      persentaseLengkap: Math.round((lengkap / Math.max(jumlahPegawai, 1)) * 100),
      habisKontrak: clone(habisKontrak)
    };

    return [200, response];
  });

  mock.onGet('/api/aktivitas').reply((config: AxiosRequestConfig) => {
    const guard = requireAuth(config);
    if (!guard.ok) return guard.response;

    const limit = Number(config.params?.limit ?? aktivitasData.length);
    return [200, clone(aktivitasData.slice(0, limit))];
  });

  return mock;
};
