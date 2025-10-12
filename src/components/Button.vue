<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      variantClasses,
      disabled || loading ? 'cursor-not-allowed opacity-70' : 'hover:brightness-110',
      block ? 'w-full' : ''
    ]"
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    block: false,
    disabled: false,
    loading: false
  }
);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-white text-slate-700 border-slate-200 focus:ring-primary';
    case 'danger':
      return 'bg-rose-500 text-white focus:ring-rose-500';
    case 'ghost':
      return 'bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400';
    default:
      return 'bg-primary text-white focus:ring-primary';
  }
});
</script>
