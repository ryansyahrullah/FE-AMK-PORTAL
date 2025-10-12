import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
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
    path: '/pegawai/tambah',
    name: 'pegawai-create',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', mode: 'create' }
  },
  {
    path: '/pegawai/:id/ubah',
    name: 'pegawai-edit',
    component: () => import('../views/pegawai/PegawaiForm.vue'),
    meta: { requiresAuth: true, layout: 'app', mode: 'edit' }
  },
  {
    path: '/pegawai/:id',
    name: 'pegawai-detail',
    component: () => import('../views/pegawai/PegawaiDetail.vue'),
    meta: { requiresAuth: true, layout: 'app' }
  },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes
});

router.beforeEach((to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const auth = useAuthStore();
  const isAuthenticated = auth.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'dashboard' });
    return;
  }

  next();
});

export default router;
