<template>
  <div class="flex min-h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-12">
    <div class="w-full max-w-md rounded-3xl border border-slate-700/50 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
      <div class="mb-6 text-center">
        <h1 class="text-3xl font-bold text-white">Masuk Portal Admin</h1>
        <p class="mt-2 text-sm text-slate-300">
          Gunakan NRP dan kata sandi yang telah diberikan untuk mengakses dashboard.
        </p>
      </div>
      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label for="nrp" class="block text-sm font-medium text-slate-200">NRP</label>
          <input
            id="nrp"
            v-model="form.nrp"
            type="text"
            autocomplete="username"
            placeholder="Masukkan NRP"
            class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p v-if="errors.nrp" class="mt-1 text-xs text-red-400">{{ errors.nrp }}</p>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-slate-200">Kata Sandi</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            placeholder="Masukkan kata sandi"
            class="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-400">{{ errors.password }}</p>
        </div>
        <Button type="submit" class="w-full justify-center" :loading="auth.state.value.loading">
          Masuk Sekarang
        </Button>
        <p v-if="auth.state.value.error" class="text-center text-sm text-red-300">
          {{ auth.state.value.error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from '../components/Button.vue';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const form = reactive({
  nrp: '',
  password: ''
});

const errors = reactive<{ nrp: string | null; password: string | null }>({
  nrp: null,
  password: null
});

const validate = () => {
  errors.nrp = !form.nrp ? 'NRP wajib diisi.' : form.nrp.length < 3 ? 'NRP minimal 3 karakter.' : null;
  errors.password = !form.password
    ? 'Kata sandi wajib diisi.'
    : form.password.length < 3
      ? 'Kata sandi minimal 3 karakter.'
      : null;
  return !errors.nrp && !errors.password;
};

const onSubmit = async () => {
  if (!validate()) return;
  try {
    await auth.login({ ...form });
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.replace(redirect);
  } catch (error) {
    // error sudah ditangani di store
  }
};

if (auth.isAuthenticated) {
  router.replace('/dashboard');
}
</script>
