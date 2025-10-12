import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { UserRole } from '../types';

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
    meta: { requiresAuth: true, layout: 'app', roles: ['admin_hcgs'] }
  },
  {
    path: '/pegawai',
    name: 'pegawai-list',
    component: () => import('../views/pegawai/PegawaiList.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['admin_hcgs'] }
  },
  {
    path: '/pegawai/pengajuan-cuti',
    name: 'pegawai-cuti',
    component: () => import('../views/pegawai/PegawaiComingSoon.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      roles: ['admin_hcgs'],
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
      roles: ['admin_hcgs'],
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
      roles: ['admin_hcgs'],
      title: 'Buat Kontrak',
      description: 'Segera buat dan kelola kontrak pegawai langsung dari portal ini.'
    }
  },
  {
    path: '/pegawai/tambah',
    name: 'pegawai-create',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['admin_hcgs'], mode: 'create' }
  },
  {
    path: '/pegawai/:id',
    name: 'pegawai-detail',
    component: () => import('../views/pegawai/PegawaiDetail.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['admin_hcgs'] }
  },
  {
    path: '/pegawai/:id/ubah',
    name: 'pegawai-edit',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['admin_hcgs'], mode: 'edit' }
  },
  {
    path: '/pegawai-saya/dashboard',
    name: 'pegawai-dashboard',
    component: () => import('../views/pegawai/PegawaiDashboardView.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['pegawai'] }
  },
  {
    path: '/pegawai-saya/biodata',
    name: 'pegawai-biodata',
    component: () => import('../views/pegawai/PegawaiBiodataView.vue'),
    meta: { requiresAuth: true, layout: 'app', roles: ['pegawai'] }
  },
  {
    path: '/pegawai-saya/slip-gaji',
    name: 'pegawai-slip',
    component: () => import('../views/pegawai/PegawaiSlipGajiView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      roles: ['pegawai'],
      title: 'Slip Gaji',
      description: 'Slip gaji digital Anda akan segera hadir dengan tampilan yang aman dan rapi.'
    }
  },
  {
    path: '/finance',
    name: 'finance-dashboard',
    component: () => import('../views/ComingSoonView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      roles: ['admin_finance'],
      title: 'Dashboard Finance',
      description: 'Fitur laporan dan manajemen keuangan sedang kami siapkan untuk Anda.'
    }
  },
  {
    path: '/officer-site',
    name: 'officer-site-dashboard',
    component: () => import('../views/ComingSoonView.vue'),
    meta: {
      requiresAuth: true,
      layout: 'app',
      roles: ['officer_site'],
      title: 'Officer Site',
      description: 'Portal officer site akan segera tersedia lengkap dengan monitoring aktivitas lapangan.'
    }
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

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    next(auth.getDefaultRoute());
    return;
  }

  const roles = (to.meta.roles as UserRole[] | undefined) ?? undefined;

  if (to.meta.requiresAuth && roles && !auth.hasRole(roles)) {
    next(auth.getDefaultRoute());
    return;
  }

  next();
});

export default router;
