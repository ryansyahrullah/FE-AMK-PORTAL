<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-slate-100">Data Pegawai</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400">Kelola biodata pegawai, tambah, ubah, dan hapus dengan mudah.</p>
      </div>
      <Button @click="goToCreate">
        Tambah Pegawai
      </Button>
    </div>

    <SearchBar v-model:search="filters.search" v-model:perPage="filters.per_page" />

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <AppTable
        :columns="columns"
        :items="pegawai"
        :loading="loading"
        row-key="id"
        empty-message="Belum ada data pegawai."
      >
        <template #cell-tanggal_masuk="{ item }">
          {{ formatDate(item.tanggal_masuk) }}
        </template>
        <template #cell-akhir_kontrak="{ item }">
          {{ item.akhir_kontrak ? formatDate(item.akhir_kontrak) : '-' }}
        </template>
        <template #cell-status_kepegawaian="{ item }">
          <span
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
            :class="item.status_kepegawaian === 'Kontrak' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'"
          >
            {{ item.status_kepegawaian }}
          </span>
        </template>
        <template #cell-aksi="{ item }">
          <div class="flex gap-2">
            <Button size="sm" variant="secondary" @click="goToDetail(item.id)">Lihat</Button>
            <Button size="sm" @click="goToEdit(item.id)">Ubah</Button>
            <Button size="sm" variant="danger" @click="confirmDelete(item)">Hapus</Button>
          </div>
        </template>
      </AppTable>
      <AppPagination
        v-if="meta.total > 0"
        :current-page="meta.current_page"
        :total-pages="totalPages"
        :total-items="meta.total"
        @change="changePage"
      />
    </div>

    <ConfirmDialog
      v-model="showConfirm"
      title="Hapus Pegawai"
      :message="`Apakah Anda yakin ingin menghapus pegawai ${selectedPegawai?.nama_lengkap}? Tindakan ini tidak dapat dibatalkan.`"
      :loading="loadingDelete"
      @confirm="executeDelete"
    />

    <ConfirmPasswordDialog
      v-model="showPasswordConfirm"
      v-model:password="passwordInput"
      title="Konfirmasi Penghapusan"
      message="Untuk menghapus pegawai ini, masukkan kata sandi akun Admin HCGS Anda."
      :loading="verifyingPassword"
      :error="passwordError"
      @confirm="verifyAndDelete"
    />

    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import AppPagination from '../../components/AppPagination.vue';
import AppTable from '../../components/AppTable.vue';
import Button from '../../components/Button.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import ConfirmPasswordDialog from '../../components/ConfirmPasswordDialog.vue';
import SearchBar from '../../components/SearchBar.vue';
import Toast from '../../components/Toast.vue';
import http from '../../api/http';
import { useAuthStore } from '../../stores/auth';
import type { PaginatedPegawai, Pegawai } from '../../types';

const router = useRouter();
const auth = useAuthStore();

const columns = [
  { key: 'nrp', label: 'NRP' },
  { key: 'nama_lengkap', label: 'Nama' },
  { key: 'tanggal_masuk', label: 'Tanggal Masuk' },
  { key: 'status_kepegawaian', label: 'Status' },
  { key: 'akhir_kontrak', label: 'Akhir Kontrak' },
  { key: 'jabatan', label: 'Jabatan' },
  { key: 'aksi', label: 'Aksi' }
];

const filters = reactive({
  search: '',
  page: 1,
  per_page: 10
});

const pegawai = ref<Pegawai[]>([]);
const meta = reactive({
  total: 0,
  per_page: 10,
  current_page: 1
});
const loading = ref(false);
const loadingDelete = ref(false);
const verifyingPassword = ref(false);
const showConfirm = ref(false);
const showPasswordConfirm = ref(false);
const selectedPegawai = ref<Pegawai | null>(null);
const toast = reactive({
  show: false,
  message: '',
  type: 'info' as 'success' | 'error' | 'info'
});
const passwordInput = ref('');
const passwordError = ref<string | null>(null);

const requiresPasswordConfirmation = computed(() => auth.state.user?.role === 'admin_hcgs');

const totalPages = computed(() => Math.ceil(meta.total / meta.per_page) || 1);

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fetchPegawai = async () => {
  loading.value = true;
  try {
    const { data } = await http.get<PaginatedPegawai>('/api/pegawai', {
      params: {
        search: filters.search || undefined,
        page: filters.page,
        per_page: filters.per_page
      }
    });
    pegawai.value = data.data;
    meta.total = data.meta.total;
    meta.per_page = data.meta.per_page;
    meta.current_page = data.meta.current_page;
  } catch (error) {
    console.error('Gagal memuat data pegawai', error);
    showToast('Gagal memuat data pegawai.', 'error');
  } finally {
    loading.value = false;
  }
};

const changePage = (page: number) => {
  filters.page = page;
};

const goToCreate = () => router.push({ name: 'pegawai-create' });
const goToDetail = (id: number) => router.push({ name: 'pegawai-detail', params: { id } });
const goToEdit = (id: number) => router.push({ name: 'pegawai-edit', params: { id } });

const confirmDelete = (item: Pegawai) => {
  selectedPegawai.value = item;
  if (requiresPasswordConfirmation.value) {
    passwordInput.value = '';
    passwordError.value = null;
    showPasswordConfirm.value = true;
  } else {
    showConfirm.value = true;
  }
};

const executeDelete = async () => {
  if (!selectedPegawai.value) return;
  loadingDelete.value = true;
  try {
    await http.delete(`/api/pegawai/${selectedPegawai.value.id}`);
    showToast('Pegawai berhasil dihapus.', 'success');
    showConfirm.value = false;
    showPasswordConfirm.value = false;
    selectedPegawai.value = null;
    fetchPegawai();
  } catch (error) {
    console.error('Gagal menghapus pegawai', error);
    showToast('Terjadi kesalahan saat menghapus pegawai.', 'error');
  } finally {
    loadingDelete.value = false;
  }
};

const verifyAndDelete = async () => {
  if (!selectedPegawai.value) return;
  passwordError.value = null;
  verifyingPassword.value = true;
  try {
    await auth.verifyPassword(passwordInput.value);
    await executeDelete();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kata sandi tidak sesuai.';
    passwordError.value = message;
  } finally {
    verifyingPassword.value = false;
  }
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
};

watch(
  () => [filters.search, filters.per_page],
  () => {
    filters.page = 1;
    fetchPegawai();
  }
);

watch(
  () => filters.page,
  () => {
    fetchPegawai();
  }
);

watch(
  () => showPasswordConfirm.value,
  (open) => {
    if (!open) {
      passwordInput.value = '';
      passwordError.value = null;
    }
  }
);

onMounted(() => {
  fetchPegawai();
});
</script>
