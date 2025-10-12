<template>
  <div :class="['relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1', styles.container]">
    <div v-if="styles.highlight" :class="styles.highlight"></div>
    <div class="relative flex items-start justify-between">
      <div>
        <p class="text-sm font-medium" :class="styles.title">{{ title }}</p>
        <h3 class="mt-3 text-3xl font-semibold tracking-tight">{{ value }}</h3>
        <p v-if="description" class="mt-2 text-sm" :class="styles.description">{{ description }}</p>
      </div>
      <div :class="['flex h-12 w-12 items-center justify-center rounded-2xl', styles.icon]">
        <slot name="icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </slot>
      </div>
    </div>
    <div v-if="$slots.footer" class="relative mt-6">
      <slot name="footer" />
    </div>
    <div v-if="trendValue" class="relative mt-6 flex items-center gap-2 text-sm">
      <span :class="['inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold', styles.trendBadge]">
        <svg
          v-if="trendPositive"
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l6-6 4.5 4.5L19.5 9" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-6 6-4.5-4.5L4.5 15" />
        </svg>
        {{ trendValue }}
      </span>
      <span class="text-xs" :class="styles.trendText">{{ trendLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'indigo' | 'rose' | 'emerald' | 'neutral';

const props = withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    description?: string;
    variant?: Variant;
    trendLabel?: string;
    trendValue?: string;
    trendPositive?: boolean;
  }>(),
  {
    variant: 'neutral',
    trendPositive: true
  }
);

const variantMap: Record<Variant, Record<string, string>> = {
  primary: {
    container: 'bg-gradient-to-br from-primary via-primary-soft to-primary-dark text-white shadow-glow',
    icon: 'bg-white/20 text-white',
    title: 'text-white/70',
    description: 'text-white/70',
    trendBadge: 'bg-white/20 text-white',
    trendText: 'text-white/70',
    highlight: 'pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl'
  },
  indigo: {
    container: 'bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600 text-white shadow-glow',
    icon: 'bg-white/15 text-white',
    title: 'text-white/70',
    description: 'text-white/70',
    trendBadge: 'bg-white/15 text-white',
    trendText: 'text-white/70',
    highlight: 'pointer-events-none absolute -bottom-8 right-6 h-28 w-28 rounded-full bg-white/10 blur-3xl'
  },
  rose: {
    container: 'bg-gradient-to-br from-rose-500 via-rose-400 to-rose-600 text-white shadow-glow',
    icon: 'bg-white/15 text-white',
    title: 'text-white/70',
    description: 'text-white/70',
    trendBadge: 'bg-white/15 text-white',
    trendText: 'text-white/70',
    highlight: 'pointer-events-none absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl'
  },
  emerald: {
    container: 'bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-600 text-white shadow-glow',
    icon: 'bg-white/15 text-white',
    title: 'text-white/70',
    description: 'text-white/70',
    trendBadge: 'bg-white/15 text-white',
    trendText: 'text-white/70',
    highlight: 'pointer-events-none absolute right-0 top-12 h-28 w-28 rounded-full bg-white/10 blur-3xl'
  },
  neutral: {
    container: 'border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900',
    icon: 'bg-primary/10 text-primary',
    title: 'text-slate-500 dark:text-slate-400',
    description: 'text-slate-500 dark:text-slate-400',
    trendBadge: 'bg-primary/10 text-primary',
    trendText: 'text-slate-500 dark:text-slate-400',
    highlight: ''
  }
};

const styles = computed(() => variantMap[props.variant]);

const trendValue = computed(() => props.trendValue);
const trendPositive = computed(() => props.trendPositive);
const trendLabel = computed(() => props.trendLabel ?? 'dibanding periode lalu');
</script>
