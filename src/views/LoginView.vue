<template>
  <div class="flex min-h-screen flex-col items-center justify-center px-4 py-10">
    <div class="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white/80 p-10 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-slate-900 dark:text-white">Masuk Admin</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-300">Gunakan akun demo admin untuk mencoba portal.</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900/70">
        <p class="text-slate-500 dark:text-slate-300">NRP / Email: <span class="font-medium text-slate-800 dark:text-slate-100">admin@gmail.com</span></p>
        <p class="text-slate-500 dark:text-slate-300">Kata sandi: <span class="font-medium text-slate-800 dark:text-slate-100">admin123</span></p>
      </div>
      <form class="space-y-5" @submit.prevent="handleSubmit">
        <InputText v-model="form.nrp" id="nrp" label="NRP / Email" placeholder="Masukkan admin@gmail.com" :error="errors.nrp" autocomplete="username" />
        <InputText v-model="form.password" id="password" label="Kata Sandi" type="password" placeholder="Masukkan kata sandi" :error="errors.password" autocomplete="current-password" />
        <Button type="submit" class="w-full justify-center" :loading="auth.state.loading">Masuk</Button>
        <p v-if="auth.state.error" class="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">{{ auth.state.error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Button from '../components/Button.vue';
import InputText from '../components/InputText.vue';
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
  errors.password = !form.password ? 'Kata sandi wajib diisi.' : form.password.length < 3 ? 'Kata sandi minimal 3 karakter.' : null;
  return !errors.nrp && !errors.password;
};

const handleSubmit = async () => {
  if (!validate()) return;
  try {
    await auth.login({ ...form });
    const redirect = (route.query.redirect as string) || '/dashboard';
    router.replace(redirect);
  } catch (error) {
    // ditangani oleh store
  }
};

if (auth.isAuthenticated) {
  router.replace('/dashboard');
}
</script>
