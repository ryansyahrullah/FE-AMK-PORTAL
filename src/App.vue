<template>
  <div v-if="isGuestLayout" class="relative min-h-screen bg-slate-950 text-slate-100">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-24 top-32 h-96 w-96 rounded-full bg-primary/40 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/30 blur-3xl"></div>
    </div>
    <div class="relative z-10">
      <RouterView />
    </div>
  </div>
  <div
    v-else
    class="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
  >
    <Sidebar
      :collapsed="isSidebarCollapsed"
      :mobile-open="isSidebarOpenMobile"
      @close-mobile="isSidebarOpenMobile = false"
      @toggle-collapse="toggleSidebar"
    />

    <div class="relative flex flex-1 flex-col overflow-hidden">
      <div class="pointer-events-none absolute inset-x-0 top-0 hidden h-48 bg-gradient-to-b from-primary/10 via-transparent to-transparent lg:block"></div>
      <Navbar :sidebar-collapsed="isSidebarCollapsed" @toggle-sidebar="handleToggleSidebar" />
      <main class="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10">
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

const route = useRoute();

const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);

const isGuestLayout = computed(() => route.meta.layout === 'guest');

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleToggleSidebar = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpenMobile.value = !isSidebarOpenMobile.value;
  } else {
    toggleSidebar();
  }
};

watch(
  () => route.fullPath,
  () => {
    isSidebarOpenMobile.value = false;
  }
);
</script>
