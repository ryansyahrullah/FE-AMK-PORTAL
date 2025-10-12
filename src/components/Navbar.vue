<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
        @click="$emit('toggle-sidebar')"
        aria-label="Buka navigasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Portal AMK
      </div>
    </div>
    <div class="flex items-center gap-4">
      <ThemeToggle :compact="true" class="hidden lg:inline-flex" />
      <ThemeToggle :compact="true" class="lg:hidden" />
      <div class="flex items-center gap-3 rounded-full border border-transparent bg-slate-100 px-3 py-1 dark:bg-slate-800">
        <div class="hidden text-right text-sm lg:block">
          <p class="font-semibold">{{ user?.nama ?? 'Administrator' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ user?.role ?? 'admin' }}</p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white uppercase">
          {{ inisialUser }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from './ThemeToggle.vue';

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

</script>
