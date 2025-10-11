<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Dashboard</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Ringkasan cepat aktivitas dan status pegawai terbaru.
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <CardStat
        title="Jumlah Pegawai"
        :value="statistik?.jumlahPegawai ?? '...'"
        description="Total pegawai terdaftar dalam sistem"
      />
      <CardStat title="% Biodata Lengkap" :value="persentaseLengkap" description="Persentase biodata pegawai yang sudah lengkap">
        <template #footer>
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div class="h-full rounded-full bg-primary" :style="{ width: persentaseLengkap + '%' }"></div>
          </div>
        </template>
      </CardStat>
      <CardStat
        title="Pegawai Habis Kontrak (30 hari)"
        :value="statistik?.habisKontrak.length ?? '...'"
        description="Jumlah pegawai dengan kontrak berakhir dalam 30 hari"
      />
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <section class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Pegawai Akan Habis Kontrak</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Pantau jadwal kontrak yang segera berakhir.</p>
            </div>
            <RouterLink
              to="/pegawai?filter=habis-kontrak"
              class="text-sm font-semibold text-primary hover:text-primary-dark"
            >
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
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Riwayat Aktivitas</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">10 aktivitas terbaru dari seluruh pengguna.</p>
          <ul class="mt-4 space-y-4">
            <li v-if="loadingAktivitas" v-for="n in 5" :key="n" class="animate-pulse">
              <div class="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
              <div class="mt-2 h-2 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
            </li>
            <li v-else-if="!aktivitas.length" class="flex flex-col items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span class="text-2xl">📭</span>
              Belum ada aktivitas terbaru.
            </li>
            <li v-else v-for="item in aktivitas" :key="item.id" class="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
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

const persentaseLengkap = computed(() => {
  if (!statistik.value) return '...';
  return `${statistik.value.persentaseLengkap}%`;
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

onMounted(() => {
  fetchStatistik();
  fetchAktivitas();
});
</script>
