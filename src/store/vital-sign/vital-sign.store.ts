'use client';

import { create } from 'zustand';
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '@/interfaces/client/vital-sign.interface';
import { vitalSignService } from '@/services/client/vitalSignService';

/**
 * @file This file defines the Zustand store for managing the user's vital signs.
 * It handles state and actions for fetching, creating, updating, and deleting vital sign records.
 */

/**
 * Interface defining the shape of the vital sign state and its associated actions.
 */
interface VitalSignState {
  vitalSigns: VitalSignRead[]; // An array to hold the user's vital sign records.
  types: string[]; // An array of available vital sign types (e.g., 'Blood Pressure', 'Heart Rate').
  loading: boolean; // Flag to indicate loading state during async operations.
  error: string | null; // Holds any error message from API calls.
  fetchMyVitalSigns: () => Promise<void>; // Action to fetch all vital signs for the current user.
  fetchVitalSignTypes: () => Promise<void>; // Action to fetch the master list of vital sign types.
  addVitalSign: (data: VitalSignCreate) => Promise<void>; // Action to add a new vital sign record.
  editVitalSign: (uuid: string, data: VitalSignUpdate) => Promise<void>; // Action to update an existing record.
  removeVitalSign: (uuid: string) => Promise<void>; // Action to delete a record.
  clearError: () => void; // Action to clear any existing error messages.
}

/**
 * Creates the Zustand store for vital sign management.
 */
export const useVitalSignStore = create<VitalSignState>((set, get) => ({
  // Initial state
  vitalSigns: [],
  types: [],
  loading: false,
  error: null,

  /**
   * Clears the current error message from the state.
   */
  clearError: () => set({ error: null }),

  /**
   * Fetches all vital sign records for the authenticated user from the API.
   */
  fetchMyVitalSigns: async () => {
    if (get().loading) return; // Prevent re-fetching if already loading.
    set({ loading: true, error: null });
    try {
      const vitalSigns = await vitalSignService.getMyVitalSigns();
      set({ vitalSigns, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  },

  /**
   * Fetches the master list of available vital sign types from the API.
   * It avoids re-fetching if the types are already present in the store.
   */
  fetchVitalSignTypes: async () => {
    if (get().types.length > 0) return;
    try {
      const types = await vitalSignService.getVitalSignTypes();
      set({ types });
    } catch (e: any) {
      console.error('Failed to fetch vital sign types:', e.message);
    }
  },

  /**
   * Adds a new vital sign record.
   * After adding, it re-sorts the list to maintain chronological order.
   * @param {VitalSignCreate} data - The data for the new vital sign.
   */
  addVitalSign: async (data: VitalSignCreate) => {
    set({ error: null });
    try {
      const newSign = await vitalSignService.createVitalSign(data);
      set((state) => ({
        vitalSigns: [...state.vitalSigns, newSign].sort(
          (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
        ),
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  /**
   * Updates an existing vital sign record.
   * @param {string} uuid - The UUID of the record to update.
   * @param {VitalSignUpdate} data - The updated data.
   */
  editVitalSign: async (uuid: string, data: VitalSignUpdate) => {
    set({ error: null });
    try {
      const updatedSign = await vitalSignService.updateVitalSign(uuid, data);
      set((state) => ({
        vitalSigns: state.vitalSigns
          .map((s) => (s.uuid === uuid ? updatedSign : s))
          .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },

  /**
   * Deletes a vital sign record from the user's profile.
   * @param {string} uuid - The UUID of the record to delete.
   */
  removeVitalSign: async (uuid: string) => {
    try {
      await vitalSignService.deleteVitalSign(uuid);
      set((state) => ({
        vitalSigns: state.vitalSigns.filter((s) => s.uuid !== uuid),
      }));
    } catch (e: any) {
      set({ error: e.message });
      throw e;
    }
  },
}));
