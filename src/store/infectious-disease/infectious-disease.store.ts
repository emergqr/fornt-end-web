/**
 * @file This file defines the Zustand store for managing user infectious diseases.
 */

import { create } from 'zustand';
import {
  InfectiousDiseaseRead,
  InfectiousDiseaseCreate,
  InfectiousDiseaseUpdate,
} from '@/interfaces/client/infectious-disease.interface';
import { infectiousDiseaseService } from '@/services/client/infectiousDiseaseService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface InfectiousDiseaseState {
  diseases: InfectiousDiseaseRead[];
  loading: boolean;
  error: string | null;
  fetchDiseases: () => Promise<void>;
  addDisease: (data: InfectiousDiseaseCreate) => Promise<void>;
  updateDisease: (uuid: string, data: InfectiousDiseaseUpdate) => Promise<void>;
  deleteDisease: (uuid: string) => Promise<void>;
}

export const useInfectiousDiseaseStore = create<InfectiousDiseaseState>((set) => ({
  diseases: [],
  loading: false,
  error: null,

  fetchDiseases: async () => {
    set({ loading: true, error: null });
    try {
      const diseases = await infectiousDiseaseService.getMyInfectiousDiseases();
      set({ diseases, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  addDisease: async (data: InfectiousDiseaseCreate) => {
    try {
      const newDisease = await infectiousDiseaseService.createInfectiousDisease(data);
      set((state) => ({ diseases: [...state.diseases, newDisease] }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  updateDisease: async (uuid: string, data: InfectiousDiseaseUpdate) => {
    try {
      const updatedDisease = await infectiousDiseaseService.updateInfectiousDisease(uuid, data);
      set((state) => ({
        diseases: state.diseases.map((disease) =>
          disease.uuid === uuid ? updatedDisease : disease
        ),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  deleteDisease: async (uuid: string) => {
    try {
      await infectiousDiseaseService.deleteInfectiousDisease(uuid);
      set((state) => ({
        diseases: state.diseases.filter((disease) => disease.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },
}));
