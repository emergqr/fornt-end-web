'use client';

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { profileService } from '@/services/profileService';
import api from '@/services/api'; // <-- CORRECTED IMPORT

/**
 * Helper para configurar el token en los encabezados de la instancia de Axios.
 * @param token - El token JWT.
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
  isChecking: boolean; // Para el estado de carga inicial al verificar el token
  login: (token: string, user: Client) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  setUser: (user: Client) => void;
}

/**
 * Zustand store para manejar el estado de autenticación.
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isChecking: true, // Inicia en true para indicar que estamos verificando la sesión

  /**
   * Guarda el token y los datos del usuario al iniciar sesión.
   */
  login: (token, user) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
    set({ user, token, isAuthenticated: true });
  },

  /**
   * Limpia el estado y el almacenamiento local al cerrar sesión.
   */
  logout: () => {
    localStorage.removeItem('authToken');
    setAuthToken(null);
    set({ user: null, token: null, isAuthenticated: false });
  },

  /**
   * Verifica si existe un token en localStorage al cargar la app,
   * y si es válido, obtiene los datos del usuario.
   */
  checkAuthStatus: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        set({ isChecking: false });
        return;
      }

      setAuthToken(token);
      const user = await profileService.getProfile(); // Llama al servicio para obtener el perfil

      set({
        user,
        token,
        isAuthenticated: true,
        isChecking: false,
      });
    } catch (error) {
      // Si el token es inválido o hay un error, se limpia todo.
      get().logout();
      set({ isChecking: false });
    }
  },

  /**
   * Permite actualizar los datos del usuario en el store.
   */
  setUser: (user: Client) => set({ user }),
}));

/**
 * Ejecuta la verificación de estado de autenticación tan pronto como el código
 * se carga en el cliente (navegador).
 */
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuthStatus();
}
