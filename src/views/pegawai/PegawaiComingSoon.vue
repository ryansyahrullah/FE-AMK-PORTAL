<template>
  <section class="mx-auto max-w-4xl space-y-8">
    <header class="flex flex-col gap-2 text-center">
      <span class="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>
      <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h1>
      <p class="text-sm text-slate-600 dark:text-slate-300">{{ description }}</p>
    </header>
    <div
      class="space-y-6 rounded-3xl border border-dashed border-slate-300 bg-white/60 p-10 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70"
    >
      <p class="text-base text-slate-600 dark:text-slate-300">
        Kami sedang memoles pengalaman terbaik untuk fitur ini. Sementara waktu, silakan kembali ke menu data pegawai untuk melanjutkan pengelolaan data utama.
      </p>
      <Button class="mx-auto" variant="secondary" @click="kembaliKePegawai">
        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Kembali ke Data Pegawai
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../../components/Button.vue';

const route = useRoute();
const router = useRouter();

const title = computed(() => (route.meta.title as string) || 'Segera Hadir');
const description = computed(
  () =>
    (route.meta.description as string) ||
    'Fitur ini sedang kami siapkan agar dapat membantu proses administrasi Anda menjadi lebih efisien.'
);

const kembaliKePegawai = () => {
  router.push({ name: 'pegawai-list' }).catch(() => undefined);
};
</script>
