'use client';

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/auth/authService';
import api, { recursiveUrlCorrection } from '@/services/api';
import { getApiErrorMessage } from '@/services/apiErrors';
import i18n from '@/services/i18n';

/**
 * @file This file defines the Zustand store for authentication management.
 * It handles user session, token, and profile data across the application.
 */

const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

interface AuthStore {
  user: Client | null;
  token: string | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  error: string | null; // Added for consistent error handling
  login: (token: string, user: Client) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: Client) => void;
  deleteAccount: () => Promise<void>;
  clearError: () => void; // Added for consistent error handling
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isChecking: true,
  error: null, // Added for consistent error handling

  clearError: () => set({ error: null }),

  login: (token, user) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    const correctedUser = recursiveUrlCorrection(user);
    set({ user: correctedUser, token, isAuthenticated: true, error: null });

    if (correctedUser.preferred_language && i18n.language !== correctedUser.preferred_language) {
      i18n.changeLanguage(correctedUser.preferred_language);
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  checkAuthStatus: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        set({ isChecking: false });
        return;
      }
      setAuthToken(token);
      const user = await profileService.getProfile();
      const correctedUser = recursiveUrlCorrection(user);
      set({
        user: correctedUser,
        token,
        isAuthenticated: true,
        isChecking: false,
      });

      if (correctedUser.preferred_language && i18n.language !== correctedUser.preferred_language) {
        i18n.changeLanguage(correctedUser.preferred_language);
      }
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      get().logout();
      set({ isChecking: false, error: errorMessage });
    }
  },

  setUser: (user: Client) => {
    const correctedUser = recursiveUrlCorrection(user);
    set({ user: correctedUser });
  },

  deleteAccount: async () => {
    try {
      await authService.deleteAccount();
      get().logout();
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));

if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuthStatus();
}
