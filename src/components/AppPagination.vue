<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2 text-sm text-slate-500">
      <span>Halaman {{ currentPage }} dari {{ totalPage }}</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
        :disabled="currentPage <= 1"
        @click="$emit('change', currentPage - 1)"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900"
        :disabled="currentPage >= totalPage"
        @click="$emit('change', currentPage + 1)"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ currentPage?: number; totalPage?: number }>(),
  {
    currentPage: 1,
    totalPage: 1
  }
);

defineEmits<{ (e: 'change', value: number): void }>();
</script>
