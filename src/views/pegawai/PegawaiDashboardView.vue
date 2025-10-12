<template>
  <div class="space-y-8">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Dashboard Pegawai</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Ringkasan status kepegawaian dan aktivitas terbaru Anda.
        </p>
      </div>
      <RouterLink
        :to="{ name: 'pegawai-biodata' }"
        class="inline-flex items-center gap-2 rounded-full border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 dark:border-primary/40 dark:text-primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 6.75h15m-15 4.5h15m-15 4.5H12" />
        </svg>
        Kelola Biodata
      </RouterLink>
    </header>

    <div v-if="loadingProfile" class="grid gap-6 md:grid-cols-3">
      <div v-for="index in 3" :key="index" class="h-36 animate-pulse rounded-3xl bg-slate-200/60 dark:bg-slate-800/60"></div>
    </div>
    <div v-else class="grid gap-6 md:grid-cols-3">
      <CardStat
        title="Status Kepegawaian"
        :value="statusKepegawaian"
        :description="bergabungSejak"
        variant="primary"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
          </svg>
        </template>
      </CardStat>
      <CardStat
        title="Masa Kerja"
        :value="masaKerja"
        :description="tanggalMasukInfo"
        variant="indigo"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </template>
      </CardStat>
      <CardStat
        title="Kontrak Berakhir"
        :value="kontrakBerakhir"
        :description="infoSisaHari"
        variant="rose"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3 1.5" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </template>
      </CardStat>
    </div>

    <section class="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
      <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Informasi Kepegawaian</h2>
        <div v-if="loadingProfile" class="space-y-4">
          <div v-for="index in 4" :key="`profile-skeleton-${index}`" class="h-10 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></div>
        </div>
        <dl v-else class="grid gap-4 sm:grid-cols-2">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">NRP</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{{ profile?.nrp }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Jabatan</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{{ profile?.jabatan }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tanggal Lahir</dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ profile?.tanggal_lahir ? formatDate(profile.tanggal_lahir) : '-' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Tempat Lahir</dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ profile?.tempat_lahir }}</dd>
          </div>
          <div class="sm:col-span-2">
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Alamat KTP</dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ profile?.alamat_ktp }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">No. HP</dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ profile?.no_hp }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</dt>
            <dd class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ profile?.email ?? '-' }}</dd>
          </div>
        </dl>
      </div>

      <div class="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Riwayat Aktivitas</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">10 terbaru</span>
        </div>
        <ul class="space-y-3">
          <li v-if="loadingAktivitas" v-for="index in 4" :key="`activity-skeleton-${index}`" class="h-14 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></li>
          <li
            v-else-if="aktivitas.length === 0"
            class="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
          >
            <span class="text-lg">🙌</span>
            <p class="mt-2">Belum ada aktivitas terbaru.</p>
          </li>
          <li v-else v-for="item in aktivitas" :key="item.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ item.judul }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ item.deskripsi }}</p>
              </div>
              <span class="text-xs text-slate-400 dark:text-slate-500">{{ formatDateTime(item.waktu) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CardStat from '../../components/CardStat.vue';
import http from '../../api/http';
import type { Aktivitas, Pegawai } from '../../types';

const loadingProfile = ref(true);
const loadingAktivitas = ref(true);
const profile = ref<Pegawai | null>(null);
const aktivitas = ref<Aktivitas[]>([]);

const statusKepegawaian = computed(() => profile.value?.status_kepegawaian ?? '-');
const bergabungSejak = computed(() =>
  profile.value ? `Bergabung sejak ${formatDate(profile.value.tanggal_masuk)}` : '-'
);
const masaKerja = computed(() => {
  if (!profile.value) return '-';
  return hitungMasaKerja(profile.value.tanggal_masuk);
});
const tanggalMasukInfo = computed(() =>
  profile.value ? `Tanggal masuk: ${formatDate(profile.value.tanggal_masuk)}` : '-'
);
const kontrakBerakhir = computed(() => {
  if (!profile.value) return '-';
  if (profile.value.status_kepegawaian === 'Permanen') return 'Tidak Ada';
  return profile.value.akhir_kontrak ? formatDate(profile.value.akhir_kontrak) : '-';
});
const infoSisaHari = computed(() => {
  if (!profile.value || !profile.value.akhir_kontrak || profile.value.status_kepegawaian === 'Permanen') {
    return 'Status permanen';
  }
  const akhir = new Date(profile.value.akhir_kontrak);
  const sekarang = new Date();
  const selisih = Math.ceil((akhir.getTime() - sekarang.getTime()) / (1000 * 60 * 60 * 24));
  if (selisih < 0) return 'Kontrak telah berakhir';
  return `${selisih} hari lagi`;
});

const fetchProfile = async () => {
  loadingProfile.value = true;
  try {
    const { data } = await http.get<Pegawai>('/api/pegawai/me');
    profile.value = data;
  } catch (error) {
    console.warn('Gagal memuat biodata pegawai', error);
  } finally {
    loadingProfile.value = false;
  }
};

const fetchAktivitas = async () => {
  loadingAktivitas.value = true;
  try {
    const { data } = await http.get<Aktivitas[]>('/api/aktivitas', {
      params: { limit: 6 }
    });
    aktivitas.value = data;
  } catch (error) {
    console.warn('Gagal memuat aktivitas', error);
  } finally {
    loadingAktivitas.value = false;
  }
};

onMounted(() => {
  fetchProfile();
  fetchAktivitas();
});

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function hitungMasaKerja(tanggalMasuk: string) {
  const masuk = new Date(tanggalMasuk);
  const sekarang = new Date();
  let totalBulan = (sekarang.getFullYear() - masuk.getFullYear()) * 12 + (sekarang.getMonth() - masuk.getMonth());
  if (sekarang.getDate() < masuk.getDate()) {
    totalBulan -= 1;
  }
  totalBulan = Math.max(0, totalBulan);
  const tahun = Math.floor(totalBulan / 12);
  const bulan = totalBulan % 12;
  const bagian: string[] = [];
  if (tahun > 0) bagian.push(`${tahun} tahun`);
  if (bulan > 0) bagian.push(`${bulan} bulan`);
  if (bagian.length === 0) return 'Baru bergabung';
  return bagian.join(' ');
}
</script>
