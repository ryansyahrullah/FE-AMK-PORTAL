<template>
  <label class="block text-sm font-medium text-slate-700 dark:text-slate-200">
    <span>{{ label }}</span>
    <div class="mt-1">
      <input
        :id="id"
        :name="name"
        type="date"
        :value="modelValue ?? ''"
        :disabled="disabled"
        class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 disabled:dark:bg-slate-800/60"
        @input="onInput"
      />
    </div>
    <p v-if="hint && !error" class="mt-1 text-xs text-slate-500">{{ hint }}</p>
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  modelValue: string | null;
  id?: string;
  name?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(['update:modelValue']);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>
