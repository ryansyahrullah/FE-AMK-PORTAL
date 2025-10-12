<template>
  <div class="relative flex min-h-screen items-center justify-center px-6 py-12">
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute left-1/2 top-[-20%] h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"></div>
      <div class="absolute bottom-[-25%] right-[-10%] h-80 w-80 rounded-full bg-blue-200/40 blur-[180px]"></div>
    </div>
    <div class="absolute top-8 right-8 z-20">
      <ThemeToggle />
    </div>
    <div class="relative z-10 grid w-full max-w-5xl gap-10 lg:grid-cols-[1.05fr,1fr]">
      <section class="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-10 text-white shadow-glow">
        <div class="flex h-full flex-col justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.4em] text-white/70">AMK Portal</p>
            <h1 class="mt-6 text-4xl font-semibold leading-snug">Kelola pegawai dengan tenang dan teratur.</h1>
            <p class="mt-4 max-w-sm text-base text-white/80">
              Masuk untuk memantau dashboard, melihat aktivitas terbaru, dan mengelola data pegawai dengan antarmuka yang bersih.
            </p>
          </div>
          <div class="mt-12 grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-sm font-semibold text-white">Status Sistem</p>
              <p class="mt-2 text-sm text-white/70">Seluruh layanan berjalan normal.</p>
            </div>
            <div class="rounded-2xl bg-white/10 p-4">
              <p class="text-sm font-semibold text-white">Akun Demo</p>
              <p class="mt-2 text-sm text-white/70">Gunakan kredensial di samping untuk mencoba sistem.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="rounded-3xl border border-slate-200/60 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/80">
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Masuk Admin</h2>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Silakan masuk untuk membuka dashboard.</p>
          <div class="mt-6 space-y-2 rounded-2xl border border-blue-100 bg-blue-50/80 p-4 text-sm text-slate-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-slate-200">
            <div class="flex items-center justify-between">
              <span>Email</span>
              <span class="font-medium">admin@gmail.com</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Kata Sandi</span>
              <span class="font-medium">admin123</span>
            </div>
          </div>
        </div>
        <form class="space-y-5" @submit.prevent="onSubmit">
          <div>
            <label for="nrp" class="block text-sm font-medium text-slate-700 dark:text-slate-200">Email Admin / NRP</label>
            <input
              id="nrp"
              v-model="form.nrp"
              type="text"
              autocomplete="username"
              placeholder="Masukkan admin@gmail.com"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            />
            <p v-if="errors.nrp" class="mt-1 text-xs text-rose-500 dark:text-rose-300">{{ errors.nrp }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-200">Kata Sandi</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan kata sandi"
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-rose-500 dark:text-rose-300">{{ errors.password }}</p>
          </div>
          <Button type="submit" class="w-full justify-center" :loading="auth.state.loading">
            Masuk Sekarang
          </Button>
          <p
            v-if="auth.state.error"
            class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-500 dark:text-rose-200"
          >
            {{ auth.state.error }}
          </p>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import ThemeToggle from '../components/ThemeToggle.vue';
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
  errors.nrp = !form.nrp
    ? 'Email atau NRP wajib diisi.'
    : form.nrp.length < 3
      ? 'Email atau NRP minimal 3 karakter.'
      : null;
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
    // pesan ditangani di store
  }
};

if (auth.isAuthenticated.value) {
  router.replace('/dashboard');
}
</script>
