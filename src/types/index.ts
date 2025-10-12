export interface LoginPayload {
  nrp: string;
  password: string;
}

export interface User {
  id: number;
  nama: string;
  role: 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type StatusKepegawaian = 'Kontrak' | 'Permanen';

export interface Pegawai {
  id: number;
  nrp: string;
  nama_lengkap: string;
  jabatan: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_ktp: string;
  tanggal_masuk: string;
  status_kepegawaian: StatusKepegawaian;
  akhir_kontrak: string | null;
  no_hp: string;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatistikResponse {
  jumlahPegawai: number;
  persentaseLengkap: number;
  habisKontrak: Pegawai[];
}

export interface Aktivitas {
  id: number;
  judul: string;
  deskripsi: string;
  waktu: string;
}

export interface PaginatedPegawai {
  data: Pegawai[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export interface PegawaiFilter {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
