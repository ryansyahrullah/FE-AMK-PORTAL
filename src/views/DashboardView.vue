<template>
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-300">Ringkasan aktivitas dan status pegawai.</p>
    </section>

    <section class="grid gap-6 md:grid-cols-3">
      <CardStat label="Jumlah Pegawai" :value="statistik?.jumlahPegawai ?? 0">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </template>
      </CardStat>
      <CardStat label="% Biodata Lengkap" :value="`${statistik?.persentaseLengkap ?? 0}%`" description="Persentase pegawai dengan biodata lengkap." />
      <CardStat label="Pegawai Habis Kontrak" :value="statistik?.habisKontrak.length ?? 0" description="30 hari ke depan" />
    </section>

    <section class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Aktivitas</h3>
        </div>
        <ul class="mt-4 space-y-4">
          <li v-for="item in aktivitas" :key="item.id" class="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p class="font-medium text-slate-800 dark:text-slate-100">{{ item.judul }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatTanggal(item.waktu) }}</p>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ item.deskripsi }}</p>
          </li>
          <li v-if="!aktivitas.length" class="text-sm text-slate-500 dark:text-slate-300">Belum ada aktivitas.</li>
        </ul>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Akan Habis Kontrak</h3>
          <RouterLink class="text-sm font-medium text-primary hover:underline" :to="{ name: 'pegawai-list' }">Lihat Semua</RouterLink>
        </div>
        <table class="mt-4 w-full text-left text-sm">
          <thead>
            <tr class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th class="pb-2">NRP</th>
              <th class="pb-2">Nama</th>
              <th class="pb-2">Jabatan</th>
              <th class="pb-2">Akhir Kontrak</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pegawai in statistik?.habisKontrak ?? []" :key="pegawai.id" class="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200">
              <td class="py-3">{{ pegawai.nrp }}</td>
              <td class="py-3">{{ pegawai.nama_lengkap }}</td>
              <td class="py-3">{{ pegawai.jabatan }}</td>
              <td class="py-3">{{ formatTanggal(pegawai.akhir_kontrak) }}</td>
            </tr>
            <tr v-if="!(statistik?.habisKontrak.length)" class="text-sm text-slate-500 dark:text-slate-300">
              <td colspan="4" class="py-6 text-center">Belum ada data kontrak yang akan habis.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CardStat from '../components/CardStat.vue';
import http from '../api/http';
import type { Aktivitas, StatistikResponse } from '../types';

const statistik = ref<StatistikResponse | null>(null);
const aktivitas = ref<Aktivitas[]>([]);

const formatTanggal = (tanggal?: string | null) => {
  if (!tanggal) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(tanggal));
};

const fetchData = async () => {
  const [statRes, aktivitasRes] = await Promise.all([
    http.get<StatistikResponse>('/api/pegawai/statistik'),
    http.get<Aktivitas[]>('/api/aktivitas')
  ]);
  statistik.value = statRes.data;
  aktivitas.value = aktivitasRes.data;
};

onMounted(() => {
  fetchData();
});
</script>
