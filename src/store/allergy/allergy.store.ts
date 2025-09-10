'use client';

import { create } from 'zustand';
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
  AllergyCreateFromCode,
} from '@/interfaces/client/allergy.interface';
import { allergyService } from '@/services/client/allergyService';

/**
 * @file This file defines the Zustand store for managing the user's allergies.
 * It handles state and actions for fetching, adding, updating, and deleting allergies,
 * including functionality to add allergies from standardized medical codes.
 */

/**
 * Interface defining the shape of the allergy state and its associated actions.
 */
interface AllergyState {
  allergies: AllergyRead[]; // An array to hold the user's allergy records.
  loading: boolean; // Flag to indicate loading state during async operations.
  error: string | null; // Holds any error message from API calls.
  fetchMyAllergies: () => Promise<void>; // Action to fetch all allergies for the current user.
  addAllergy: (data: AllergyCreate) => Promise<AllergyRead>; // Action to add a new allergy manually.
  addAllergyFromCode: (data: AllergyCreateFromCode) => Promise<void>; // Action to add an allergy using a standardized code (e.g., SNOMED).
  editAllergy: (uuid: string, data: AllergyUpdate) => Promise<AllergyRead>; // Action to update an existing allergy.
  removeAllergy: (uuid: string) => Promise<void>; // Action to delete an allergy.
  addNewReaction: (allergyUuid: string, data: ReactionHistoryCreate) => Promise<void>; // Action to add a reaction to an allergy.
  clearError: () => void; // Action to clear any existing error messages.
}

/**
 * Creates the Zustand store for allergy management.
 */
export const useAllergyStore = create<AllergyState>((set, get) => ({
  // Initial state
  allergies: [],
  loading: false,
  error: null,

  /**
   * Clears the current error message from the state.
   */
  clearError: () => set({ error: null }),

  /**
   * Fetches all allergies for the authenticated user from the API.
   */
  fetchMyAllergies: async () => {
    if (get().loading) return; // Prevent fetching if already in progress.
    set({ loading: true, error: null });
    try {
      const allergies = await allergyService.getMyAllergies();
      set({ allergies, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch allergies', loading: false });
    }
  },

  /**
   * Creates a new allergy record manually.
   * @param {AllergyCreate} data - The data for the new allergy.
   * @returns {Promise<AllergyRead>} The newly created allergy record.
   */
  addAllergy: async (data: AllergyCreate) => {
    set({ loading: true, error: null });
    try {
      const newAllergy = await allergyService.createAllergy(data);
      set((state) => ({ allergies: [...state.allergies, newAllergy], loading: false }));
      return newAllergy;
    } catch (e: any) {
      set({ error: e.message || 'Failed to add allergy', loading: false });
      throw e;
    }
  },

  /**
   * Creates a new allergy from a standardized medical code.
   * @param {AllergyCreateFromCode} data - The data containing the code, name, and source.
   */
  addAllergyFromCode: async (data: AllergyCreateFromCode) => {
    set({ error: null });
    try {
      const newAllergy = await allergyService.createAllergyFromCode(data);
      set((state) => ({ allergies: [...state.allergies, newAllergy] }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add allergy from code' });
      throw e;
    }
  },

  /**
   * Updates an existing allergy.
   * @param {string} uuid - The UUID of the allergy to update.
   * @param {AllergyUpdate} data - The updated allergy data.
   * @returns {Promise<AllergyRead>} The updated allergy record.
   */
  editAllergy: async (uuid: string, data: AllergyUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedAllergy = await allergyService.updateAllergy(uuid, data);
      set((state) => ({
        allergies: state.allergies.map((a) => (a.uuid === uuid ? updatedAllergy : a)),
        loading: false,
      }));
      return updatedAllergy;
    } catch (e: any) {
      set({ error: e.message || 'Failed to update allergy', loading: false });
      throw e;
    }
  },

  /**
   * Deletes an allergy from the user's profile.
   * @param {string} uuid - The UUID of the allergy to delete.
   */
  removeAllergy: async (uuid: string) => {
    try {
      await allergyService.deleteAllergy(uuid);
      set((state) => ({ allergies: state.allergies.filter((a) => a.uuid !== uuid) }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete allergy' });
      throw e;
    }
  },

  /**
   * Adds a new reaction history record to an existing allergy.
   * @param {string} allergyUuid - The UUID of the allergy to add the reaction to.
   * @param {ReactionHistoryCreate} data - The data for the new reaction.
   */
  addNewReaction: async (allergyUuid: string, data: ReactionHistoryCreate) => {
    try {
      const updatedAllergy = await allergyService.addReactionToAllergy(allergyUuid, data);
      set((state) => ({
        allergies: state.allergies.map((a) => (a.uuid === allergyUuid ? updatedAllergy : a)),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add reaction' });
      throw e;
    }
  },
}));
