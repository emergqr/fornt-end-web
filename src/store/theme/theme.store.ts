'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @file This file defines the Zustand store for managing the application's theme.
 * It handles the current theme mode and persists the user's choice to localStorage.
 */

/**
 * Defines the available theme modes for the application.
 */
export type ThemeMode = 'light' | 'dark' | 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Interface defining the shape of the theme state and its actions.
 */
interface ThemeState {
  mode: ThemeMode; // The currently active theme mode.
  setTheme: (mode: ThemeMode) => void; // Action to set a new theme mode.
}

/**
 * Gets the default theme based on the user's operating system preferences.
 * @returns {'light' | 'dark'} The system's preferred color scheme.
 */
const getSystemTheme = (): 'light' | 'dark' => {
  // Check if the window object is available (ensuring client-side execution).
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Creates the Zustand store for theme management, with persistence.
 * The user's selected theme is saved to localStorage and retrieved on subsequent visits.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // The initial state is determined by the system theme preference.
      // This value will be overridden by the persisted state from localStorage if it exists.
      mode: getSystemTheme(),

      /**
       * Sets the application's theme mode.
       * @param {ThemeMode} mode - The theme mode to set.
       */
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage', // Unique name for the localStorage key.
      storage: createJSONStorage(() => localStorage), // Specify localStorage as the persistence medium.
    }
  )
);
