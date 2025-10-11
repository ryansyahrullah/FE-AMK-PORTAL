<template>
  <div class="flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Sidebar
      :collapsed="isSidebarCollapsed"
      :mobile-open="isSidebarOpenMobile"
      @close-mobile="isSidebarOpenMobile = false"
      @toggle-collapse="toggleSidebar"
    />

    <div class="flex flex-1 flex-col overflow-hidden">
      <Navbar
        :sidebar-collapsed="isSidebarCollapsed"
        @toggle-sidebar="handleToggleSidebar"
      />
      <main class="flex-1 overflow-y-auto bg-slate-100 px-4 py-6 dark:bg-slate-900 sm:px-6 lg:px-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

const isSidebarCollapsed = ref(false);
const isSidebarOpenMobile = ref(false);

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
</script>
