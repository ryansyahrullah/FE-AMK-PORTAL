<template>
  <div class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/70 lg:w-2/3">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.4 11.4z" />
      </svg>
      <input
        :value="search"
        type="search"
        class="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-100"
        placeholder="Cari NRP atau nama pegawai..."
        @input="onSearch"
      />
    </div>
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Tampilkan</label>
      <select
        :value="perPage"
        class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
        @change="onPerPageChange"
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">
          {{ option }} / halaman
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  search: string;
  perPage: number;
  perPageOptions?: number[];
}>();

const emit = defineEmits(['update:search', 'update:perPage']);

const perPageOptions = props.perPageOptions ?? [10, 20, 50];

const onSearch = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:search', target.value);
};

const onPerPageChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:perPage', Number(target.value));
};
</script>
