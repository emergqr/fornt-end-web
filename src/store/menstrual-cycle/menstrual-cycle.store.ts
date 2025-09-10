/**
 * @file This file defines the Zustand store for managing user menstrual cycle logs.
 */

import { create } from 'zustand';
import {
  MenstrualLogRead,
  MenstrualLogCreate,
  MenstrualLogUpdate,
} from '@/interfaces/client/menstrual-cycle.interface';
import { menstrualCycleService } from '@/services/client/menstrualCycleService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface MenstrualCycleState {
  logs: MenstrualLogRead[];
  loading: boolean;
  error: string | null;
  fetchLogs: () => Promise<void>;
  addLog: (data: MenstrualLogCreate) => Promise<void>;
  updateLog: (uuid: string, data: MenstrualLogUpdate) => Promise<void>;
  deleteLog: (uuid: string) => Promise<void>;
}

export const useMenstrualCycleStore = create<MenstrualCycleState>((set) => ({
  logs: [],
  loading: false,
  error: null,

  fetchLogs: async () => {
    set({ loading: true, error: null });
    try {
      const logs = await menstrualCycleService.getMyMenstrualLogs();
      set({ logs, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  addLog: async (data: MenstrualLogCreate) => {
    try {
      const newLog = await menstrualCycleService.createMenstrualLog(data);
      set((state) => ({ logs: [...state.logs, newLog] }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  updateLog: async (uuid: string, data: MenstrualLogUpdate) => {
    try {
      const updatedLog = await menstrualCycleService.updateMenstrualLog(uuid, data);
      set((state) => ({
        logs: state.logs.map((log) =>
          log.uuid === uuid ? updatedLog : log
        ),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },

  deleteLog: async (uuid: string) => {
    try {
      await menstrualCycleService.deleteMenstrualLog(uuid);
      set((state) => ({
        logs: state.logs.filter((log) => log.uuid !== uuid),
      }));
    } catch (error) {
      const message = getApiErrorMessage(error);
      throw new Error(message);
    }
  },
}));
