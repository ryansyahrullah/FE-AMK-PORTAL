<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <div>
      <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">{{ isEdit ? 'Ubah Pegawai' : 'Tambah Pegawai' }}</h2>
      <p class="text-sm text-slate-500 dark:text-slate-300">Lengkapi formulir berikut untuk menyimpan data pegawai.</p>
    </div>

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="grid gap-5 md:grid-cols-2">
        <InputText v-model="form.nrp" id="nrp" label="NRP" :error="errors.nrp" :disabled="isEdit" />
        <InputText v-model="form.nama_lengkap" id="nama" label="Nama Lengkap" :error="errors.nama_lengkap" />
        <InputText v-model="form.jabatan" id="jabatan" label="Jabatan" :error="errors.jabatan" />
        <InputText v-model="form.tempat_lahir" id="tempat" label="Tempat Lahir" :error="errors.tempat_lahir" />
        <InputDate v-model="form.tanggal_lahir" id="tgl-lahir" label="Tanggal Lahir" :error="errors.tanggal_lahir" />
        <InputDate v-model="form.tanggal_masuk" id="tgl-masuk" label="Tanggal Masuk" :error="errors.tanggal_masuk" />
        <InputText v-model="form.alamat_ktp" id="alamat" label="Alamat KTP" :error="errors.alamat_ktp" class="md:col-span-2" />
        <InputSelect v-model="form.status_kepegawaian" id="status" label="Status Kepegawaian" :error="errors.status_kepegawaian">
          <option value="Kontrak">Kontrak</option>
          <option value="Permanen">Permanen</option>
        </InputSelect>
        <InputDate v-model="form.akhir_kontrak" id="akhir" label="Akhir Kontrak" :error="errors.akhir_kontrak" :disabled="form.status_kepegawaian === 'Permanen'" />
        <InputText v-model="form.no_hp" id="hp" label="Nomor HP" :error="errors.no_hp" />
        <InputText v-model="form.email" id="email" label="Email" :error="errors.email" />
      </div>
      <div class="flex flex-wrap justify-end gap-3">
        <RouterLink :to="{ name: 'pegawai-list' }" class="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200">Batal</RouterLink>
        <Button type="submit" :loading="submitting">Simpan</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import Button from '../../components/Button.vue';
import InputDate from '../../components/InputDate.vue';
import InputSelect from '../../components/InputSelect.vue';
import InputText from '../../components/InputText.vue';
import { isAxiosError } from 'axios';
import http from '../../api/http';
import type { Pegawai, ApiError } from '../../types';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => route.name === 'pegawai-edit');
const pegawaiId = computed(() => Number(route.params.id));

const form = reactive({
  nrp: '',
  nama_lengkap: '',
  jabatan: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  alamat_ktp: '',
  tanggal_masuk: '',
  status_kepegawaian: 'Kontrak' as 'Kontrak' | 'Permanen',
  akhir_kontrak: '',
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

const submitting = ref(false);

watch(
  () => form.status_kepegawaian,
  (value) => {
    if (value === 'Permanen') {
      form.akhir_kontrak = '';
      errors.akhir_kontrak = null;
    }
  }
);

const validate = () => {
  errors.nrp = !form.nrp ? 'NRP wajib diisi.' : null;
  errors.nama_lengkap = !form.nama_lengkap ? 'Nama wajib diisi.' : null;
  errors.jabatan = !form.jabatan ? 'Jabatan wajib diisi.' : null;
  errors.tempat_lahir = !form.tempat_lahir ? 'Tempat lahir wajib diisi.' : null;
  errors.tanggal_lahir = !form.tanggal_lahir ? 'Tanggal lahir wajib diisi.' : null;
  errors.alamat_ktp = !form.alamat_ktp ? 'Alamat wajib diisi.' : null;
  errors.tanggal_masuk = !form.tanggal_masuk ? 'Tanggal masuk wajib diisi.' : null;
  errors.status_kepegawaian = !form.status_kepegawaian ? 'Status wajib diisi.' : null;
  errors.no_hp = !form.no_hp ? 'Nomor HP wajib diisi.' : null;
  if (form.status_kepegawaian === 'Kontrak') {
    errors.akhir_kontrak = !form.akhir_kontrak ? 'Akhir kontrak wajib diisi.' : null;
  }
  return Object.values(errors).every((val) => !val);
};

const fillForm = (data: Pegawai) => {
  form.nrp = data.nrp;
  form.nama_lengkap = data.nama_lengkap;
  form.jabatan = data.jabatan;
  form.tempat_lahir = data.tempat_lahir;
  form.tanggal_lahir = data.tanggal_lahir;
  form.alamat_ktp = data.alamat_ktp;
  form.tanggal_masuk = data.tanggal_masuk;
  form.status_kepegawaian = data.status_kepegawaian;
  form.akhir_kontrak = data.akhir_kontrak ?? '';
  form.no_hp = data.no_hp;
  form.email = data.email ?? '';
};

const loadPegawai = async () => {
  if (!isEdit.value || !pegawaiId.value) return;
  const { data } = await http.get<Pegawai>(`/api/pegawai/${pegawaiId.value}`);
  fillForm(data);
};

const handleSubmit = async () => {
  if (!validate()) return;
  submitting.value = true;
  try {
    if (isEdit.value) {
      await http.put(`/api/pegawai/${pegawaiId.value}`, {
        ...form,
        akhir_kontrak: form.status_kepegawaian === 'Permanen' ? null : form.akhir_kontrak || null,
        email: form.email || null
      });
    } else {
      await http.post('/api/pegawai', {
        ...form,
        akhir_kontrak: form.status_kepegawaian === 'Permanen' ? null : form.akhir_kontrak || null,
        email: form.email || null
      });
    }
    router.push({ name: 'pegawai-list' });
  } catch (error) {
    if (isAxiosError<ApiError>(error)) {
      const apiError = error.response?.data;
      if (apiError?.errors) {
        Object.entries(apiError.errors).forEach(([field, messages]) => {
          if (field in errors) {
            errors[field] = messages[0];
          }
        });
      }
    }
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadPegawai();
});
</script>
