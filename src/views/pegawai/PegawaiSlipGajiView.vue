<template>
  <section class="mx-auto max-w-3xl space-y-8 text-center">
    <header class="space-y-3">
      <span class="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      </span>
      <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Slip Gaji Digital</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Kami sedang menyiapkan halaman slip gaji agar Anda bisa mengunduh dan meninjau detail penghasilan secara mandiri.
      </p>
    </header>
    <div class="space-y-6 rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
      <p class="text-sm text-slate-600 dark:text-slate-300">
        Nantikan pembaruan berikutnya. Anda akan menerima notifikasi ketika slip gaji digital sudah dapat diakses langsung dari portal ini.
      </p>
      <RouterLink
        :to="{ name: 'pegawai-dashboard' }"
        class="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10 dark:border-primary/30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Kembali ke dashboard
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
