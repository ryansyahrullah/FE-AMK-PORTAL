<template>
  <div>
    <label v-if="label" :for="id" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
      {{ label }}
    </label>
    <input
      :id="id"
      type="date"
      v-bind="$attrs"
      v-model="modelValue"
      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    />
    <p v-if="error" class="mt-1 text-xs text-rose-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<string | null>({ default: '' });

defineProps<{
  id?: string;
  label?: string;
  error?: string | null;
}>();
</script>
