<template>
  <div class="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row">
    <div>
      Menampilkan halaman {{ currentPage }} dari {{ totalPages }} ({{ totalItems }} data)
    </div>
    <div class="flex items-center gap-2">
      <Button :disabled="currentPage === 1" variant="ghost" @click="$emit('change', currentPage - 1)">
        Sebelumnya
      </Button>
      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          class="h-9 w-9 rounded-full border text-sm font-semibold transition"
          :class="[
            page === currentPage
              ? 'border-transparent bg-primary text-white shadow'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          ]"
          @click="$emit('change', page)"
        >
          {{ page }}
        </button>
      </div>
      <Button :disabled="currentPage === totalPages" variant="ghost" @click="$emit('change', currentPage + 1)">
        Selanjutnya
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
  currentPage: number;
  totalPages: number;
  totalItems: number;
}>();

defineEmits(['change']);

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(props.totalPages, props.currentPage + 2);
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }
  if (!pages.includes(1)) pages.unshift(1);
  if (!pages.includes(props.totalPages)) pages.push(props.totalPages);
  return Array.from(new Set(pages)).filter((page) => page >= 1 && page <= props.totalPages);
});
</script>
