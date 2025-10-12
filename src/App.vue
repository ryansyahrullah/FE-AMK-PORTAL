<template>
  <div
    v-if="isGuestLayout"
    class="relative min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -left-32 top-24 h-72 w-72 rounded-full bg-primary/20 blur-[140px]"></div>
      <div class="absolute bottom-[-10%] right-[-15%] h-[28rem] w-[28rem] rounded-full bg-blue-300/30 blur-[160px]"></div>
    </div>
    <div class="relative z-10">
      <RouterView />
    </div>
  </div>
  <div
    v-else
    class="relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
  >
    <Sidebar
      :collapsed="isSidebarCollapsed"
      :mobile-open="isSidebarOpenMobile"
      @close-mobile="isSidebarOpenMobile = false"
      @toggle-collapse="toggleSidebar"
    />
    <div :class="['relative min-h-screen transition-[padding] duration-200 ease-out', contentOffsetClass]">
      <div class="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_60%)] lg:block"></div>
      <div class="relative z-10 flex min-h-screen flex-col">
        <Navbar @toggle-sidebar="handleToggleSidebar" />
        <main class="flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6 lg:px-10">
          <RouterView />
        </main>
      </div>
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
const contentOffsetClass = computed(() => (isSidebarCollapsed.value ? 'lg:pl-24' : 'lg:pl-72'));

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
