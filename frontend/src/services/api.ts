import axios from 'axios';
import type { Job, JobFormData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('careerboard_user');
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('careerboard_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const jobsAPI = {
  getAll: (params?: Record<string, string>) => api.get('/jobs', { params }),
  getById: (id: string) => api.get(`/jobs/${id}`),
  create: (data: Partial<JobFormData>) => api.post('/jobs', data),
  update: (id: string, data: Partial<Job>) => api.put(`/jobs/${id}`, data),
  remove: (id: string) => api.delete(`/jobs/${id}`),
};

export default api;
