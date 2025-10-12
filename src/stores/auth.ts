import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { isAxiosError } from 'axios';
import http from '../api/http';
import type { AuthResponse, LoginPayload, SwitchRolePayload, User, UserRole } from '../types';

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

const normalizeUser = (user: User): User => {
  const roles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : [user.role];
  const activeRole = roles.includes(user.role) ? user.role : roles[0];
  return {
    ...user,
    role: activeRole,
    roles
  };
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
      state.user = normalizeUser(JSON.parse(storedUser) as User);
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
      const normalizedUser = normalizeUser(data.user);
      state.user = normalizedUser;
      state.token = data.token;
      localStorage.setItem(storageKeyToken, data.token);
      localStorage.setItem(storageKeyUser, JSON.stringify(normalizedUser));
      return { ...data, user: normalizedUser };
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

  const verifyPassword = async (password: string) => {
    if (!password || password.trim().length === 0) {
      throw new Error('Kata sandi wajib diisi.');
    }

    try {
      await http.post<{ valid: boolean }>('/api/auth/verify-password', {
        password: password.trim()
      });
      return true;
    } catch (error: unknown) {
      let message = 'Kata sandi tidak sesuai.';
      if (isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
          message = serverMessage;
        }
      }
      throw new Error(message);
    }
  };

  const switchRole = async (payload: SwitchRolePayload) => {
    if (!state.user) {
      throw new Error('Pengguna belum masuk.');
    }

    const sanitizedPayload: SwitchRolePayload = {
      role: payload.role,
      password: payload.password.trim()
    };

    if (!sanitizedPayload.password) {
      throw new Error('Kata sandi wajib diisi.');
    }

    try {
      const { data } = await http.post<AuthResponse>('/api/auth/switch-role', sanitizedPayload);
      const normalizedUser = normalizeUser(data.user);
      state.user = normalizedUser;
      if (data.token) {
        state.token = data.token;
        localStorage.setItem(storageKeyToken, data.token);
      }
      localStorage.setItem(storageKeyUser, JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (error: unknown) {
      let message = 'Gagal mengganti peran.';
      if (isAxiosError(error)) {
        const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
        if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
          message = serverMessage;
        }
      }
      throw new Error(message);
    }
  };

  const availableRoles = computed<UserRole[]>(() => state.user?.roles ?? []);

  const canSwitchToRole = (targetRole: UserRole) => {
    if (!state.user) return false;
    if (state.user.role === targetRole) return false;
    return availableRoles.value.includes(targetRole);
  };

  return {
    state,
    isAuthenticated,
    defaultRoute,
    hasRole,
    login,
    logout,
    getDefaultRoute,
    verifyPassword,
    switchRole,
    availableRoles,
    canSwitchToRole
  };
});
