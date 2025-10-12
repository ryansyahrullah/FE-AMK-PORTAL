import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_URL;
const useMockServer = !configuredBaseURL || configuredBaseURL === 'mock';

export const http = axios.create({
  baseURL: useMockServer ? '' : configuredBaseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('amk_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('amk_token');
      localStorage.removeItem('amk_user');
    }
    return Promise.reject(error);
  }
);

if (useMockServer) {
  (async () => {
    const { initMockServer } = await import('../mocks/server');
    initMockServer(http);
  })();
}

export default http;
