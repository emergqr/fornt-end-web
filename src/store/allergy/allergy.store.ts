'use client';

import { create } from 'zustand';
import {
  AllergyCategory,
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
  AllergyCreateFromCode,
} from '@/interfaces/client/allergy.interface';
import { allergyService } from '@/services/client/allergyService';
import { getApiErrorMessage } from '@/services/apiErrors';

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
  categories: AllergyCategory[]; // An array to hold the available allergy categories.
  loading: boolean; // Flag to indicate loading state during async operations.
  isFetchingCategories: boolean; // Flag for category fetching.
  error: string | null; // Holds any error message from API calls.
  fetchMyAllergies: () => Promise<void>; // Action to fetch all allergies for the current user.
  fetchCategories: () => Promise<void>; // Action to fetch all allergy categories.
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
  categories: [],
  loading: false,
  isFetchingCategories: false,
  error: null,

  /**
   * Clears the current error message from the state.
   */
  clearError: () => set({ error: null }),

  /**
   * Fetches the list of all available allergy categories from the API.
   */
  fetchCategories: async () => {
    if (get().isFetchingCategories) return;
    set({ isFetchingCategories: true, error: null });
    try {
      const categories = await allergyService.getAllergyCategories();
      set({ categories, isFetchingCategories: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, isFetchingCategories: false });
    }
  },

  /**
   * Fetches all allergies for the authenticated user from the API.
   */
  fetchMyAllergies: async () => {
    if (get().loading) return; // Prevent fetching if already in progress.
    set({ loading: true, error: null });
    try {
      const allergies = await allergyService.getMyAllergies();
      set({ allergies, loading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
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
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
