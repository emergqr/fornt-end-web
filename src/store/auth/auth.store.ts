'use client';

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { profileService } from '@/services/profileService';
import { authService } from '@/services/auth/authService'; // Importar authService
import api from '@/services/api';

/**
 * Helper para configurar el token en los encabezados de la instancia de Axios.
 */
const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Define la forma del estado y las acciones del store de autenticación.
 */
interface AuthStore {
  user: Client | null;
  token: string | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (token: string, user: Client) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: Client) => void;
  deleteAccount: () => Promise<void>; // Nueva acción
}

/**
 * Zustand store para manejar el estado de autenticación.
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isChecking: true,

  login: (token, user) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false });
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

      set({
        user,
        token,
        isAuthenticated: true,
        isChecking: false,
      });
    } catch (error) {
      get().logout();
      set({ isChecking: false });
    }
  },

  setUser: (user: Client) => set({ user }),

  // Implementación de la nueva acción
  deleteAccount: async () => {
    try {
      await authService.deleteAccount();
      // Si la eliminación en el backend es exitosa, deslogueamos al usuario.
      get().logout();
    } catch (error) {
      // Si hay un error, lo lanzamos para que la UI pueda manejarlo.
      console.error("Error deleting account:", error);
      throw error;
    }
  },
}));

/**
 * Ejecuta la verificación de estado de autenticación tan pronto como el código
 * se carga en el cliente (navegador).
 */
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuthStatus();
}
