<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-slate-900 dark:text-white">Data Pegawai</h2>
        <p class="text-sm text-slate-500 dark:text-slate-300">Kelola data pegawai, termasuk tambah, ubah, dan hapus.</p>
      </div>
      <RouterLink
        :to="{ name: 'pegawai-create' }"
        class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary/90"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Pegawai
      </RouterLink>
    </div>

    <SearchBar v-model="search" v-model:perPage="perPage" @search="handleSearch" />

    <AppTable :columns="['NRP', 'Nama', 'Tanggal Masuk', 'Status', 'Akhir Kontrak', 'Jabatan', 'Aksi']" :loading="loading" :empty="pegawai.length === 0">
      <tr v-for="item in pegawai" :key="item.id" class="text-sm text-slate-700 dark:text-slate-200">
        <td class="px-4 py-3 font-medium">{{ item.nrp }}</td>
        <td class="px-4 py-3">{{ item.nama_lengkap }}</td>
        <td class="px-4 py-3">{{ formatTanggal(item.tanggal_masuk) }}</td>
        <td class="px-4 py-3">
          <span
            class="inline-flex rounded-full px-3 py-1 text-xs font-medium"
            :class="item.status_kepegawaian === 'Kontrak' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
          >
            {{ item.status_kepegawaian }}
          </span>
        </td>
        <td class="px-4 py-3">{{ formatTanggal(item.akhir_kontrak) }}</td>
        <td class="px-4 py-3">{{ item.jabatan }}</td>
        <td class="px-4 py-3">
          <div class="flex flex-wrap gap-2">
            <RouterLink :to="{ name: 'pegawai-detail', params: { id: item.id } }" class="text-sm font-medium text-primary hover:underline">Lihat</RouterLink>
            <RouterLink :to="{ name: 'pegawai-edit', params: { id: item.id } }" class="text-sm font-medium text-sky-600 hover:underline">Ubah</RouterLink>
            <button type="button" class="text-sm font-medium text-rose-600 hover:underline" @click="confirmDelete(item)">Hapus</button>
          </div>
        </td>
      </tr>
    </AppTable>

    <AppPagination :current-page="page" :total-page="totalPage" @change="changePage" />

    <ConfirmDialog
      v-model="showConfirm"
      title="Hapus Pegawai"
      :message="`Apakah Anda yakin ingin menghapus data ${selectedPegawai?.nama_lengkap}?`"
      confirm-label="Hapus"
      confirm-variant="danger"
      :loading="loadingDelete"
      @confirm="handleDelete"
    />

    <Toast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import AppPagination from '../../components/AppPagination.vue';
import AppTable from '../../components/AppTable.vue';
import ConfirmDialog from '../../components/ConfirmDialog.vue';
import SearchBar from '../../components/SearchBar.vue';
import Toast from '../../components/Toast.vue';
import http from '../../api/http';
import type { Pegawai, PaginatedPegawai } from '../../types';

const pegawai = ref<Pegawai[]>([]);
const meta = ref<{ total: number; per_page: number; current_page: number }>({ total: 0, per_page: 10, current_page: 1 });
const loading = ref(false);
const loadingDelete = ref(false);
const search = ref('');
const perPage = ref(10);
const page = ref(1);
const showConfirm = ref(false);
const selectedPegawai = ref<Pegawai | null>(null);
type ToastExpose = { show: (payload: { title: string; message: string; variant: 'success' | 'error'; timeout?: number }) => void };
const toast = ref<ToastExpose | null>(null);

const totalPage = computed(() => {
  if (meta.value.per_page === 0) return 1;
  return Math.max(1, Math.ceil(meta.value.total / meta.value.per_page));
});

const formatTanggal = (tanggal?: string | null) => {
  if (!tanggal) return '-';
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(tanggal));
};

const fetchPegawai = async () => {
  loading.value = true;
  try {
    const { data } = await http.get<PaginatedPegawai>('/api/pegawai', {
      params: {
        search: search.value,
        page: page.value,
        per_page: perPage.value
      }
    });
    pegawai.value = data.data;
    meta.value = data.meta;
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  page.value = 1;
  fetchPegawai();
};

const changePage = (value: number) => {
  page.value = value;
  fetchPegawai();
};

watch(perPage, () => {
  page.value = 1;
  fetchPegawai();
});

const confirmDelete = (item: Pegawai) => {
  selectedPegawai.value = item;
  showConfirm.value = true;
};

const handleDelete = async () => {
  if (!selectedPegawai.value) return;
  loadingDelete.value = true;
  try {
    await http.delete(`/api/pegawai/${selectedPegawai.value.id}`);
    showConfirm.value = false;
    toast.value?.show({
      title: 'Berhasil',
      message: 'Data pegawai berhasil dihapus.',
      variant: 'success',
      timeout: 3000
    });
    fetchPegawai();
  } catch (error) {
    toast.value?.show({
      title: 'Gagal',
      message: 'Terjadi kesalahan saat menghapus data.',
      variant: 'error',
      timeout: 3000
    });
  } finally {
    loadingDelete.value = false;
  }
};

onMounted(() => {
  fetchPegawai();
});
</script>
