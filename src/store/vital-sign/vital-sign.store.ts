'use client';

import { create } from 'zustand';
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '@/interfaces/client/vital-sign.interface';
import { vitalSignService } from '@/services/client/vitalSignService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * @file This file defines the Zustand store for managing the user's vital signs.
 * It handles state and actions for fetching, creating, updating, and deleting vital sign records.
 */

interface VitalSignState {
  vitalSigns: VitalSignRead[];
  types: string[];
  loading: boolean;
  error: string | null;
  fetchMyVitalSigns: () => Promise<void>;
  fetchVitalSignTypes: () => Promise<void>;
  addVitalSign: (data: VitalSignCreate) => Promise<void>;
  editVitalSign: (uuid: string, data: VitalSignUpdate) => Promise<void>;
  removeVitalSign: (uuid: string) => Promise<void>;
  clearError: () => void;
}

export const useVitalSignStore = create<VitalSignState>((set, get) => ({
  vitalSigns: [],
  types: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyVitalSigns: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const vitalSigns = await vitalSignService.getMyVitalSigns();
      set({ vitalSigns, loading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage, loading: false });
    }
  },

  fetchVitalSignTypes: async () => {
    if (get().types.length > 0) return;
    try {
      const types = await vitalSignService.getVitalSignTypes();
      set({ types });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
    }
  },

  addVitalSign: async (data: VitalSignCreate) => {
    set({ error: null });
    try {
      const newSign = await vitalSignService.createVitalSign(data);
      set((state) => ({
        vitalSigns: [...state.vitalSigns, newSign].sort(
          (a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()
        ),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  editVitalSign: async (uuid: string, data: VitalSignUpdate) => {
    set({ error: null });
    try {
      const updatedSign = await vitalSignService.updateVitalSign(uuid, data);
      set((state) => ({
        vitalSigns: state.vitalSigns
          .map((s) => (s.uuid === uuid ? updatedSign : s))
          .sort((a, b) => new Date(b.measured_at).getTime() - new Date(a.measured_at).getTime()),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  removeVitalSign: async (uuid: string) => {
    try {
      await vitalSignService.deleteVitalSign(uuid);
      set((state) => ({
        vitalSigns: state.vitalSigns.filter((s) => s.uuid !== uuid),
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
