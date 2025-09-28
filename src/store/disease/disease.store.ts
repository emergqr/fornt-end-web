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
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * @file This file defines the Zustand store for managing the user's medical conditions (diseases).
 * It handles state and actions for fetching, adding, updating, and deleting conditions.
 */

interface DiseaseState {
  diseases: PatientDiseaseRead[];
  loading: boolean;
  error: string | null;
  masterList: DiseaseRead[];
  masterListLoading: boolean;
  fetchMyDiseases: () => Promise<void>;
  addDisease: (data: PatientDiseaseCreate) => Promise<void>;
  addDiseaseFromCode: (data: DiseaseCreateFromCode) => Promise<void>;
  editDisease: (uuid: string, data: PatientDiseaseUpdate) => Promise<void>;
  removeDisease: (uuid: string) => Promise<void>;
  fetchMasterList: () => Promise<void>;
  clearError: () => void;
}

export const useDiseaseStore = create<DiseaseState>((set, get) => ({
  diseases: [],
  loading: false,
  error: null,
  masterList: [],
  masterListLoading: false,

  clearError: () => set({ error: null }),

  fetchMyDiseases: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const diseases = await diseaseService.getMyDiseases();
      set({ diseases, loading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
    }
  },

  addDisease: async (data: PatientDiseaseCreate) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDisease(data);
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  addDiseaseFromCode: async (data: DiseaseCreateFromCode) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDiseaseFromCode(data);
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  editDisease: async (uuid: string, data: PatientDiseaseUpdate) => {
    set({ error: null });
    try {
      const updatedDisease = await diseaseService.updateDisease(uuid, data);
      set((state) => ({
        diseases: state.diseases.map((d) => (d.uuid === uuid ? updatedDisease : d)).sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  removeDisease: async (uuid: string) => {
    try {
      await diseaseService.deleteDisease(uuid);
      set((state) => ({ diseases: state.diseases.filter((d) => d.uuid !== uuid) }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  fetchMasterList: async () => {
    if (get().masterListLoading || get().masterList.length > 0) return;
    set({ masterListLoading: true, error: null });
    try {
      const masterList = await diseaseService.getDiseasesMasterList();
      set({ masterList, masterListLoading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, masterListLoading: false });
    }
  },
}));
