<template>
  <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <table class="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
      <thead class="bg-slate-50 dark:bg-slate-900/70">
        <tr>
          <th v-for="column in columns" :key="column" class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-slate-800">
        <tr v-if="loading">
          <td :colspan="columns.length" class="px-4 py-6 text-center text-sm text-slate-500">Memuat data...</td>
        </tr>
        <slot v-else />
        <tr v-if="!loading && empty">
          <td :colspan="columns.length" class="px-4 py-10 text-center text-sm text-slate-500">Belum ada data.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ columns: string[]; loading?: boolean; empty?: boolean }>();
</script>
