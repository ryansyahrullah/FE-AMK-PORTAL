<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-900/80 sm:px-6"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 lg:hidden"
        @click="$emit('toggle-sidebar')"
        aria-label="Buka navigasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        Portal AMK
      </div>
    </div>
    <div class="flex items-center gap-4">
      <ThemeToggle :compact="true" class="hidden lg:inline-flex" />
      <ThemeToggle :compact="true" class="lg:hidden" />
      <Button
        v-if="showSwitchButton"
        size="sm"
        variant="secondary"
        :loading="switchingRole"
        @click="openSwitchDialog"
      >
        {{ switchButtonLabel }}
      </Button>
      <div class="flex items-center gap-3 rounded-full border border-transparent bg-slate-100 px-3 py-1 dark:bg-slate-800">
        <div class="hidden text-right text-sm lg:block">
          <p class="font-semibold">{{ user?.nama ?? 'Administrator' }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ roleLabel }}</p>
        </div>
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white uppercase">
          {{ inisialUser }}
        </div>
      </div>
    </div>
  </header>
  <ConfirmPasswordDialog
    v-model="showSwitchConfirm"
    v-model:password="switchPassword"
    :title="switchDialogTitle"
    :message="switchDialogMessage"
    :loading="switchingRole"
    :error="switchError"
    confirm-label="Ganti Peran"
    confirm-variant="primary"
    @confirm="handleSwitchRole"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ThemeToggle from './ThemeToggle.vue';
import Button from './Button.vue';
import ConfirmPasswordDialog from './ConfirmPasswordDialog.vue';
import type { UserRole } from '../types';

const router = useRouter();
const auth = useAuthStore();
const user = computed(() => auth.state.user);

const roleLabelMap: Record<UserRole, string> = {
  admin_hcgs: 'Admin HCGS',
  pegawai: 'Pegawai',
  admin_finance: 'Admin Finance',
  officer_site: 'Officer Site'
};

const roleLabel = computed(() => {
  const role = user.value?.role;
  if (!role) return 'Pengguna';
  return roleLabelMap[role] ?? role;
});

const inisialUser = computed(() => {
  if (!user.value) return 'AD';
  return user.value.nama
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

const availableRoles = computed(() => auth.availableRoles.value);
const currentRole = computed(() => user.value?.role ?? null);

const targetRole = computed<UserRole | null>(() => {
  const current = currentRole.value;
  const roles = availableRoles.value;
  if (!current || roles.length < 2) return null;
  if (current !== 'pegawai' && roles.includes('pegawai')) {
    return 'pegawai';
  }
  if (current === 'pegawai') {
    const adminRole = roles.find((role) => role !== 'pegawai');
    return adminRole ?? null;
  }
  const alternative = roles.find((role) => role !== current);
  return alternative ?? null;
});

const showSwitchButton = computed(() => Boolean(targetRole.value));

const switchButtonLabel = computed(() => {
  const role = targetRole.value;
  if (!role) return '';
  return role === 'pegawai' ? 'Mode Pegawai' : `Mode ${roleLabelMap[role] ?? role}`;
});

const switchDialogTitle = computed(() => {
  const role = targetRole.value;
  if (!role) return 'Ganti Peran';
  const label = roleLabelMap[role] ?? role;
  return `Berpindah ke ${label}`;
});

const switchDialogMessage = computed(() => {
  const role = targetRole.value;
  if (!role) {
    return 'Masukkan kata sandi untuk melanjutkan.';
  }
  const label = roleLabelMap[role] ?? role;
  return `Masukkan kata sandi akun Anda untuk berpindah ke peran ${label}.`;
});

const showSwitchConfirm = ref(false);
const switchPassword = ref('');
const switchError = ref<string | null>(null);
const switchingRole = ref(false);

const openSwitchDialog = () => {
  switchPassword.value = '';
  switchError.value = null;
  showSwitchConfirm.value = true;
};

const handleSwitchRole = async () => {
  if (!targetRole.value) return;
  switchError.value = null;
  switchingRole.value = true;
  try {
    await auth.switchRole({ role: targetRole.value, password: switchPassword.value });
    showSwitchConfirm.value = false;
    router.replace(auth.getDefaultRoute());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengganti peran.';
    switchError.value = message;
  } finally {
    switchingRole.value = false;
  }
};

watch(
  () => showSwitchConfirm.value,
  (open) => {
    if (!open) {
      switchPassword.value = '';
      switchError.value = null;
    }
  }
);

</script>
