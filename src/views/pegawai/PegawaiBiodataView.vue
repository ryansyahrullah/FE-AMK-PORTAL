<template>
  <div class="mx-auto max-w-4xl space-y-8">
    <header class="space-y-2">
      <h1 class="text-3xl font-semibold text-slate-900 dark:text-slate-100">Biodata Pegawai</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400">
        Perbarui informasi pribadi Anda. Beberapa kolom seperti NRP dan detail kontrak dikunci oleh tim HR.
      </p>
    </header>

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="space-y-4">
        <div v-for="index in 6" :key="`form-skeleton-${index}`" class="h-12 animate-pulse rounded-2xl bg-slate-200/60 dark:bg-slate-800/60"></div>
      </div>
      <form v-else class="space-y-8" @submit.prevent="onSubmit">
        <section class="grid gap-6 sm:grid-cols-2">
          <InputText
            id="nrp"
            v-model="form.nrp"
            label="NRP"
            :disabled="true"
            hint="Tidak dapat diubah"
          />
          <InputText
            id="jabatan"
            v-model="form.jabatan"
            label="Jabatan"
            :disabled="true"
            hint="Hubungi HR untuk perubahan jabatan"
          />
          <InputText
            id="nama"
            v-model="form.nama_lengkap"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            :error="errors.nama_lengkap"
          />
          <InputText
            id="tempat-lahir"
            v-model="form.tempat_lahir"
            label="Tempat Lahir"
            placeholder="Masukkan tempat lahir"
            :error="errors.tempat_lahir"
          />
          <InputDate
            id="tanggal-lahir"
            v-model="form.tanggal_lahir"
            label="Tanggal Lahir"
            :error="errors.tanggal_lahir"
          />
          <InputText
            id="no-hp"
            v-model="form.no_hp"
            label="No. HP"
            placeholder="Masukkan nomor telepon"
            :error="errors.no_hp"
          />
          <InputText
            id="email"
            v-model="form.email"
            label="Email"
            placeholder="contoh@amk.co.id"
            :error="errors.email"
          />
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Status Kepegawaian</label>
            <div class="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {{ form.status_kepegawaian }}
            </div>
          </div>
          <InputText
            id="tanggal-masuk"
            v-model="form.tanggal_masuk"
            label="Tanggal Masuk"
            :disabled="true"
          />
        </section>

        <section class="space-y-3">
          <label for="alamat" class="block text-sm font-medium text-slate-700 dark:text-slate-200">Alamat KTP</label>
          <textarea
            id="alamat"
            v-model="form.alamat_ktp"
            rows="4"
            class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            placeholder="Tulis alamat sesuai KTP"
          ></textarea>
          <p v-if="errors.alamat_ktp" class="text-xs text-rose-500 dark:text-rose-300">{{ errors.alamat_ktp }}</p>
        </section>

        <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center">
          <RouterLink
            :to="{ name: 'pegawai-dashboard' }"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary dark:text-slate-400 dark:hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Kembali ke dashboard
          </RouterLink>
          <div class="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" class="justify-center sm:px-6" @click="resetForm" :disabled="saving">
              Atur Ulang
            </Button>
            <Button type="submit" class="justify-center sm:px-6" :loading="saving">
              Simpan Perubahan
            </Button>
          </div>
        </div>
      </form>
    </div>

    <Toast :show="toast.show" :type="toast.type" :message="toast.message" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import Button from '../../components/Button.vue';
import InputDate from '../../components/InputDate.vue';
import InputText from '../../components/InputText.vue';
import Toast from '../../components/Toast.vue';
import http from '../../api/http';
import type { Pegawai } from '../../types';

const loading = ref(true);
const saving = ref(false);
const initialData = ref<Pegawai | null>(null);

const form = reactive({
  nrp: '',
  nama_lengkap: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat_ktp: '',
  tanggal_masuk: '',
  status_kepegawaian: '',
  jabatan: '',
  no_hp: '',
  email: ''
});

const errors = reactive<Record<string, string | null>>({
  nama_lengkap: null,
  tempat_lahir: null,
  tanggal_lahir: null,
  alamat_ktp: null,
  no_hp: null,
  email: null
});

const toast = reactive({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
});

const fetchData = async () => {
  loading.value = true;
  try {
    const { data } = await http.get<Pegawai>('/api/pegawai/me');
    initialData.value = data;
    assignForm(data);
  } catch (error) {
    showToast('Gagal memuat biodata pegawai.', 'error');
  } finally {
    loading.value = false;
  }
};

const assignForm = (data: Pegawai) => {
  form.nrp = data.nrp;
  form.nama_lengkap = data.nama_lengkap;
  form.tempat_lahir = data.tempat_lahir;
  form.tanggal_lahir = data.tanggal_lahir;
  form.alamat_ktp = data.alamat_ktp;
  form.tanggal_masuk = data.tanggal_masuk;
  form.status_kepegawaian = data.status_kepegawaian;
  form.jabatan = data.jabatan;
  form.no_hp = data.no_hp;
  form.email = data.email ?? '';
};

const validate = () => {
  errors.nama_lengkap = form.nama_lengkap ? null : 'Nama wajib diisi.';
  errors.tempat_lahir = form.tempat_lahir ? null : 'Tempat lahir wajib diisi.';
  errors.tanggal_lahir = form.tanggal_lahir ? null : 'Tanggal lahir wajib diisi.';
  errors.alamat_ktp = form.alamat_ktp ? null : 'Alamat wajib diisi.';
  errors.no_hp = form.no_hp ? null : 'Nomor HP wajib diisi.';
  errors.email = form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Format email tidak valid.' : null;
  return !errors.nama_lengkap && !errors.tempat_lahir && !errors.tanggal_lahir && !errors.alamat_ktp && !errors.no_hp && !errors.email;
};

const onSubmit = async () => {
  if (!validate()) {
    showToast('Periksa kembali input yang belum valid.', 'error');
    return;
  }

  saving.value = true;
  try {
    await http.put('/api/pegawai/me', {
      nama_lengkap: form.nama_lengkap,
      tempat_lahir: form.tempat_lahir,
      tanggal_lahir: form.tanggal_lahir,
      alamat_ktp: form.alamat_ktp,
      no_hp: form.no_hp,
      email: form.email || null
    });
    showToast('Biodata berhasil diperbarui.', 'success');
    if (initialData.value) {
      initialData.value = {
        ...initialData.value,
        nama_lengkap: form.nama_lengkap,
        tempat_lahir: form.tempat_lahir,
        tanggal_lahir: form.tanggal_lahir,
        alamat_ktp: form.alamat_ktp,
        no_hp: form.no_hp,
        email: form.email || null
      } as Pegawai;
      assignForm(initialData.value);
    }
  } catch (error: any) {
    const message = error.response?.data?.message ?? 'Terjadi kesalahan saat menyimpan biodata.';
    showToast(message, 'error');
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  if (initialData.value) {
    assignForm(initialData.value);
  }
  showToast('Data dikembalikan seperti semula.', 'info');
};

const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
};

fetchData();
</script>
