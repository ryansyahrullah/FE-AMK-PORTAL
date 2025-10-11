<template>
  <transition name="fade">
    <div v-if="mobileOpen" class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" @click="$emit('close-mobile')"></div>
  </transition>
  <aside
    :class="[
      'fixed inset-y-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 lg:static',
      collapsed ? 'w-20' : 'w-72',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-2" :class="collapsed ? 'justify-center w-full' : ''">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
          AM
        </div>
        <div v-if="!collapsed" class="text-lg font-semibold text-slate-800 dark:text-slate-100">
          AMK Portal
        </div>
      </div>
      <button
        type="button"
        class="hidden h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:flex"
        aria-label="Sembunyikan sidebar"
        @click="$emit('toggle-collapse')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
    </div>
    <nav class="flex-1 space-y-1 px-3 pb-6">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
        :class="[
          isActive(item.to)
            ? 'bg-primary text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        ]"
      >
        <span class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-[.bg-primary]:bg-white group-[.bg-primary]:text-primary">
          <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h16.5M3.75 18.75h16.5" />
          </svg>
          <svg v-else-if="item.icon === 'pegawai'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 7.5V3.75m0 0h-3.75M16.5 3.75 21 8.25M4.5 12.75h6M4.5 16.5h6m3 0h1.5m4.5 0H21M3 5.25h6M3 9h6m3-5.25h4.5" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </span>
        <span v-if="!collapsed">{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';

interface MenuItem {
  label: string;
  to: string;
  icon: 'dashboard' | 'pegawai';
}

const props = defineProps<{
  collapsed: boolean;
  mobileOpen: boolean;
}>();

defineEmits(['close-mobile', 'toggle-collapse']);

const route = useRoute();

const isActive = (to: string) => route.path.startsWith(to);

const menuItems = computed<MenuItem[]>(() => [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'Menu Pegawai',
    to: '/pegawai',
    icon: 'pegawai'
  }
]);

const mobileOpen = computed(() => props.mobileOpen);
const collapsed = computed(() => props.collapsed);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
