'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setTokens, clearTokens } from '@/lib/utils/token';

export interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        // Store tokens in localStorage
        setTokens(accessToken, refreshToken);
        // Update Zustand state
        set({ user, accessToken, refreshToken });
      },
      clearAuth: () => {
        // Clear tokens from localStorage
        clearTokens();
        // Clear Zustand state
        set({ user: null, accessToken: null, refreshToken: null });
      },
      isAuthenticated: () => {
        const state = get();
        return !!state.accessToken && !!state.user;
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user and tokens, not functions
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
