import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { Aktivitas, AuthResponse, Pegawai, StatistikResponse } from '../types';

const adminCredential = {
  nrp: 'admin@gmail.com',
  password: 'admin123',
  user: {
    id: 1,
    nama: 'Admin Portal',
    role: 'admin' as const
  }
};

const createPegawaiSeed = (): Pegawai[] => {
  const today = new Date();
  return Array.from({ length: 20 }).map((_, index) => {
    const kontrak = index % 2 === 0;
    const masuk = new Date(today);
    masuk.setFullYear(today.getFullYear() - (index % 5));
    const akhir = new Date(today);
    akhir.setDate(today.getDate() + (index + 1) * 12);
    return {
      id: index + 1,
      nrp: `NRP${String(index + 1).padStart(4, '0')}`,
      nama_lengkap: `Pegawai ${index + 1}`,
      jabatan: kontrak ? 'Staff Kontrak' : 'Staff Tetap',
      tempat_lahir: 'Surabaya',
      tanggal_lahir: '1990-01-01',
      alamat_ktp: 'Jl. Contoh No. 123, Surabaya',
      tanggal_masuk: masuk.toISOString().slice(0, 10),
      status_kepegawaian: kontrak ? 'Kontrak' : 'Permanen',
      akhir_kontrak: kontrak ? akhir.toISOString().slice(0, 10) : null,
      no_hp: '081234567890',
      email: `pegawai${index + 1}@contoh.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });
};

const aktivitasSeed: Aktivitas[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  judul: `Aktivitas ${index + 1}`,
  deskripsi: 'Pembaruan data pegawai oleh admin.',
  waktu: new Date(Date.now() - index * 3600 * 1000).toISOString()
}));

const pegawaiData = createPegawaiSeed();

export const initMockServer = (http: AxiosInstance) => {
  const mock = new MockAdapter(http, { delayResponse: 300 });

  mock.onPost('/api/login').reply((config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data ?? '{}');
    const nrp = String(payload.nrp ?? '').trim().toLowerCase();
    const password = String(payload.password ?? '').trim();

    if (nrp === adminCredential.nrp && password === adminCredential.password) {
      const response: AuthResponse = {
        token: 'mock-token',
        user: adminCredential.user
      };
      return [200, response];
    }

    return [401, { message: 'NRP atau kata sandi tidak sesuai.' }];
  });

  mock.onPost('/api/logout').reply(204);

  mock.onGet('/api/pegawai').reply((config: AxiosRequestConfig) => {
    const params = config.params ?? {};
    const search = String(params.search ?? '').toLowerCase();
    const page = Number(params.page ?? 1);
    const perPage = Number(params.per_page ?? 10);

    const filtered = pegawaiData.filter((item) => {
      if (!search) return true;
      return (
        item.nrp.toLowerCase().includes(search) ||
        item.nama_lengkap.toLowerCase().includes(search)
      );
    });

    const start = (page - 1) * perPage;
    const data = filtered.slice(start, start + perPage);

    return [200, {
      data,
      meta: {
        total: filtered.length,
        per_page: perPage,
        current_page: page
      }
    }];
  });

  mock.onGet(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url?.split('/').pop());
    const item = pegawaiData.find((pegawai) => pegawai.id === id);
    if (!item) {
      return [404, { message: 'Pegawai tidak ditemukan.' }];
    }
    return [200, item];
  });

  mock.onPost('/api/pegawai').reply((config: AxiosRequestConfig) => {
    const payload = JSON.parse(config.data ?? '{}');
    const id = pegawaiData.length + 1;
    const newPegawai: Pegawai = {
      ...payload,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    pegawaiData.push(newPegawai);
    return [201, newPegawai];
  });

  mock.onPut(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
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
    return [200, updated];
  });

  mock.onDelete(/\/api\/pegawai\/\d+$/).reply((config: AxiosRequestConfig) => {
    const id = Number(config.url?.split('/').pop());
    const index = pegawaiData.findIndex((pegawai) => pegawai.id === id);
    if (index === -1) {
      return [404, { message: 'Pegawai tidak ditemukan.' }];
    }
    pegawaiData.splice(index, 1);
    return [204];
  });

  mock.onGet('/api/pegawai/statistik').reply(() => {
    const jumlahPegawai = pegawaiData.length;
    const lengkap = Math.round(jumlahPegawai * 0.8);
    const habisKontrak = pegawaiData.filter((item) => item.akhir_kontrak).slice(0, 5);

    const response: StatistikResponse = {
      jumlahPegawai,
      persentaseLengkap: Math.round((lengkap / Math.max(jumlahPegawai, 1)) * 100),
      habisKontrak
    };

    return [200, response];
  });

  mock.onGet('/api/aktivitas').reply(() => [200, aktivitasSeed]);

  return mock;
};
