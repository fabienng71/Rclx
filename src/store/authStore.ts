import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import bcrypt from 'bcryptjs';
import type { LoginCredentials, User, AuthResponse, LoginAttempt } from '../types/auth';
import { loginUser, logoutUser, getStoredUsers } from '../services/auth';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  getAllUsers: () => User[];
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await loginUser(credentials);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await logoutUser();
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Logout failed',
            isLoading: false,
          });
          throw error;
        }
      },
      setUser: (user) => set({ user }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      getAllUsers: () => {
        const users = getStoredUsers();
        return users.map(user => ({ ...user, password: '' }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);