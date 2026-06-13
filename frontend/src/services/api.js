// Centralized Axios instance for API calls

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Attach JWT token to every outgoing request, if present ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Handle expired/invalid tokens globally ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth endpoints ---
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);

// --- URL endpoints ---
export const createShortUrl = (originalUrl) => api.post('/urls', { originalUrl });
export const fetchUrls = () => api.get('/urls');
export const deleteShortUrl = (id) => api.delete(`/urls/${id}`);
export const fetchUrlAnalytics = (id) => api.get(`/urls/${id}/analytics`);

export default api;
