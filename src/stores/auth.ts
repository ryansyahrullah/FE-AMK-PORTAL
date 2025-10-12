import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { isAxiosError } from 'axios';
import http from '../api/http';
import type { AuthResponse, LoginPayload, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const TOKEN_KEY = 'amk_token';
const USER_KEY = 'amk_user';

const readStoredUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn('Gagal membaca data user dari storage', error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<AuthState>({
    user: readStoredUser(),
    token: localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null
  });

  const isAuthenticated = computed(() => Boolean(state.token));

  const setSession = (token: string, user: User) => {
    state.user = user;
    state.token = token;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const clearSession = () => {
    state.user = null;
    state.token = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (payload: LoginPayload) => {
    state.loading = true;
    state.error = null;

    try {
      const credentials = {
        nrp: payload.nrp.trim(),
        password: payload.password.trim()
      };
      const { data } = await http.post<AuthResponse>('/api/login', credentials);
      setSession(data.token, data.user);
      return data;
    } catch (error: unknown) {
      let message = 'Terjadi kesalahan saat masuk.';
      if (isAxiosError(error)) {
        const serverData = error.response?.data as { message?: string } | undefined;
        const serverMessage = serverData?.message;
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
    } finally {
      clearSession();
    }
  };

  const resetError = () => {
    state.error = null;
  };

  return {
    state,
    isAuthenticated,
    login,
    logout,
    resetError
  };
});
