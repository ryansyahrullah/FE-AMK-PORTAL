import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios';

const baseURL = import.meta.env.VITE_API_URL;
const useMock = !baseURL || baseURL === 'mock';

const http = axios.create({
  baseURL: useMock ? '' : baseURL,
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

if (useMock) {
  (async () => {
    const { initMockServer } = await import('../mocks/server');
    initMockServer(http);
  })();
}

export default http;
