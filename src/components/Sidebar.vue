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
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
      </button>
    </div>
    <nav class="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
      <div v-for="item in menuItems" :key="item.id" class="space-y-1">
        <RouterLink
          v-if="!item.children"
          :to="item.to"
          class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition"
          :class="[
            isRouteActive(item.to)
              ? 'bg-primary text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          ]"
        >
          <span
            class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-[.bg-primary]:bg-white group-[.bg-primary]:text-primary"
          >
            <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h9M3.75 18.75h9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 14.25h3.75M16.5 18.75h3.75" />
            </svg>
            <svg v-else-if="item.icon === 'pegawai'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
            </svg>
            <svg v-else-if="item.icon === 'list'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
            </svg>
            <svg v-else-if="item.icon === 'leave'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5H8.25A3.75 3.75 0 0 0 4.5 11.25v0A3.75 3.75 0 0 0 8.25 15H19.5" />
            </svg>
            <svg v-else-if="item.icon === 'health'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75V9" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m13.5 5.25-.75-1.5-.75 1.5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-2.25" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 18.75.75 1.5.75-1.5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h2.25" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 10.5-1.5.75 1.5.75" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M18 12h-2.25" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 13.5 1.5-.75-1.5-.75" />
              <circle cx="12" cy="12" r="3.75" />
            </svg>
            <svg v-else-if="item.icon === 'contract'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9A2.25 2.25 0 0 0 18.75 18V6A2.25 2.25 0 0 0 16.5 3.75Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6M9 12h6M9 15.75h3" />
            </svg>
          </span>
          <span v-if="!collapsed">{{ item.label }}</span>
        </RouterLink>
        <div v-else>
          <button
            type="button"
            class="group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition"
            :class="[
              isParentActive(item)
                ? 'bg-primary text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            ]"
            @click="handleParentClick(item)"
          >
            <span class="flex flex-1 items-center gap-3">
              <span
                class="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-[.bg-primary]:bg-white group-[.bg-primary]:text-primary"
              >
                <svg v-if="item.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h9M3.75 18.75h9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 14.25h3.75M16.5 18.75h3.75" />
                </svg>
                <svg v-else-if="item.icon === 'pegawai'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
                </svg>
                <svg v-else-if="item.icon === 'list'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
                </svg>
                <svg v-else-if="item.icon === 'leave'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5H8.25A3.75 3.75 0 0 0 4.5 11.25v0A3.75 3.75 0 0 0 8.25 15H19.5" />
                </svg>
                <svg v-else-if="item.icon === 'health'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75V9" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m13.5 5.25-.75-1.5-.75 1.5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-2.25" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 18.75.75 1.5.75-1.5" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h2.25" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 10.5-1.5.75 1.5.75" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18 12h-2.25" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 13.5 1.5-.75-1.5-.75" />
                  <circle cx="12" cy="12" r="3.75" />
                </svg>
                <svg v-else-if="item.icon === 'contract'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9A2.25 2.25 0 0 0 18.75 18V6A2.25 2.25 0 0 0 16.5 3.75Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6M9 12h6M9 15.75h3" />
                </svg>
              </span>
              <span v-if="!collapsed">{{ item.label }}</span>
            </span>
            <svg
              v-if="!collapsed"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.5"
              :class="isExpanded(item.id) ? 'rotate-180' : ''"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <transition name="accordion">
            <div
              v-if="isExpanded(item.id) && !collapsed"
              class="ml-4 space-y-1 border-l border-slate-200 pl-4 dark:border-slate-800"
            >
              <RouterLink
                v-for="child in item.children"
                :key="child.id"
                :to="child.to"
                class="group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition"
                :class="[
                  isRouteActive(child.to)
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                ]"
              >
                <span class="flex items-center gap-3">
                  <span
                    class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/5 text-primary group-[.bg-primary/10]:bg-white group-[.bg-primary/10]:text-primary"
                  >
                    <svg v-if="child.icon === 'dashboard'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 5.25h16.5M3.75 9.75h16.5M3.75 14.25h9M3.75 18.75h9" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 14.25h3.75M16.5 18.75h3.75" />
                    </svg>
                    <svg v-else-if="child.icon === 'pegawai'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 20.25a7.5 7.5 0 0 1 15 0" />
                    </svg>
                    <svg v-else-if="child.icon === 'list'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 6.75h15M4.5 12h15M4.5 17.25h15" />
                    </svg>
                    <svg v-else-if="child.icon === 'leave'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.5H8.25A3.75 3.75 0 0 0 4.5 11.25v0A3.75 3.75 0 0 0 8.25 15H19.5" />
                    </svg>
                    <svg v-else-if="child.icon === 'health'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75V9" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="m13.5 5.25-.75-1.5-.75 1.5" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-2.25" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="m10.5 18.75.75 1.5.75-1.5" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h2.25" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="m5.25 10.5-1.5.75 1.5.75" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M18 12h-2.25" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 13.5 1.5-.75-1.5-.75" />
                      <circle cx="12" cy="12" r="3.75" />
                    </svg>
                    <svg v-else-if="child.icon === 'contract'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75h-9A2.25 2.25 0 0 0 5.25 6v12A2.25 2.25 0 0 0 7.5 20.25h9A2.25 2.25 0 0 0 18.75 18V6A2.25 2.25 0 0 0 16.5 3.75Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25h6M9 12h6M9 15.75h3" />
                    </svg>
                  </span>
                  <span>{{ child.label }}</span>
                </span>
                <span
                  v-if="child.comingSoon"
                  class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  Segera hadir
                </span>
              </RouterLink>
            </div>
          </transition>
        </div>
      </div>
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
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
        <span v-if="!collapsed">Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

interface MenuChild {
  id: string;
  label: string;
  to: string;
  icon: IconName;
  comingSoon?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  to?: string;
  icon: IconName;
  children?: MenuChild[];
}

type IconName = 'dashboard' | 'pegawai' | 'list' | 'leave' | 'health' | 'contract';

const props = defineProps<{
  collapsed: boolean;
  mobileOpen: boolean;
}>();

defineEmits(['close-mobile', 'toggle-collapse']);

const route = useRoute();
const router = useRouter();

const mobileOpen = computed(() => props.mobileOpen);
const collapsed = computed(() => props.collapsed);

const menuItems = computed<MenuItem[]>(() => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'dashboard'
  },
  {
    id: 'pegawai',
    label: 'Menu Pegawai',
    to: '/pegawai',
    icon: 'pegawai',
    children: [
      {
        id: 'pegawai-data',
        label: 'Data Pegawai',
        to: '/pegawai',
        icon: 'list'
      },
      {
        id: 'pegawai-cuti',
        label: 'Pengajuan Cuti',
        to: '/pegawai/pengajuan-cuti',
        icon: 'leave',
        comingSoon: true
      },
      {
        id: 'pegawai-mcu',
        label: 'Pengajuan MCU',
        to: '/pegawai/pengajuan-mcu',
        icon: 'health',
        comingSoon: true
      },
      {
        id: 'pegawai-kontrak',
        label: 'Buat Kontrak',
        to: '/pegawai/buat-kontrak',
        icon: 'contract',
        comingSoon: true
      }
    ]
  }
]);

const expandedKeys = ref<string[]>([]);

const isExpanded = (id: string) => expandedKeys.value.includes(id);

const ensureExpanded = (id: string) => {
  if (!isExpanded(id)) {
    expandedKeys.value.push(id);
  }
};

const collapseExpanded = (id: string) => {
  expandedKeys.value = expandedKeys.value.filter((key) => key !== id);
};

const toggleExpanded = (id: string) => {
  if (isExpanded(id)) {
    collapseExpanded(id);
  } else {
    ensureExpanded(id);
  }
};

const isRouteActive = (to?: string) => {
  if (!to) return false;
  if (route.path === to) return true;
  return route.path.startsWith(`${to}/`);
};

const isParentActive = (item: MenuItem) => {
  const directActive = isRouteActive(item.to);
  const childActive = item.children?.some((child) => isRouteActive(child.to)) ?? false;
  return directActive || childActive;
};

const handleParentClick = (item: MenuItem) => {
  toggleExpanded(item.id);
  if (item.to) {
    router.push(item.to).catch(() => undefined);
  }
};

watch(
  () => route.path,
  (path) => {
    menuItems.value.forEach((item) => {
      if (!item.children) return;
      const shouldExpand = path.startsWith(item.to ?? '') || item.children.some((child) => path.startsWith(child.to));
      if (shouldExpand) {
        ensureExpanded(item.id);
      }
    });
  },
  { immediate: true }
);

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
