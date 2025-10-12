<template>
  <transition-group name="toast" tag="div" class="fixed right-4 top-4 z-50 space-y-3">
    <div
      v-for="item in items"
      :key="item.id"
      class="flex min-w-[240px] items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900"
    >
      <div class="mt-0.5 h-2 w-2 rounded-full" :class="item.variant === 'error' ? 'bg-rose-500' : 'bg-primary'"></div>
      <div class="flex-1 text-sm text-slate-700 dark:text-slate-200">
        <p class="font-medium">{{ item.title }}</p>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ item.message }}</p>
      </div>
      <button type="button" class="text-slate-400 hover:text-slate-600" @click="remove(item.id)">✕</button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

type ToastVariant = 'success' | 'error';

interface ToastItem {
  id: number;
  title: string;
  message: string;
  variant: ToastVariant;
  timeout?: number;
}

const items = ref<ToastItem[]>([]);
let seed = 0;

const remove = (id: number) => {
  items.value = items.value.filter((item) => item.id !== id);
};

const show = (payload: Omit<ToastItem, 'id'>) => {
  const id = ++seed;
  items.value.push({ id, ...payload });
  if (payload.timeout) {
    window.setTimeout(() => remove(id), payload.timeout);
  }
};

defineExpose({
  show
});

onUnmounted(() => {
  items.value = [];
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
