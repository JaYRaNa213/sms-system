import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user, token) => {
    // Set cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    set({ user: null, isAuthenticated: false });
  },
}));
