'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. Ampliado para incluir los nuevos temas
export type ThemeMode = 'light' | 'dark' | 'spring' | 'summer' | 'autumn' | 'winter';

interface ThemeState {
  mode: ThemeMode;
  // 2. toggleTheme eliminado, ahora solo usamos setTheme
  setTheme: (mode: ThemeMode) => void;
}

/**
 * Obtiene el tema por defecto de las preferencias del sistema del usuario.
 * Devuelve 'dark' o 'light', que sirve como un excelente punto de partida.
 */
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

/**
 * Store de Zustand para gestionar el tema de la aplicación.
 * Persiste la elección del usuario en localStorage.
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      // El estado inicial se establece a partir de la preferencia del sistema.
      mode: getSystemTheme(),

      // 3. La única acción es setTheme, que ahora puede aceptar cualquiera de los nuevos modos.
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage', // Nombre único para la clave en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage para la persistencia
    }
  )
);
