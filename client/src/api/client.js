import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Automatic Bearer Token Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('easyspace_token') || 'demo-token';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-demo-mode'] = localStorage.getItem('easyspace_demo_mode') || 'true';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error('[API Error]:', message);
    return Promise.reject(error);
  }
);
