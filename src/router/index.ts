import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/',
      name: 'root',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pegawai',
      name: 'pegawai-list',
      component: () => import('../views/pegawai/PegawaiList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pegawai/tambah',
      name: 'pegawai-create',
      component: () => import('../views/pegawai/PegawaiForm.vue'),
      meta: { requiresAuth: true, mode: 'create' }
    },
    {
      path: '/pegawai/:id',
      name: 'pegawai-detail',
      component: () => import('../views/pegawai/PegawaiDetail.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pegawai/:id/ubah',
      name: 'pegawai-edit',
      component: () => import('../views/pegawai/PegawaiForm.vue'),
      meta: { requiresAuth: true, mode: 'edit' }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
});

router.beforeEach((to, from, next) => {
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
