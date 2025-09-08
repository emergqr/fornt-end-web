'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Gets the default theme from the user's system preferences.
 * @returns 'dark' or 'light'
 */
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Zustand store for managing the application's theme (light/dark mode).
 * It persists the user's choice in localStorage.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // Set the initial state from system preference
      mode: getSystemTheme(),

      // Action to toggle the theme between light and dark
      toggleTheme: () =>
        set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      
      // Action to set a specific theme
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage', // Unique name for the localStorage key
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
    }
  )
);
