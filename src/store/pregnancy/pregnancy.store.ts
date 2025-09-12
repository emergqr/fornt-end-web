/**
 * @file This file defines the Zustand store for managing user pregnancy records and their associated logs.
 */

import { create } from 'zustand';
import {
  PregnancyRead,
  PregnancyCreate,
  PregnancyUpdate,
  PregnancyLogRead,
  PregnancyLogCreate,
} from '@/interfaces/client/pregnancy.interface';
import { pregnancyService } from '@/services/client/pregnancyService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface PregnancyState {
  // For the main list of pregnancies
  records: PregnancyRead[];
  loading: boolean;
  error: string | null;
  
  // For the detail view of a single pregnancy and its logs
  selectedRecord: PregnancyRead | null;
  recordLogs: PregnancyLogRead[];
  logsLoading: boolean;
  logsError: string | null;

  // Actions
  fetchRecords: () => Promise<void>;
  addRecord: (data: PregnancyCreate) => Promise<void>;
  updateRecord: (uuid: string, data: PregnancyUpdate) => Promise<void>;
  deleteRecord: (uuid: string) => Promise<void>;
  fetchRecordById: (uuid: string) => Promise<void>;
  fetchLogsForRecord: (pregnancyUuid: string) => Promise<void>;
  addLogToRecord: (pregnancyUuid: string, data: PregnancyLogCreate) => Promise<void>;
}

export const usePregnancyStore = create<PregnancyState>((set) => ({
  records: [],
  loading: false,
  error: null,
  selectedRecord: null,
  recordLogs: [],
  logsLoading: false,
  logsError: null,

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
      throw new Error(getApiErrorMessage(error));
    }
  },

  updateRecord: async (uuid: string, data: PregnancyUpdate) => {
    try {
      const updatedRecord = await pregnancyService.updatePregnancyRecord(uuid, data);
      set((state) => ({
        records: state.records.map((record) => (record.uuid === uuid ? updatedRecord : record)),
      }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  deleteRecord: async (uuid: string) => {
    try {
      await pregnancyService.deletePregnancyRecord(uuid);
      set((state) => ({ records: state.records.filter((record) => record.uuid !== uuid) }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  fetchRecordById: async (uuid: string) => {
    set({ loading: true, error: null, selectedRecord: null });
    try {
      // We can find the record from the existing list to avoid an extra API call if not necessary
      // For simplicity here, we assume the main list is comprehensive. A direct API call could also be made.
      const record = usePregnancyStore.getState().records.find(r => r.uuid === uuid);
      set({ selectedRecord: record || null, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  fetchLogsForRecord: async (pregnancyUuid: string) => {
    set({ logsLoading: true, logsError: null });
    try {
      const logs = await pregnancyService.getPregnancyLogs(pregnancyUuid);
      set({ recordLogs: logs, logsLoading: false });
    } catch (error) {
      set({ logsError: getApiErrorMessage(error), logsLoading: false });
    }
  },

  addLogToRecord: async (pregnancyUuid: string, data: PregnancyLogCreate) => {
    try {
      const newLog = await pregnancyService.createPregnancyLog(pregnancyUuid, data);
      set((state) => ({ recordLogs: [...state.recordLogs, newLog] }));
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },
}));
