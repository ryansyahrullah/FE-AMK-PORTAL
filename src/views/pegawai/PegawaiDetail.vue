<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Detail Pegawai</h2>
        <p class="text-sm text-slate-500 dark:text-slate-300">Informasi lengkap pegawai.</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <RouterLink :to="{ name: 'pegawai-edit', params: { id: pegawai?.id } }" class="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90">Ubah</RouterLink>
        <RouterLink :to="{ name: 'pegawai-list' }" class="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200">Kembali</RouterLink>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Data Utama</h3>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500">NRP</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.nrp }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Nama Lengkap</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.nama_lengkap }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Jabatan</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.jabatan }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Status</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.status_kepegawaian }}</dd>
          </div>
        </dl>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Kontak</h3>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500">Email</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.email || '-' }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Nomor HP</dt>
            <dd class="font-medium text-slate-900 dark:text-white">{{ pegawai?.no_hp }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">Alamat KTP</dt>
            <dd class="w-1/2 text-right font-medium text-slate-900 dark:text-white">{{ pegawai?.alamat_ktp }}</dd>
          </div>
        </dl>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:col-span-2">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Riwayat</h3>
        <dl class="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Tempat, Tanggal Lahir</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ pegawai?.tempat_lahir }}, {{ formatTanggal(pegawai?.tanggal_lahir) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Tanggal Masuk</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ formatTanggal(pegawai?.tanggal_masuk) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Akhir Kontrak</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ formatTanggal(pegawai?.akhir_kontrak) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-500">Diperbarui</dt>
            <dd class="mt-1 text-sm font-medium text-slate-900 dark:text-white">{{ formatTanggal(pegawai?.updated_at) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import http from '../../api/http';
import type { Pegawai } from '../../types';

const route = useRoute();
const pegawai = ref<Pegawai | null>(null);

const formatTanggal = (tanggal?: string | null) => {
  if (!tanggal) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(tanggal));
};

const loadPegawai = async () => {
  const id = Number(route.params.id);
  const { data } = await http.get<Pegawai>(`/api/pegawai/${id}`);
  pegawai.value = data;
};

onMounted(() => {
  loadPegawai();
});
</script>
