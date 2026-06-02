import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

// API setup for production simulation
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  let token = null;
  // Try to get token from cookie if in browser
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) token = match[2];
  }
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials: LoginCredentials) => {
    return api.post('/auth/login', credentials);
  },
};
