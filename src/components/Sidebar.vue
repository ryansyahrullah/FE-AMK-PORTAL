<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white/95 shadow-lg backdrop-blur transition-all duration-200 ease-out dark:border-slate-800 dark:bg-slate-900/95 lg:static lg:translate-x-0 lg:opacity-100',
      mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 lg:opacity-100'
    ]"
  >
    <div class="flex items-center gap-2 px-5 py-6 text-xl font-semibold text-primary">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m-4 0h8" />
      </svg>
      AMK Portal
    </div>
    <nav class="flex-1 space-y-1 px-3">
      <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
        :class="isActive(item.to)
          ? 'bg-primary/10 text-primary shadow-sm dark:bg-primary/20'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
        @click="$emit('close-mobile')"
      >
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <component :is="item.icon" class="h-5 w-5" />
        </span>
        <span class="truncate">{{ item.label }}</span>
      </RouterLink>
    </nav>
    <div class="border-t border-slate-200 p-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
      © {{ new Date().getFullYear() }} AMK Portal
    </div>
  </aside>
  <div
    v-if="mobileOpen"
    class="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-sm lg:hidden"
    @click="$emit('close-mobile')"
  ></div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { RouterLink, useRoute, type RouteLocationRaw } from 'vue-router';

const props = defineProps<{ collapsed?: boolean; mobileOpen?: boolean }>();

const items = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    to: { name: 'dashboard' },
    icon: defineAsyncComponent(() => import('./icons/HomeIcon.vue'))
  },
  {
    name: 'pegawai-list',
    label: 'Data Pegawai',
    to: { name: 'pegawai-list' },
    icon: defineAsyncComponent(() => import('./icons/UsersIcon.vue'))
  }
];

const route = useRoute();
const mobileOpen = computed(() => props.mobileOpen ?? false);

const isActive = (to: RouteLocationRaw) => {
  if (typeof to === 'string') {
    return route.fullPath === to;
  }
  if ('name' in to && to.name) {
    return route.name === to.name;
  }
  return false;
};
</script>
