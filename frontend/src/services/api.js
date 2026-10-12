import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'data' in body && body.data !== null && body.data !== undefined) {
      if (Array.isArray(body.data)) {
        try {
          body.data.data = body.data;
        } catch (e) {
          // Ignore
        }
      } else if (typeof body.data === 'object') {
        try {
          if (!('data' in body.data)) {
            Object.defineProperty(body.data, 'data', {
              value: body.data,
              enumerable: false,
              configurable: true,
              writable: true,
            });
          }
        } catch (e) {
          // Ignore
        }
      }
    }
    return body;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    const err = new Error(message);
    err.response = error.response;
    return Promise.reject(err);
  }
);

export default api;
