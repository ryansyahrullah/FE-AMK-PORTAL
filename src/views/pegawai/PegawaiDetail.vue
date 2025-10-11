<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Detail Pegawai</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Informasi lengkap pegawai untuk keperluan administrasi.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" @click="kembali">Kembali</Button>
        <Button v-if="pegawai" @click="goToEdit">Ubah</Button>
        <Button v-if="pegawai" variant="danger" @click="showConfirm = true">Hapus</Button>
      </div>
    </div>

    <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div v-if="loading" class="grid gap-6 md:grid-cols-2">
        <div v-for="n in 10" :key="n" class="h-5 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
      <div v-else-if="pegawai" class="grid gap-6 md:grid-cols-2">
        <div v-for="field in detailFields" :key="field.key">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ field.label }}</p>
          <p class="mt-1 text-sm text-slate-800 dark:text-slate-100">{{ field.formatter?.(pegawai[field.key]) ?? pegawai[field.key] ?? '-' }}</p>
        </div>
      </div>
      <div v-else class="flex flex-col items-center gap-2 py-12 text-slate-500 dark:text-slate-400">
        <span class="text-3xl">🕵️‍♀️</span>
        Data pegawai tidak ditemukan.
      </div>
    </div>

    <ConfirmDialog
      v-model="showConfirm"
      title="Hapus Pegawai"
      :message="`Apakah Anda yakin ingin menghapus pegawai ${pegawai?.nama_lengkap}?`"
      :loading="loadingDelete"
      @confirm="deletePegawai"
    />

    <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '../../components/Button.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import Toast from '../../components/Toast.vue';
import http from '../../api/http';
import type { Pegawai } from '../../types';

const route = useRoute();
const router = useRouter();

const pegawai = ref<Pegawai | null>(null);
const loading = ref(true);
const showConfirm = ref(false);
const loadingDelete = ref(false);
const toast = reactive({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
});

const detailFields = [
  { key: 'nrp', label: 'NRP' },
  { key: 'nama_lengkap', label: 'Nama Lengkap' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'tempat_lahir', label: 'Tempat Lahir' },
  { key: 'tanggal_lahir', label: 'Tanggal Lahir', formatter: formatDate },
  { key: 'alamat_ktp', label: 'Alamat KTP' },
  { key: 'tanggal_masuk', label: 'Tanggal Masuk', formatter: formatDate },
  { key: 'status_kepegawaian', label: 'Status Kepegawaian' },
  { key: 'akhir_kontrak', label: 'Akhir Kontrak', formatter: (value: string | null) => (value ? formatDate(value) : '-') },
  { key: 'no_hp', label: 'No. Handphone' },
  { key: 'email', label: 'Email' },
  { key: 'created_at', label: 'Dibuat Pada', formatter: formatDateTime },
  { key: 'updated_at', label: 'Diperbarui Pada', formatter: formatDateTime }
] as const;

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
};

const kembali = () => router.push({ name: 'pegawai-list' });

const goToEdit = () => {
  if (!pegawai.value) return;
  router.push({ name: 'pegawai-edit', params: { id: pegawai.value.id } });
};

const fetchPegawai = async () => {
  const id = Number(route.params.id);
  if (!id) {
    loading.value = false;
    return;
  }
  loading.value = true;
  try {
    const { data } = await http.get<Pegawai>(`/api/pegawai/${id}`);
    pegawai.value = data;
  } catch (error) {
    console.error('Gagal memuat detail pegawai', error);
    showToast('Data pegawai tidak ditemukan.', 'error');
  } finally {
    loading.value = false;
  }
};

const deletePegawai = async () => {
  if (!pegawai.value) return;
  loadingDelete.value = true;
  try {
    await http.delete(`/api/pegawai/${pegawai.value.id}`);
    showToast('Pegawai berhasil dihapus.', 'success');
    showConfirm.value = false;
    router.push({ name: 'pegawai-list' });
  } catch (error) {
    console.error('Gagal menghapus pegawai', error);
    showToast('Terjadi kesalahan saat menghapus pegawai.', 'error');
  } finally {
    loadingDelete.value = false;
  }
};

onMounted(() => {
  fetchPegawai();
});

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>
