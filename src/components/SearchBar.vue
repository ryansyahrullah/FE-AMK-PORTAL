<template>
  <div class="flex flex-wrap items-center gap-3">
    <div class="relative flex-1 min-w-[200px]">
      <input
        v-model="keyword"
        type="text"
        :placeholder="placeholder"
        class="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        @keyup.enter="emitSearch"
      />
      <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z" />
      </svg>
    </div>
    <div>
      <label class="mr-2 text-sm text-slate-600 dark:text-slate-300">Per halaman</label>
      <select
        v-model.number="perPage"
        class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        @change="$emit('update:perPage', perPage)"
      >
        <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
    <Button variant="secondary" @click="emitSearch">Cari</Button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import Button from './Button.vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    perPage?: number;
    placeholder?: string;
  }>(),
  {
    modelValue: '',
    perPage: 10,
    placeholder: 'Cari NRP atau nama pegawai'
  }
);

const emit = defineEmits<{ (e: 'search', value: string): void; (e: 'update:modelValue', value: string): void; (e: 'update:perPage', value: number): void }>();

const keyword = ref(props.modelValue);
const perPage = ref(props.perPage);
const perPageOptions = [10, 20, 50];

watch(
  () => props.modelValue,
  (value) => {
    keyword.value = value;
  }
);

const emitSearch = () => {
  emit('update:modelValue', keyword.value);
  emit('search', keyword.value);
};
</script>
