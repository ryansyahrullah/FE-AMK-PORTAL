import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true, layout: 'guest' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, layout: 'app' }
  },
  {
    path: '/pegawai',
    name: 'pegawai-list',
    component: () => import('../views/pegawai/PegawaiList.vue'),
    meta: { requiresAuth: true, layout: 'app' }
  },
  {
    path: '/pegawai/pengajuan-cuti',
    name: 'pegawai-cuti',
    component: () => import('../views/pegawai/PegawaiComingSoon.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      title: 'Pengajuan Cuti',
      description: 'Pantau dan setujui pengajuan cuti pegawai secara terpusat di sini.'
    }
  },
  {
    path: '/pegawai/pengajuan-mcu',
    name: 'pegawai-mcu',
    component: () => import('../views/pegawai/PegawaiComingSoon.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      title: 'Pengajuan MCU',
      description: 'Fitur pemeriksaan kesehatan berkala sedang disiapkan untuk Anda.'
    }
  },
  {
    path: '/pegawai/buat-kontrak',
    name: 'pegawai-kontrak',
    component: () => import('../views/pegawai/PegawaiComingSoon.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      title: 'Buat Kontrak',
      description: 'Segera buat dan kelola kontrak pegawai langsung dari portal ini.'
    }
  },
  {
    path: '/pegawai/tambah',
    name: 'pegawai-create',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', mode: 'create' }
  },
  {
    path: '/pegawai/:id',
    name: 'pegawai-detail',
    component: () => import('../views/pegawai/PegawaiDetail.vue'),
    meta: { requiresAuth: true, layout: 'app' }
  },
  {
    path: '/pegawai/:id/ubah',
    name: 'pegawai-edit',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', mode: 'edit' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
});

export default router;
