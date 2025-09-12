'use client';

/**
 * @file This file defines the Zustand store for the admin panel,
 * managing the state of users, loading, and errors.
 */

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { adminService } from '@/services/client/adminService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface AdminState {
  users: Client[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  deleteUser: (uuid: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  loading: false,
  error: null,

  /**
   * Fetches all users from the API and updates the store.
   */
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await adminService.getAllClients();
      set({ users, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  /**
   * Deletes a user and removes them from the local state on success.
   * @param {string} uuid - The UUID of the user to delete.
   */
  deleteUser: async (uuid: string) => {
    try {
      await adminService.deleteClient(uuid);
      set((state) => ({
        users: state.users.filter((user) => user.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      // Re-throw the error to be handled by the UI component (e.g., to show a snackbar).
      throw new Error(message);
    }
  },
}));
