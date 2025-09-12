'use client';

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/auth/authService';
import api from '@/services/api';
import i18n from '@/services/i18n'; // Import i18n instance

/**
 * @file This file defines the Zustand store for authentication management.
 * It handles user session, token, and profile data across the application.
 */

/**
 * A helper function to set the authorization token on the global Axios instance.
 * This ensures that all subsequent API requests are authenticated.
 * @param {string | null} token - The JWT token. If null, the Authorization header is removed.
 */
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Interface defining the shape of the authentication state and its actions.
 */
interface AuthStore {
  user: Client | null; // Holds the authenticated user's profile data.
  token: string | null; // The JWT authentication token.
  isAuthenticated: boolean; // Flag indicating if the user is currently authenticated.
  isChecking: boolean; // Flag to indicate if the initial authentication check is in progress.
  login: (token: string, user: Client) => void; // Action to handle user login.
  logout: () => void; // Action to handle user logout.
  checkAuthStatus: () => Promise<void>; // Action to verify authentication status on app load.
  setUser: (user: Client) => void; // Action to update the user profile in the store.
  deleteAccount: () => Promise<void>; // Action to handle account deletion.
}

/**
 * Creates the Zustand store for authentication.
 * This store is responsible for managing the user's session state.
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  isChecking: true, // Start with true to prevent premature redirects before the check is done.

  /**
   * Logs the user in, stores the token, and updates the state.
   * It also sets the application language based on the user's preference.
   * @param {string} token - The JWT received from the API.
   * @param {Client} user - The user profile data.
   */
  login: (token, user) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    set({ user, token, isAuthenticated: true });

    // Sync language based on user's preference from the backend.
    if (user.preferred_language && i18n.language !== user.preferred_language) {
      i18n.changeLanguage(user.preferred_language);
    }
  },

  /**
   * Logs the user out, clears the token, and resets the state.
   */
  logout: () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  /**
   * Checks if a valid session exists on application startup.
   * It looks for a token in localStorage and validates it by fetching the user profile.
   * It also syncs the language preference.
   */
  checkAuthStatus: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // If no token is found, the user is not authenticated.
        set({ isChecking: false });
        return;
      }

      // Set the token for subsequent API calls and fetch the user profile.
      setAuthToken(token);
      const user = await profileService.getProfile();

      // If successful, update the store with the user data.
      set({
        user,
        token,
        isAuthenticated: true,
        isChecking: false,
      });

      // Sync language based on user's preference from the backend.
      if (user.preferred_language && i18n.language !== user.preferred_language) {
        i18n.changeLanguage(user.preferred_language);
      }

    } catch (error) {
      // If fetching the profile fails (e.g., invalid token), log the user out.
      get().logout();
      set({ isChecking: false });
    }
  },

  /**
   * Updates the user object in the store.
   * Useful after a profile update.
   * @param {Client} user - The updated user profile data.
   */
  setUser: (user: Client) => set({ user }),

  /**
   * Handles the account deletion process.
   * It calls the API to delete the user and then logs them out on success.
   */
  deleteAccount: async () => {
    try {
      await authService.deleteAccount();
      // If the backend deletion is successful, clear the local session.
      get().logout();
    } catch (error) {
      // If an error occurs, log it and re-throw it to be handled by the UI.
      console.error("Error deleting account:", error);
      throw error;
    }
  },
}));

/**
 * Immediately triggers the authentication status check as soon as the store is loaded
 * on the client-side. This ensures the app knows the user's auth state on initial load.
 */
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuthStatus();
}
