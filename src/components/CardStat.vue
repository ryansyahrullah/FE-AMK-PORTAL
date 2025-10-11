<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">{{ title }}</p>
        <h3 class="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ value }}</h3>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </slot>
      </div>
    </div>
    <p v-if="description" class="mt-3 text-sm text-slate-500 dark:text-slate-400">{{ description }}</p>
    <div v-if="$slots.footer" class="mt-4">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  description?: string;
}>();
</script>
