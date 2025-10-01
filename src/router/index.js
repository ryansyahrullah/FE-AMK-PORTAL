import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    alias: ['/login'],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
