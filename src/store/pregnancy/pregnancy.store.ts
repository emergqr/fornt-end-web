/**
 * @file This file defines the Zustand store for managing user pregnancy records.
 */

import { create } from 'zustand';
import {
  PregnancyRead,
  PregnancyCreate,
  PregnancyUpdate,
} from '@/interfaces/client/pregnancy.interface';
import { pregnancyService } from '@/services/client/pregnancyService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface PregnancyState {
  records: PregnancyRead[];
  loading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  addRecord: (data: PregnancyCreate) => Promise<void>;
  updateRecord: (uuid: string, data: PregnancyUpdate) => Promise<void>;
  deleteRecord: (uuid: string) => Promise<void>;
}

export const usePregnancyStore = create<PregnancyState>((set) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async () => {
    set({ loading: true, error: null });
    try {
      const records = await pregnancyService.getMyPregnancyRecords();
      set({ records, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  addRecord: async (data: PregnancyCreate) => {
    try {
      const newRecord = await pregnancyService.createPregnancyRecord(data);
      set((state) => ({ records: [...state.records, newRecord] }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  updateRecord: async (uuid: string, data: PregnancyUpdate) => {
    try {
      const updatedRecord = await pregnancyService.updatePregnancyRecord(uuid, data);
      set((state) => ({
        records: state.records.map((record) =>
          record.uuid === uuid ? updatedRecord : record
        ),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  deleteRecord: async (uuid: string) => {
    try {
      await pregnancyService.deletePregnancyRecord(uuid);
      set((state) => ({
        records: state.records.filter((record) => record.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },
}));
