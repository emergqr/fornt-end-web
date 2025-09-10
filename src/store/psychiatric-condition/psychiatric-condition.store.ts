/**
 * @file This file defines the Zustand store for managing user psychiatric conditions.
 */

import { create } from 'zustand';
import {
  PsychiatricConditionRead,
  PsychiatricConditionCreate,
  PsychiatricConditionUpdate,
} from '@/interfaces/client/psychiatric-condition.interface';
import { psychiatricConditionService } from '@/services/client/psychiatricConditionService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface PsychiatricConditionState {
  conditions: PsychiatricConditionRead[];
  loading: boolean;
  error: string | null;
  fetchConditions: () => Promise<void>;
  addCondition: (data: PsychiatricConditionCreate) => Promise<void>;
  updateCondition: (uuid: string, data: PsychiatricConditionUpdate) => Promise<void>;
  deleteCondition: (uuid: string) => Promise<void>;
}

export const usePsychiatricConditionStore = create<PsychiatricConditionState>((set) => ({
  conditions: [],
  loading: false,
  error: null,

  fetchConditions: async () => {
    set({ loading: true, error: null });
    try {
      const conditions = await psychiatricConditionService.getMyPsychiatricConditions();
      set({ conditions, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  addCondition: async (data: PsychiatricConditionCreate) => {
    try {
      const newCondition = await psychiatricConditionService.createPsychiatricCondition(data);
      set((state) => ({ conditions: [...state.conditions, newCondition] }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  updateCondition: async (uuid: string, data: PsychiatricConditionUpdate) => {
    try {
      const updatedCondition = await psychiatricConditionService.updatePsychiatricCondition(uuid, data);
      set((state) => ({
        conditions: state.conditions.map((condition) =>
          condition.uuid === uuid ? updatedCondition : condition
        ),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  deleteCondition: async (uuid: string) => {
    try {
      await psychiatricConditionService.deletePsychiatricCondition(uuid);
      set((state) => ({
        conditions: state.conditions.filter((condition) => condition.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },
}));
