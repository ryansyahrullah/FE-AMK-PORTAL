import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import http from '../api/http';
import type { AuthResponse, LoginPayload, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storageKeyToken = 'amk_token';
const storageKeyUser = 'amk_user';

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>({
    user: null,
    token: null,
    loading: false,
    error: null
  });

  const storedToken = localStorage.getItem(storageKeyToken);
  const storedUser = localStorage.getItem(storageKeyUser);

  if (storedToken) {
    state.value.token = storedToken;
  }
  if (storedUser) {
    try {
      state.value.user = JSON.parse(storedUser) as User;
    } catch (error) {
      console.error('Gagal mengurai data pengguna dari localStorage', error);
      localStorage.removeItem(storageKeyUser);
    }
  }

  const isAuthenticated = computed(() => Boolean(state.value.token));

  const login = async (payload: LoginPayload) => {
    state.value.loading = true;
    state.value.error = null;

    try {
      const { data } = await http.post<AuthResponse>('/api/login', payload);
      state.value.user = data.user;
      state.value.token = data.token;
      localStorage.setItem(storageKeyToken, data.token);
      localStorage.setItem(storageKeyUser, JSON.stringify(data.user));
      return data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Terjadi kesalahan saat masuk.';
      state.value.error = message;
      throw new Error(message);
    } finally {
      state.value.loading = false;
    }
  };

  const logout = async () => {
    try {
      await http.post('/api/logout');
    } catch (error) {
      console.warn('Gagal melakukan logout ke server', error);
    } finally {
      localStorage.removeItem(storageKeyToken);
      localStorage.removeItem(storageKeyUser);
      state.value.user = null;
      state.value.token = null;
    }
  };

  return {
    state,
    isAuthenticated,
    login,
    logout
  };
});
