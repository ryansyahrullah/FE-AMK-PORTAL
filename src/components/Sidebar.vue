<template>
  <transition name="fade">
    <div v-if="mobileOpen" class="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" @click="$emit('close-mobile')"></div>
  </transition>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-200 dark:border-slate-800 dark:bg-slate-900',
      collapsed ? 'w-20' : 'w-72',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <div class="flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-2" :class="collapsed ? 'w-full justify-center' : ''">
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
    <nav class="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
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
    <div class="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
      <div v-if="!collapsed" class="mb-3 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary dark:bg-primary/20">
          {{ inisialUser }}
        </div>
        <div class="text-sm">
          <p class="font-semibold text-slate-800 dark:text-slate-100">{{ user?.nama ?? 'Admin Portal' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ user?.email ?? 'admin@gmail.com' }}</p>
        </div>
      </div>
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-400/60 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        @click="handleLogout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        <span v-if="!collapsed">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

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

const auth = useAuthStore();
const router = useRouter();

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
