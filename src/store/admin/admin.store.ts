'use client';

/**
 * @file This file defines the Zustand store for managing the user list in the Admin Panel.
 * It handles state and actions for fetching and manipulating user data.
 * NOTE: This store currently interacts with a mock service.
 */

import { create } from 'zustand';
import { Client } from '@/interfaces/client/client.interface';
import { adminService } from '@/services/client/adminService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * Interface defining the shape of the admin state and its associated actions.
 */
interface AdminState {
  users: Client[]; // An array to hold the list of all users.
  loading: boolean; // Flag to indicate loading state.
  error: string | null; // Holds any error message from API calls.
  fetchAllUsers: () => Promise<void>; // Action to fetch all users.
  updateAdminStatus: (uuid: string, isAdmin: boolean) => Promise<void>; // Action to update a user's admin status.
}

/**
 * Creates the Zustand store for admin-level user management.
 */
export const useAdminStore = create<AdminState>((set, get) => ({
  // Initial state
  users: [],
  loading: false,
  error: null,

  /**
   * Fetches all users from the admin service.
   */
  fetchAllUsers: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const users = await adminService.getAllClients();
      set({ users, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  /**
   * Updates the admin status of a specific user.
   * @param {string} uuid - The UUID of the user to update.
   * @param {boolean} isAdmin - The new admin status to set.
   */
  updateAdminStatus: async (uuid: string, isAdmin: boolean) => {
    try {
      const updatedUser = await adminService.updateUserAdminStatus(uuid, isAdmin);
      set((state) => ({
        users: state.users.map((u) => (u.uuid === uuid ? { ...u, is_admin: isAdmin } : u)),
      }));
    } catch (error) {
      console.error('Failed to update admin status:', error);
      throw error; // Re-throw to be handled by the UI component.
    }
  },
}));
