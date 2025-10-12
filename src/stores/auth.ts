import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { isAxiosError } from 'axios';
import http from '../api/http';
import type { AuthResponse, LoginPayload, User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storageKeyToken = 'amk_token';
const storageKeyUser = 'amk_user';

const roleHomeRoute: Record<UserRole, string> = {
  admin_hcgs: '/dashboard',
  pegawai: '/pegawai-saya/dashboard',
  admin_finance: '/finance',
  officer_site: '/officer-site'
};

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null
  });

  const storedToken = localStorage.getItem(storageKeyToken);
  const storedUser = localStorage.getItem(storageKeyUser);

  if (storedToken) {
    state.token = storedToken;
  }
  if (storedUser) {
    try {
      state.user = JSON.parse(storedUser) as User;
    } catch (error: unknown) {
      console.error('Gagal mengurai data pengguna dari localStorage', error);
      localStorage.removeItem(storageKeyUser);
    }
  }

  const isAuthenticated = computed(() => Boolean(state.token));

  const defaultRoute = computed(() => {
    const role = state.user?.role;
    if (!role) {
      return '/login';
    }
    return roleHomeRoute[role] ?? '/dashboard';
  });

  const hasRole = (roles?: UserRole[]) => {
    if (!roles || roles.length === 0) return true;
    const role = state.user?.role;
    return role ? roles.includes(role) : false;
  };

  const getDefaultRoute = () => defaultRoute.value;

  const login = async (payload: LoginPayload) => {
    state.loading = true;
    state.error = null;

    try {
      const credentials = {
        ...payload,
        nrp: payload.nrp.trim().toLowerCase()
      };
      const { data } = await http.post<AuthResponse>('/api/login', credentials);
      state.user = data.user;
      state.token = data.token;
      localStorage.setItem(storageKeyToken, data.token);
      localStorage.setItem(storageKeyUser, JSON.stringify(data.user));
      return data;
    } catch (error: unknown) {
      let message = 'Terjadi kesalahan saat masuk.';
      if (isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
          message = serverMessage;
        }
      }
      state.error = message;
      throw new Error(message);
    } finally {
      state.loading = false;
    }
  };

  const logout = async () => {
    try {
      await http.post('/api/logout');
    } catch (error: unknown) {
      console.warn('Gagal melakukan logout ke server', error);
    } finally {
      localStorage.removeItem(storageKeyToken);
      localStorage.removeItem(storageKeyUser);
      state.user = null;
      state.token = null;
    }
  };

  return {
    state,
    isAuthenticated,
    defaultRoute,
    hasRole,
    login,
    logout,
    getDefaultRoute
  };
});
