import axios from 'axios';
import { getAuthToken, clearAuth } from '../context/AuthContext';
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const api = axios.create({ baseURL: API_BASE, headers: { Accept: 'application/json' } });
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401) {
    clearAuth();
    window.dispatchEvent(new Event('sfs:unauthorized'));
  }
  return Promise.reject(err);
});
export default api;
