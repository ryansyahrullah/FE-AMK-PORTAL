<template>
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
    <span>{{ label }}</span>
    <div class="mt-1">
      <select
        :id="id"
        :name="name"
        :value="modelValue ?? ''"
        :disabled="disabled"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 disabled:dark:bg-slate-800/60"
        @change="onChange"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    <p v-if="hint && !error" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  label: string;
  modelValue: string | number | null | undefined;
  options: Option[];
  id?: string;
  name?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>
