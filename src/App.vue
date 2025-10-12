<template>
  <div v-if="isGuestLayout" class="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50">
    <RouterView />
  </div>
  <div v-else class="flex min-h-screen bg-slate-100 dark:bg-slate-950">
    <Sidebar :collapsed="isSidebarCollapsed" :mobile-open="isSidebarOpenMobile" @close-mobile="isSidebarOpenMobile = false" />
    <div :class="['flex flex-1 flex-col', isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64']">
      <Navbar @toggle-sidebar="handleToggleSidebar" />
      <main class="flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6 lg:px-10">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const auth = useAuthStore();

const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);

const isGuestLayout = computed(() => {
  if (route.meta.layout === 'guest') return true;
  if (route.meta.layout === 'app') return false;
  return !auth.isAuthenticated;
});

const handleToggleSidebar = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpenMobile.value = !isSidebarOpenMobile.value;
  } else {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
};

watch(
  () => route.fullPath,
  () => {
    isSidebarOpenMobile.value = false;
  }
);
</script>
