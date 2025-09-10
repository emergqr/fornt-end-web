/**
 * @file This file defines the Zustand store for managing user addictions.
 */

import { create } from 'zustand';
import {
  AddictionRead,
  AddictionCreate,
  AddictionUpdate,
} from '@/interfaces/client/addiction.interface';
import { addictionService } from '@/services/client/addictionService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface AddictionState {
  addictions: AddictionRead[];
  loading: boolean;
  error: string | null;
  fetchAddictions: () => Promise<void>;
  addAddiction: (data: AddictionCreate) => Promise<void>;
  updateAddiction: (uuid: string, data: AddictionUpdate) => Promise<void>;
  deleteAddiction: (uuid: string) => Promise<void>;
}

export const useAddictionStore = create<AddictionState>((set, get) => ({
  addictions: [],
  loading: false,
  error: null,

  fetchAddictions: async () => {
    set({ loading: true, error: null });
    try {
      const addictions = await addictionService.getMyAddictions();
      set({ addictions, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  addAddiction: async (data: AddictionCreate) => {
    try {
      const newAddiction = await addictionService.createAddiction(data);
      set((state) => ({ addictions: [...state.addictions, newAddiction] }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  updateAddiction: async (uuid: string, data: AddictionUpdate) => {
    try {
      const updatedAddiction = await addictionService.updateAddiction(uuid, data);
      set((state) => ({
        addictions: state.addictions.map((addiction) =>
          addiction.uuid === uuid ? updatedAddiction : addiction
        ),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  deleteAddiction: async (uuid: string) => {
    try {
      await addictionService.deleteAddiction(uuid);
      set((state) => ({
        addictions: state.addictions.filter((addiction) => addiction.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },
}));
