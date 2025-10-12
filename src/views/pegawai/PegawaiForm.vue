<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Lengkapi informasi pegawai sesuai data resmi perusahaan.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" @click="kembali">Batal</Button>
        <Button :loading="loadingSubmit" @click="submitForm">Simpan</Button>
      </div>
    </div>

    <form class="space-y-6" @submit.prevent="submitForm">
      <div class="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-2">
        <InputText v-model="form.nrp" label="NRP" placeholder="Masukkan NRP" :error="errors.nrp" />
        <InputText v-model="form.nama_lengkap" label="Nama Lengkap" placeholder="Masukkan nama lengkap" :error="errors.nama_lengkap" />
        <InputText v-model="form.jabatan" label="Jabatan" placeholder="Masukkan jabatan" :error="errors.jabatan" />
        <InputText v-model="form.tempat_lahir" label="Tempat Lahir" placeholder="Contoh: Surabaya" :error="errors.tempat_lahir" />
        <InputDate v-model="form.tanggal_lahir" label="Tanggal Lahir" :error="errors.tanggal_lahir" />
        <InputDate v-model="form.tanggal_masuk" label="Tanggal Masuk" :error="errors.tanggal_masuk" />
        <InputSelect
          v-model="form.status_kepegawaian"
          label="Status Kepegawaian"
          :options="statusOptions"
          :error="errors.status_kepegawaian"
        />
        <InputDate
          v-model="form.akhir_kontrak"
          label="Akhir Kontrak"
          :error="errors.akhir_kontrak"
          :hint="form.status_kepegawaian === 'Kontrak' ? 'Wajib diisi untuk pegawai kontrak.' : 'Tidak wajib untuk pegawai permanen.'"
          :disabled="form.status_kepegawaian === 'Permanen'"
        />
        <InputText v-model="form.alamat_ktp" label="Alamat KTP" placeholder="Masukkan alamat sesuai KTP" :error="errors.alamat_ktp" class="md:col-span-2" />
        <InputText v-model="form.no_hp" label="No. Handphone" placeholder="0812xxxxxxx" :error="errors.no_hp" />
        <InputText v-model="form.email" label="Email" placeholder="contoh@perusahaan.com" :error="errors.email" />
      </div>
    </form>

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../../components/Button.vue';
import InputDate from '../../components/InputDate.vue';
import InputSelect from '../../components/InputSelect.vue';
import InputText from '../../components/InputText.vue';
import Toast from '../../components/Toast.vue';
import http from '../../api/http';
import type { ApiError, Pegawai, StatusKepegawaian } from '../../types';

const route = useRoute();
const router = useRouter();

const mode = computed(() => (route.meta.mode as 'create' | 'edit') || (route.name === 'pegawai-edit' ? 'edit' : 'create'));

const title = computed(() => (mode.value === 'create' ? 'Tambah Pegawai' : 'Ubah Data Pegawai'));

const form = reactive({
  nrp: '',
  nama_lengkap: '',
  jabatan: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat_ktp: '',
  tanggal_masuk: '',
  status_kepegawaian: 'Kontrak' as StatusKepegawaian,
  akhir_kontrak: '' as string | null,
  no_hp: '',
  email: ''
});

const errors = reactive<Record<string, string | null>>({
  nrp: null,
  nama_lengkap: null,
  jabatan: null,
  tempat_lahir: null,
  tanggal_lahir: null,
  alamat_ktp: null,
  tanggal_masuk: null,
  status_kepegawaian: null,
  akhir_kontrak: null,
  no_hp: null,
  email: null
});

const loadingSubmit = ref(false);
const toast = reactive({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
});

const statusOptions = [
  { label: 'Kontrak', value: 'Kontrak' },
  { label: 'Permanen', value: 'Permanen' }
];

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
};

const kembali = () => {
  router.push({ name: 'pegawai-list' });
};

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = null;
  });
};

const validate = () => {
  clearErrors();
  if (!form.nrp) errors.nrp = 'NRP wajib diisi.';
  if (!form.nama_lengkap) errors.nama_lengkap = 'Nama lengkap wajib diisi.';
  if (!form.jabatan) errors.jabatan = 'Jabatan wajib diisi.';
  if (!form.tempat_lahir) errors.tempat_lahir = 'Tempat lahir wajib diisi.';
  if (!form.tanggal_lahir) errors.tanggal_lahir = 'Tanggal lahir wajib diisi.';
  if (!form.alamat_ktp) errors.alamat_ktp = 'Alamat wajib diisi.';
  if (!form.tanggal_masuk) errors.tanggal_masuk = 'Tanggal masuk wajib diisi.';
  if (!form.no_hp) errors.no_hp = 'Nomor handphone wajib diisi.';
  if (form.status_kepegawaian === 'Kontrak' && !form.akhir_kontrak) {
    errors.akhir_kontrak = 'Tanggal akhir kontrak wajib diisi untuk pegawai kontrak.';
  }
  return Object.values(errors).every((value) => !value);
};

const loadData = async () => {
  if (mode.value !== 'edit') return;
  const id = Number(route.params.id);
  if (!id) return;
  try {
    const { data } = await http.get<Pegawai>(`/api/pegawai/${id}`);
    form.nrp = data.nrp;
    form.nama_lengkap = data.nama_lengkap;
    form.jabatan = data.jabatan;
    form.tempat_lahir = data.tempat_lahir;
    form.tanggal_lahir = data.tanggal_lahir;
    form.alamat_ktp = data.alamat_ktp;
    form.tanggal_masuk = data.tanggal_masuk;
    form.status_kepegawaian = data.status_kepegawaian;
    form.akhir_kontrak = data.akhir_kontrak;
    form.no_hp = data.no_hp;
    form.email = data.email ?? '';
  } catch (error) {
    console.error('Gagal memuat data pegawai', error);
    showToast('Data pegawai tidak ditemukan.', 'error');
    router.replace({ name: 'pegawai-list' });
  }
};

const submitForm = async () => {
  if (!validate()) {
    showToast('Silakan perbaiki input yang belum valid.', 'error');
    return;
  }
  loadingSubmit.value = true;
  clearErrors();
  try {
    const payload = { ...form, akhir_kontrak: form.status_kepegawaian === 'Permanen' ? null : form.akhir_kontrak };
    if (mode.value === 'create') {
      await http.post('/api/pegawai', payload);
      showToast('Pegawai berhasil ditambahkan.', 'success');
    } else {
      const id = Number(route.params.id);
      await http.put(`/api/pegawai/${id}`, payload);
      showToast('Perubahan data pegawai berhasil disimpan.', 'success');
    }
    router.push({ name: 'pegawai-list' });
  } catch (error: any) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.errors) {
      Object.entries(apiError.errors).forEach(([key, messages]) => {
        errors[key] = messages[0];
      });
    }
    showToast(apiError?.message || 'Terjadi kesalahan saat menyimpan data.', 'error');
  } finally {
    loadingSubmit.value = false;
  }
};

watch(
  () => form.status_kepegawaian,
  (value) => {
    if (value === 'Permanen') {
      form.akhir_kontrak = null;
      errors.akhir_kontrak = null;
    }
  }
);

onMounted(() => {
  loadData();
});
</script>
