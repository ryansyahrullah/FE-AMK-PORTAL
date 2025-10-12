<template>
  <transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ message }}</p>
        <div class="mt-4">
          <label for="confirm-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Kata sandi akun
          </label>
          <input
            id="confirm-password"
            :value="password"
            type="password"
            autocomplete="current-password"
            placeholder="Masukkan kata sandi untuk mengonfirmasi"
            class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            @input="onInput"
          />
          <p v-if="error" class="mt-1 text-xs text-rose-500">{{ error }}</p>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <Button variant="ghost" @click="$emit('update:modelValue', false)">
            Batal
          </Button>
          <Button
            variant="danger"
            :loading="loading"
            :disabled="password.trim().length === 0"
            @click="$emit('confirm')"
          >
            Konfirmasi
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import Button from './Button.vue';

defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  password: string;
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits(['update:modelValue', 'update:password', 'confirm']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:password', target.value);
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
