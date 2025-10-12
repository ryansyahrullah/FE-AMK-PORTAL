<template>
  <transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <Button variant="ghost" @click="$emit('update:modelValue', false)">Batal</Button>
          <Button :loading="loading" :variant="confirmVariant" @click="$emit('confirm')">
            {{ confirmLabel }}
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import Button from './Button.vue';

withDefaults(
  defineProps<{
    modelValue: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
  }>(),
  {
    confirmLabel: 'Ya',
    confirmVariant: 'danger',
    loading: false
  }
);

defineEmits(['update:modelValue', 'confirm']);
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
