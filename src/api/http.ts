import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '';

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('amk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('amk_token');
      localStorage.removeItem('amk_user');
    }
    return Promise.reject(error);
  }
);

if (baseURL === 'mock') {
  const { initMockServer } = await import('../mocks/server');
  initMockServer(http);
}

export default http;
