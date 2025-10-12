<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ label }}</p>
        <p class="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{{ value }}</p>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <slot name="icon"></slot>
      </div>
    </div>
    <p v-if="description" class="mt-3 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number; description?: string }>();
</script>
