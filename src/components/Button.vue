<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    :class="[buttonClasses, sizeClasses]"
    :disabled="disabled || loading"
  >
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"></path>
    </svg>
    <span><slot /></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    size?: 'sm' | 'md';
  }>(),
  {
    type: 'button',
    variant: 'primary',
    loading: false,
    disabled: false,
    size: 'md'
  }
);

const buttonClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700';
    case 'ghost':
      return 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400';
    default:
      return 'bg-primary text-white hover:bg-primary-dark';
  }
});

const sizeClasses = computed(() => (props.size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2'));

const type = props.type;
const disabled = props.disabled;
const loading = props.loading;
</script>
