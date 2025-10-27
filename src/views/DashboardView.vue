<template>
  <div class="space-y-8">
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-indigo-600 p-8 text-white shadow-glow">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_55%)]"></div>
      <div class="absolute bottom-[-6rem] right-[-2rem] h-48 w-48 rounded-full bg-white/20 blur-3xl"></div>
      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div class="max-w-2xl">
          <p class="text-sm uppercase tracking-[0.35em] text-white/70">Ringkasan AMK</p>
          <h1 class="mt-3 text-3xl font-semibold leading-tight">Dashboard SDM modern untuk memantau kinerja tim Anda.</h1>
          <p class="mt-4 text-sm text-white/75">
            Pantau jumlah pegawai, progres kelengkapan biodata, dan pegawai yang perlu tindakan cepat dalam kurun 30 hari ke depan.
          </p>
        </div>
        <div class="flex flex-col gap-4 sm:flex-row">
          <Button variant="ghost" class="border border-white/30 bg-white/20 text-white hover:bg-white/30" @click="refreshData">
            Segarkan Data
          </Button>
          <RouterLink to="/pegawai" class="inline-flex">
            <Button class="shadow-md shadow-black/10">Kelola Pegawai</Button>
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <CardStat
        title="Jumlah Pegawai"
        :value="statistik?.jumlahPegawai ? statistik.jumlahPegawai.toLocaleString('id-ID') : '...'"
        description="Pegawai aktif dalam sistem"
        variant="primary"
        trend-label="dibanding bulan lalu"
        trend-value="+12 pegawai"
        :trend-positive="true"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6c1.5 0 2.75-1.25 2.75-2.75S13.5.5 12 .5 9.25 1.75 9.25 3.25 10.5 6 12 6zm0 0c3.25 0 5.75 2.5 5.75 5.75V18h-11.5v-6.25C6.25 8.5 8.75 6 12 6z" />
          </svg>
        </template>
      </CardStat>
      <CardStat
        title="% Biodata Lengkap"
        :value="statistik ? `${statistik.persentaseLengkap}%` : '...'"
        description="Progress kelengkapan dokumen pegawai"
        variant="indigo"
        trend-label="target 85% terpenuhi"
        trend-value="+6%"
      >
        <template #footer>
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/30">
            <div class="h-full rounded-full bg-white" :style="{ width: biodataProgress }"></div>
          </div>
        </template>
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </template>
      </CardStat>
      <CardStat
        title="Pegawai Habis Kontrak"
        :value="statistik ? statistik.habisKontrak.length : '...'"
        description="Berakhir dalam 30 hari ke depan"
        variant="rose"
        trend-label="butuh tindak lanjut"
        trend-value="3 pending"
        :trend-positive="false"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l3 3" />
          </svg>
        </template>
      </CardStat>
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Performa Program Pengembangan</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Perbandingan aktivitas pelatihan dan onboarding per bulan.</p>
          </div>
          <div class="flex gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span class="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">Pelatihan</span>
            <span class="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-accent">Onboarding</span>
          </div>
        </div>
        <div class="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <div class="h-56 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <div class="flex h-full items-end gap-4">
                <div
                  v-for="item in pelatihanSeries"
                  :key="item.label"
                  class="flex flex-1 flex-col items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
                >
                  <div class="flex h-full w-full items-end gap-2">
                    <div class="w-1/2 rounded-full bg-primary/60" :style="{ height: barHeight(item.pelatihan) }"></div>
                    <div class="w-1/2 rounded-full bg-accent/70" :style="{ height: barHeight(item.onboarding) }"></div>
                  </div>
                  <span>{{ item.label }}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="h-56 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60">
              <svg viewBox="0 0 100 100" class="h-full w-full">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(37,99,235,0.45)" />
                    <stop offset="100%" stop-color="rgba(37,99,235,0.05)" />
                  </linearGradient>
                </defs>
                <polygon :points="areaPoints" fill="url(#trendGradient)" />
                <polyline :points="linePoints" fill="none" stroke="rgba(37,99,235,0.85)" stroke-width="2.5" stroke-linecap="round" />
                <g v-for="(value, index) in salesTrend" :key="`point-${index}`">
                  <circle :cx="pointX(index)" :cy="pointY(value)" r="2" fill="#2563eb" />
                </g>
              </svg>
              <div class="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span v-for="label in monthlyLabels" :key="`label-${label}`">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Komposisi Status Pegawai</h2>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Distribusi status kepegawaian berdasarkan data terbaru.</p>
        <ul class="mt-5 space-y-4">
          <li v-for="status in statusSummary" :key="status.label" class="space-y-2">
            <div class="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>{{ status.label }}</span>
              <span>{{ status.value }} pegawai</span>
            </div>
            <div class="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
              <div class="h-2 rounded-full" :class="status.barClass" :style="{ width: `${status.percent}%` }"></div>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ status.percent }}% dari total pegawai</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <section class="lg:col-span-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Pegawai Akan Habis Kontrak</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Pantau jadwal kontrak yang segera berakhir.</p>
            </div>
            <RouterLink to="/pegawai?filter=habis-kontrak" class="text-sm font-semibold text-primary hover:text-primary-dark">
              Lihat Semua
            </RouterLink>
          </div>
          <div class="mt-4">
            <AppTable
              :columns="kontrakColumns"
              :items="statistik?.habisKontrak ?? []"
              :loading="loadingStatistik"
              row-key="id"
              empty-message="Tidak ada pegawai yang akan habis kontrak."
            >
              <template #cell-akhir_kontrak="{ item }">
                <span>{{ formatDate(item.akhir_kontrak) }}</span>
              </template>
            </AppTable>
          </div>
        </div>
      </section>
      <section>
        <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Riwayat Aktivitas</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">10 aktivitas terbaru dari seluruh pengguna.</p>
          <ul class="mt-4 space-y-4">
            <li v-if="loadingAktivitas" v-for="n in 5" :key="`skeleton-${n}`" class="animate-pulse space-y-3">
              <div class="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
              <div class="h-2 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
            </li>
            <li
              v-else-if="!aktivitas.length"
              class="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              <span class="text-3xl">📭</span>
              Belum ada aktivitas terbaru.
            </li>
            <li v-else v-for="item in aktivitas" :key="item.id" class="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-100">{{ item.judul }}</p>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ item.deskripsi }}</p>
              <p class="mt-2 text-xs text-slate-400 dark:text-slate-500">{{ formatDateTime(item.waktu) }}</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../components/Button.vue';
import CardStat from '../components/CardStat.vue';
import AppTable from '../components/AppTable.vue';
import http from '../api/http';
import type { Aktivitas, StatistikResponse } from '../types';

const statistik = ref<StatistikResponse | null>(null);
const aktivitas = ref<Aktivitas[]>([]);
const loadingStatistik = ref(false);
const loadingAktivitas = ref(false);

const kontrakColumns = [
  { key: 'nrp', label: 'NRP' },
  { key: 'nama_lengkap', label: 'Nama' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'akhir_kontrak', label: 'Akhir Kontrak' }
];

const biodataProgress = computed(() => {
  if (!statistik.value) return '0%';
  return `${Math.min(statistik.value.persentaseLengkap, 100)}%`;
});

const pelatihanSeries = ref([
  { label: 'Jan', pelatihan: 18, onboarding: 11 },
  { label: 'Feb', pelatihan: 22, onboarding: 14 },
  { label: 'Mar', pelatihan: 27, onboarding: 19 },
  { label: 'Apr', pelatihan: 24, onboarding: 16 },
  { label: 'Mei', pelatihan: 28, onboarding: 21 },
  { label: 'Jun', pelatihan: 31, onboarding: 24 }
]);

const maxPelatihanValue = computed(() =>
  pelatihanSeries.value.reduce((acc, item) => Math.max(acc, item.pelatihan, item.onboarding), 1)
);

const barHeight = (value: number) => `${Math.round((value / maxPelatihanValue.value) * 100)}%`;

const salesTrend = ref([32, 45, 39, 58, 63, 71, 66]);
const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul'];

const maxSalesValue = computed(() => salesTrend.value.reduce((acc, value) => Math.max(acc, value), 1));

const pointX = (index: number) => ((index / (salesTrend.value.length - 1)) * 100).toFixed(2);
const pointY = (value: number) => (100 - (value / maxSalesValue.value) * 100).toFixed(2);

const linePoints = computed(() =>
  salesTrend.value
    .map((value, index) => `${pointX(index)},${pointY(value)}`)
    .join(' ')
);

const areaPoints = computed(() => `${linePoints.value} 100,100 0,100`);

const statusSummary = computed(() => {
  const total = statistik.value?.jumlahPegawai ?? 0;
  const kontrak = statistik.value?.habisKontrak.length ?? 0;
  const permanen = Math.max(total - kontrak, 0);
  const kontrakPercent = total ? Math.round((kontrak / total) * 100) : 0;
  const permanenPercent = Math.max(100 - kontrakPercent, 0);

  return [
    {
      label: 'Status Kontrak',
      value: kontrak,
      percent: kontrakPercent,
      barClass: 'bg-amber-400'
    },
    {
      label: 'Status Permanen',
      value: permanen,
      percent: permanenPercent,
      barClass: 'bg-emerald-400'
    }
  ];
});

const formatDate = (value: string | null) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fetchStatistik = async () => {
  loadingStatistik.value = true;
  try {
    const { data } = await http.get<StatistikResponse>('/api/pegawai/statistik');
    statistik.value = data;
  } catch (error) {
    console.error('Gagal memuat statistik pegawai', error);
  } finally {
    loadingStatistik.value = false;
  }
};

const fetchAktivitas = async () => {
  loadingAktivitas.value = true;
  try {
    const { data } = await http.get<Aktivitas[]>('/api/aktivitas', { params: { limit: 10 } });
    aktivitas.value = data;
  } catch (error) {
    console.error('Gagal memuat aktivitas', error);
  } finally {
    loadingAktivitas.value = false;
  }
};

const refreshData = () => {
  fetchStatistik();
  fetchAktivitas();
};

onMounted(() => {
  fetchStatistik();
  fetchAktivitas();
});
</script>
