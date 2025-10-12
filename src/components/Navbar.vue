<template>
  <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-900/90 sm:px-6">
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:hidden"
        @click="$emit('toggle-sidebar')"
        aria-label="Buka navigasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <h1 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Portal Admin</h1>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-3 rounded-full border border-transparent bg-slate-100 px-3 py-1 dark:bg-slate-800">
        <div class="hidden text-right text-sm lg:block">
          <p class="font-semibold">{{ user?.nama ?? 'Administrator' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Administrator</p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white uppercase">
          {{ inisialUser }}
        </div>
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-transparent bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
        @click="handleLogout"
      >
        Keluar
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

defineEmits(['toggle-sidebar']);
const router = useRouter();
const auth = useAuthStore();
const user = computed(() => auth.state.user);

const inisialUser = computed(() => {
  if (!user.value) return 'AD';
  return user.value.nama
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

const handleLogout = async () => {
  await auth.logout();
  router.replace({ name: 'login' });
};
</script>
