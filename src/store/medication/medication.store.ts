'use client';

import { create } from 'zustand';
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
  MedicationScheduleUpdate,
} from '@/interfaces/client/medication.interface';
import { medicationService } from '@/services/client/medicationService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * @file This file defines the Zustand store for managing the user's medication schedules.
 * It handles state and actions for fetching, creating, updating, and deleting schedules.
 */

interface MedicationState {
  schedules: MedicationScheduleRead[];
  loading: boolean;
  error: string | null;
  fetchSchedules: () => Promise<void>;
  addSchedule: (data: MedicationScheduleCreate) => Promise<void>;
  updateSchedule: (uuid: string, data: MedicationScheduleUpdate) => Promise<void>;
  deleteSchedule: (uuid: string) => Promise<void>;
  clearError: () => void;
}

export const useMedicationStore = create<MedicationState>((set) => ({
  schedules: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const schedules = await medicationService.getMySchedules();
      set({ schedules, loading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ loading: false, error: errorMessage });
    }
  },

  addSchedule: async (data: MedicationScheduleCreate) => {
    try {
      set({ loading: true, error: null });
      const newSchedule = await medicationService.createSchedule(data);
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateSchedule: async (uuid: string, data: MedicationScheduleUpdate) => {
    try {
      set({ loading: true, error: null });
      const updatedSchedule = await medicationService.updateSchedule(uuid, data);
      set((state) => ({
        schedules: state.schedules.map((s) => (s.uuid === uuid ? updatedSchedule : s)),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteSchedule: async (uuid: string) => {
    try {
      set({ loading: true, error: null });
      await medicationService.deleteSchedule(uuid);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.uuid !== uuid),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ loading: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
