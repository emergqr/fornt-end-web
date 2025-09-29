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

interface AllergyState {
  allergies: AllergyRead[];
  categories: AllergyCategory[];
  loading: boolean;
  isFetchingCategories: boolean;
  error: string | null;
  fetchMyAllergies: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addAllergy: (data: AllergyCreate) => Promise<AllergyRead>;
  addAllergyFromCode: (data: AllergyCreateFromCode) => Promise<void>;
  editAllergy: (uuid: string, data: AllergyUpdate) => Promise<AllergyRead>;
  removeAllergy: (uuid: string) => Promise<void>;
  addNewReaction: (allergyUuid: string, data: ReactionHistoryCreate) => Promise<void>;
  clearError: () => void;
}

export const useAllergyStore = create<AllergyState>((set, get) => ({
  allergies: [],
  categories: [],
  loading: false,
  isFetchingCategories: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchCategories: async () => {
    if (get().isFetchingCategories || get().categories.length > 0) return; // Avoid refetching
    set({ isFetchingCategories: true, error: null });
    try {
      // 1. Fetch the raw data, which is a string array (e.g., ["Foods", "Insects"]).
      const rawCategoryNames = await allergyService.getAllergyCategories();

      // 2. Filter out invalid, empty, or whitespace-only strings.
      const validNames = rawCategoryNames
        .map(name => name && name.trim())
        .filter(name => name);

      // 3. Get unique names to prevent key errors in React.
      const uniqueNames = [...new Set(validNames)];

      // 4. Transform the clean string array into the object structure the app expects: { name: string }[]
      const finalCategories = uniqueNames.map(name => ({ name }));

      set({ categories: finalCategories, isFetchingCategories: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, isFetchingCategories: false });
    }
  },

  fetchMyAllergies: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const allergies = await allergyService.getMyAllergies();
      set({ allergies, loading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
    }
  },

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
