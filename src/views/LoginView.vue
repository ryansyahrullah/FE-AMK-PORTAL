<template>
  <div class="relative flex min-h-screen flex-col justify-center overflow-hidden lg:flex-row">
    <div class="absolute inset-0 -z-10">
      <div class="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-[180px]"></div>
      <div class="absolute bottom-[-15%] right-[-10%] h-[32rem] w-[32rem] rounded-full bg-accent/30 blur-[200px]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]"></div>
    </div>
    <section class="hidden flex-1 flex-col justify-between p-10 text-white lg:flex">
      <div class="glass-card relative h-full overflow-hidden bg-white/5 px-10 py-12 backdrop-blur-2xl">
        <div class="pointer-events-none absolute -top-20 right-10 h-64 w-64 rounded-full bg-primary/40 blur-3xl"></div>
        <div class="pointer-events-none absolute bottom-[-4rem] left-[-4rem] h-64 w-64 rounded-full bg-indigo-500/40 blur-3xl"></div>
        <div class="relative flex h-full flex-col justify-between">
          <header>
            <p class="text-sm uppercase tracking-[0.35em] text-white/60">AMK Portal</p>
            <h1 class="mt-4 text-4xl font-semibold leading-tight">
              Kelola pegawai dengan dashboard modern dan responsif.
            </h1>
            <p class="mt-4 max-w-lg text-base text-white/70">
              Monitor statistik penting, riwayat aktivitas, hingga pegawai yang akan habis kontrak dalam satu tampilan elegan.
            </p>
          </header>
          <div class="mt-16 grid gap-6 md:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p class="text-sm font-semibold uppercase tracking-wide text-white/80">Pemantauan Real-time</p>
              <p class="mt-2 text-sm text-white/70">Data pegawai tersinkron otomatis dari mock API sehingga seluruh kartu statistik selalu mutakhir.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p class="text-sm font-semibold uppercase tracking-wide text-white/80">CRUD Lengkap</p>
              <p class="mt-2 text-sm text-white/70">Tambah, ubah, lihat, dan hapus pegawai dengan formulir validasi cerdas serta umpan balik instan.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p class="text-sm font-semibold uppercase tracking-wide text-white/80">Mode Gelap</p>
              <p class="mt-2 text-sm text-white/70">Tampilan nyaman dengan dukungan dark mode dan gaya tipografi modern.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/10 p-5">
              <p class="text-sm font-semibold uppercase tracking-wide text-white/80">Akses Demo</p>
              <p class="mt-2 text-sm text-white/70">Langsung gunakan akun admin demo untuk mengeksplorasi seluruh fitur tanpa konfigurasi backend.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="relative flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-[30rem] lg:px-12">
      <div class="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-10 shadow-2xl backdrop-blur-xl">
        <div class="mb-8">
          <h2 class="text-3xl font-semibold text-white">Masuk ke Portal Admin</h2>
          <p class="mt-2 text-sm text-slate-300">Gunakan email admin demo di bawah untuk mencoba pengalaman lengkap.</p>
          <div class="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-100">
            <div class="flex items-center justify-between">
              <span class="text-slate-300">Email Admin</span>
              <span class="font-medium">admin@gmail.com</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-300">Kata Sandi</span>
              <span class="font-medium">admin123</span>
            </div>
          </div>
        </div>
        <form class="space-y-5" @submit.prevent="onSubmit">
          <div>
            <label for="nrp" class="block text-sm font-medium text-slate-200">Email Admin / NRP</label>
            <input
              id="nrp"
              v-model="form.nrp"
              type="text"
              autocomplete="username"
              placeholder="Masukkan admin@gmail.com"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <p v-if="errors.nrp" class="mt-1 text-xs text-rose-300">{{ errors.nrp }}</p>
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-200">Kata Sandi</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              placeholder="Masukkan kata sandi"
              class="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-rose-300">{{ errors.password }}</p>
          </div>
          <Button type="submit" class="w-full justify-center" :loading="auth.state.loading">
            Masuk Sekarang
          </Button>
          <p v-if="auth.state.error" class="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-200">
            {{ auth.state.error }}
          </p>
        </form>
      </div>
    </section>
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
    // error ditangani di store
  }
};

if (auth.isAuthenticated) {
  router.replace('/dashboard');
}
</script>
