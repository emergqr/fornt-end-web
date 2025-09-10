'use client';

import { create } from 'zustand';
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
  DiseaseCreateFromCode,
} from '@/interfaces/client/disease.interface';
import { diseaseService } from '@/services/client/diseaseService';

/**
 * @file This file defines the Zustand store for managing the user's medical conditions (diseases).
 * It handles state and actions for fetching, adding, updating, and deleting conditions.
 */

/**
 * Interface defining the shape of the disease state and its associated actions.
 */
interface DiseaseState {
  diseases: PatientDiseaseRead[]; // An array to hold the user's diagnosed conditions.
  loading: boolean; // Flag for the loading state of the user's specific disease list.
  error: string | null; // Holds any error message from API calls.
  masterList: DiseaseRead[]; // A master list of all available diseases in the system (for search/autocomplete).
  masterListLoading: boolean; // Loading state specifically for the master list.
  fetchMyDiseases: () => Promise<void>; // Action to fetch the user's diagnosed conditions.
  addDisease: (data: PatientDiseaseCreate) => Promise<void>; // Action to add a disease manually (if applicable).
  addDiseaseFromCode: (data: DiseaseCreateFromCode) => Promise<void>; // Action to add a disease from a standardized code.
  editDisease: (uuid: string, data: PatientDiseaseUpdate) => Promise<void>; // Action to update a diagnosed condition.
  removeDisease: (uuid: string) => Promise<void>; // Action to remove a diagnosed condition.
  fetchMasterList: () => Promise<void>; // Action to fetch the master list of all diseases.
  clearError: () => void; // Action to clear any existing error messages.
}

/**
 * Creates the Zustand store for disease management.
 */
export const useDiseaseStore = create<DiseaseState>((set, get) => ({
  // Initial state
  diseases: [],
  loading: false,
  error: null,
  masterList: [],
  masterListLoading: false,

  // --- ACTIONS ---

  /**
   * Clears the current error message from the state.
   */
  clearError: () => set({ error: null }),

  /**
   * Fetches the list of diagnosed conditions for the authenticated user.
   */
  fetchMyDiseases: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const diseases = await diseaseService.getMyDiseases();
      set({ diseases, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch diseases', loading: false });
    }
  },

  /**
   * Adds a new disease association for the user.
   * @param {PatientDiseaseCreate} data - The data for the new disease association.
   */
  addDisease: async (data: PatientDiseaseCreate) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDisease(data);
      // Add the new disease and re-sort the list by diagnosis date.
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add disease' });
      throw e;
    }
  },

  /**
   * Creates a new disease association from a standardized medical code.
   * @param {DiseaseCreateFromCode} data - The data containing the code, name, source, and diagnosis details.
   */
  addDiseaseFromCode: async (data: DiseaseCreateFromCode) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDiseaseFromCode(data);
      // Add the new disease and re-sort the list.
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add disease from code' });
      throw e;
    }
  },

  /**
   * Updates an existing disease association.
   * @param {string} uuid - The UUID of the patient-disease association to update.
   * @param {PatientDiseaseUpdate} data - The updated data.
   */
  editDisease: async (uuid: string, data: PatientDiseaseUpdate) => {
    set({ error: null });
    try {
      const updatedDisease = await diseaseService.updateDisease(uuid, data);
      // Update the specific disease in the list and re-sort.
      set((state) => ({
        diseases: state.diseases.map((d) => (d.uuid === uuid ? updatedDisease : d)).sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to update disease' });
      throw e;
    }
  },

  /**
   * Removes a disease association from the user's profile.
   * @param {string} uuid - The UUID of the association to remove.
   */
  removeDisease: async (uuid: string) => {
    await diseaseService.deleteDisease(uuid);
    set((state) => ({ diseases: state.diseases.filter((d) => d.uuid !== uuid) }));
  },

  /**
   * Fetches the master list of all available diseases from the API.
   * This is typically used for search or autocomplete features.
   * It prevents re-fetching if the list is already loaded.
   */
  fetchMasterList: async () => {
    if (get().masterListLoading || get().masterList.length > 0) return;
    set({ masterListLoading: true });
    try {
      const masterList = await diseaseService.getDiseasesMasterList();
      set({ masterList, masterListLoading: false });
    } catch (e: any) {
      console.error('Failed to fetch diseases master list:', e.message);
      set({ masterListLoading: false });
    }
  },
}));
