'use client';

/**
 * @file This file defines the Zustand store for managing the user's addictions.
 * It handles state and actions for fetching, creating, updating, and deleting addiction records.
 */

import { create } from 'zustand';
import {
  AddictionRead,
  AddictionCreate,
  AddictionUpdate,
} from '@/interfaces/client/addiction.interface';
import { addictionService } from '@/services/client/addictionService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * Interface defining the shape of the addiction state and its associated actions.
 */
interface AddictionState {
  addictions: AddictionRead[]; // An array to hold the user's addiction records.
  loading: boolean; // Flag to indicate loading state during async operations.
  error: string | null; // Holds any error message from API calls.
  fetchAddictions: () => Promise<void>; // Action to fetch all addictions.
  addAddiction: (data: AddictionCreate) => Promise<void>; // Action to add a new addiction.
  updateAddiction: (uuid: string, data: AddictionUpdate) => Promise<void>; // Action to update an existing addiction.
  removeAddiction: (uuid: string) => Promise<void>; // Action to delete an addiction.
}

/**
 * Creates the Zustand store for addiction management.
 */
export const useAddictionStore = create<AddictionState>((set, get) => ({
  // Initial state
  addictions: [],
  loading: false,
  error: null,

  /**
   * Fetches all addiction records for the authenticated user from the API.
   */
  fetchAddictions: async () => {
    if (get().loading) return; // Prevent re-fetching if already loading.
    set({ loading: true, error: null });
    try {
      const addictions = await addictionService.getMyAddictions();
      set({ addictions, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  /**
   * Creates a new addiction record.
   * @param {AddictionCreate} data - The data for the new addiction.
   */
  addAddiction: async (data: AddictionCreate) => {
    try {
      const newAddiction = await addictionService.createAddiction(data);
      set((state) => ({
        addictions: [...state.addictions, newAddiction].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()),
      }));
    } catch (error) {
      console.error('Failed to add addiction:', error);
      throw error; // Re-throw to be handled by the UI component.
    }
  },

  /**
   * Updates an existing addiction record.
   * @param {string} uuid - The UUID of the addiction to update.
   * @param {AddictionUpdate} data - The updated addiction data.
   */
  updateAddiction: async (uuid: string, data: AddictionUpdate) => {
    try {
      const updatedAddiction = await addictionService.updateAddiction(uuid, data);
      set((state) => ({
        addictions: state.addictions.map((a) => (a.uuid === uuid ? updatedAddiction : a)),
      }));
    } catch (error) {
      console.error('Failed to update addiction:', error);
      throw error;
    }
  },

  /**
   * Deletes an addiction record.
   * @param {string} uuid - The UUID of the addiction to delete.
   */
  removeAddiction: async (uuid: string) => {
    try {
      await addictionService.deleteAddiction(uuid);
      set((state) => ({ addictions: state.addictions.filter((a) => a.uuid !== uuid) }));
    } catch (error) {
      console.error('Failed to delete addiction:', error);
      throw error;
    }
  },
}));
