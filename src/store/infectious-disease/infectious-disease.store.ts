'use client';

/**
 * @file This file defines the Zustand store for managing the user's infectious diseases.
 * It handles state and actions for fetching, creating, updating, and deleting these records.
 */

import { create } from 'zustand';
import {
  InfectiousDiseaseRead,
  InfectiousDiseaseCreate,
  InfectiousDiseaseUpdate,
} from '@/interfaces/client/infectious-disease.interface';
import { infectiousDiseaseService } from '@/services/client/infectiousDiseaseService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * Interface defining the shape of the infectious disease state and its associated actions.
 */
interface InfectiousDiseaseState {
  infectiousDiseases: InfectiousDiseaseRead[];
  loading: boolean;
  error: string | null;
  fetchInfectiousDiseases: () => Promise<void>;
  addInfectiousDisease: (data: InfectiousDiseaseCreate) => Promise<void>;
  updateInfectiousDisease: (uuid: string, data: InfectiousDiseaseUpdate) => Promise<void>;
  removeInfectiousDisease: (uuid: string) => Promise<void>;
}

/**
 * Creates the Zustand store for infectious disease management.
 */
export const useInfectiousDiseaseStore = create<InfectiousDiseaseState>((set, get) => ({
  // Initial state
  infectiousDiseases: [],
  loading: false,
  error: null,

  /**
   * Fetches all infectious disease records for the authenticated user from the API.
   */
  fetchInfectiousDiseases: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const infectiousDiseases = await infectiousDiseaseService.getMyInfectiousDiseases();
      set({ infectiousDiseases, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  /**
   * Creates a new infectious disease record.
   * @param {InfectiousDiseaseCreate} data - The data for the new record.
   */
  addInfectiousDisease: async (data: InfectiousDiseaseCreate) => {
    try {
      const newDisease = await infectiousDiseaseService.createInfectiousDisease(data);
      set((state) => ({
        infectiousDiseases: [...state.infectiousDiseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (error) {
      console.error('Failed to add infectious disease:', error);
      throw error;
    }
  },

  /**
   * Updates an existing infectious disease record.
   * @param {string} uuid - The UUID of the record to update.
   * @param {InfectiousDiseaseUpdate} data - The updated data.
   */
  updateInfectiousDisease: async (uuid: string, data: InfectiousDiseaseUpdate) => {
    try {
      const updatedDisease = await infectiousDiseaseService.updateInfectiousDisease(uuid, data);
      set((state) => ({
        infectiousDiseases: state.infectiousDiseases.map((d) => (d.uuid === uuid ? updatedDisease : d)),
      }));
    } catch (error) {
      console.error('Failed to update infectious disease:', error);
      throw error;
    }
  },

  /**
   * Deletes an infectious disease record.
   * @param {string} uuid - The UUID of the record to delete.
   */
  removeInfectiousDisease: async (uuid: string) => {
    try {
      await infectiousDiseaseService.deleteInfectiousDisease(uuid);
      set((state) => ({ infectiousDiseases: state.infectiousDiseases.filter((d) => d.uuid !== uuid) }));
    } catch (error) {
      console.error('Failed to delete infectious disease:', error);
      throw error;
    }
  },
}));
