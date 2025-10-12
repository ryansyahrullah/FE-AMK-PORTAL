<template>
  <button
    type="button"
    :aria-label="isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'"
    class="group relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary/70"
    @click="toggleTheme"
  >
    <span
      class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary transition dark:bg-primary/20 dark:text-primary/90"
    >
      <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          d="M10 2.5a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1A.75.75 0 0110 2.5zM10 14.75a.75.75 0 01.75.75v1a.75.75 0 01-1.5 0v-1a.75.75 0 01.75-.75zM4.47 4.47a.75.75 0 011.06 0l.71.7a.75.75 0 11-1.06 1.07l-.7-.71a.75.75 0 010-1.06zm8.29 8.3a.75.75 0 011.06 0l.7.7a.75.75 0 11-1.06 1.07l-.7-.71a.75.75 0 010-1.06zM2.5 10a.75.75 0 01.75-.75h1a.75.75 0 010 1.5h-1A.75.75 0 012.5 10zm14.25-.75a.75.75 0 000 1.5h1a.75.75 0 000-1.5h-1zM5.53 13.23a.75.75 0 010 1.06l-.7.71a.75.75 0 01-1.06-1.07l.7-.7a.75.75 0 011.06 0zm8.3-8.29a.75.75 0 010 1.06l-.71.7a.75.75 0 01-1.06-1.06l.7-.7a.75.75 0 011.07 0zM10 5.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M17.293 13.293A8 8 0 016.707 2.707 6.5 6.5 0 1017.293 13.293z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
    <template v-if="!compact">
      <span class="hidden md:inline">{{ isDark ? 'Mode Gelap' : 'Mode Terang' }}</span>
      <span class="md:hidden text-xs font-medium">{{ isDark ? 'Gelap' : 'Terang' }}</span>
    </template>
    <span
      class="absolute inset-0 -z-10 rounded-full bg-primary/5 opacity-0 transition group-hover:opacity-100"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{ compact?: boolean }>();
const compact = computed(() => props.compact ?? false);

const isDark = ref(false);
const storageKey = 'amk_theme';

const applyTheme = (dark: boolean) => {
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  localStorage.setItem(storageKey, dark ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
};

onMounted(() => {
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    isDark.value = stored === 'dark';
  } else {
    isDark.value = document.documentElement.classList.contains('dark');
  }
  applyTheme(isDark.value);
});

watch(isDark, (value) => {
  applyTheme(value);
});
</script>
