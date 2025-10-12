<template>
  <transition name="slide-fade">
    <div
      v-if="show"
      class="fixed right-6 top-6 z-50 flex max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      :class="toastClasses"
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-opacity-20" :class="iconWrapperClass">
        <slot name="icon">
          <svg v-if="type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <svg v-else-if="type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 6a9 9 0 100 18 9 9 0 000-18z" />
          </svg>
        </slot>
      </div>
      <div>
        <p class="text-sm font-semibold">{{ titleText }}</p>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
      </div>
      <button type="button" class="ml-auto text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300" @click="$emit('close')">
        <span class="sr-only">Tutup</span>
        ✕
      </button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    show: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
  }>(),
  {
    type: 'info',
    duration: 3000
  }
);

const emit = defineEmits(['close']);

watch(
  () => props.show,
  (value) => {
    if (value && props.duration > 0) {
      setTimeout(() => emit('close'), props.duration);
    }
  }
);

const toastClasses = computed(() => {
  switch (props.type) {
    case 'success':
      return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'error':
      return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-300';
    default:
      return 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';
  }
});

const iconWrapperClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500 text-green-500';
    case 'error':
      return 'bg-red-500 text-red-500';
    default:
      return 'bg-primary text-primary';
  }
});

const titleText = computed(() => {
  switch (props.type) {
    case 'success':
      return 'Berhasil';
    case 'error':
      return 'Gagal';
    default:
      return 'Informasi';
  }
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
