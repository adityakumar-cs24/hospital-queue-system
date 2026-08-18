import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token from localStorage to every request automatically
axiosInstance.interceptors.request.use((config) => {
  const authData = localStorage.getItem('authData');
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token is invalid/expired, auto-logout on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authData');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;