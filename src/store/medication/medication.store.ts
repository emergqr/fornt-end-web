'use client';

import { create } from 'zustand';
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
  MedicationScheduleUpdate,
} from '@/interfaces/client/medication.interface';
import { medicationService } from '@/services/client/medicationService';

/**
 * @file This file defines the Zustand store for managing the user's medication schedules.
 * It handles state and actions for fetching, creating, updating, and deleting schedules.
 */

/**
 * Interface defining the shape of the medication state and its associated actions.
 */
interface MedicationState {
  schedules: MedicationScheduleRead[]; // An array to hold the user's medication schedules.
  loading: boolean; // Flag to indicate loading state during async operations.
  error: string | null; // Holds any error message from API calls.
  fetchSchedules: () => Promise<void>; // Action to fetch all medication schedules.
  addSchedule: (data: MedicationScheduleCreate) => Promise<void>; // Action to add a new schedule.
  updateSchedule: (uuid: string, data: MedicationScheduleUpdate) => Promise<void>; // Action to update an existing schedule.
  deleteSchedule: (uuid: string) => Promise<void>; // Action to delete a schedule.
}

/**
 * Creates the Zustand store for medication schedule management.
 */
export const useMedicationStore = create<MedicationState>((set) => ({
  // Initial state
  schedules: [],
  loading: false,
  error: null,

  /**
   * Fetches all medication schedules for the authenticated user from the API.
   */
  fetchSchedules: async () => {
    set({ loading: true, error: null });
    try {
      const schedules = await medicationService.getMySchedules();
      set({ schedules, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      set({ loading: false, error: errorMessage });
    }
  },

  /**
   * Creates a new medication schedule.
   * @param {MedicationScheduleCreate} data - The data for the new schedule.
   */
  addSchedule: async (data: MedicationScheduleCreate) => {
    try {
      set({ loading: true, error: null });
      const newSchedule = await medicationService.createSchedule(data);
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add medication';
      set({ loading: false, error: errorMessage });
      throw error; // Re-throw the error to be handled by the UI component.
    }
  },

  /**
   * Updates an existing medication schedule.
   * @param {string} uuid - The UUID of the schedule to update.
   * @param {MedicationScheduleUpdate} data - The updated schedule data.
   */
  updateSchedule: async (uuid: string, data: MedicationScheduleUpdate) => {
    try {
      set({ loading: true, error: null });
      const updatedSchedule = await medicationService.updateSchedule(uuid, data);
      set((state) => ({
        schedules: state.schedules.map((s) => (s.uuid === uuid ? updatedSchedule : s)),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update medication';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },

  /**
   * Deletes a medication schedule.
   * @param {string} uuid - The UUID of the schedule to delete.
   */
  deleteSchedule: async (uuid: string) => {
    try {
      set({ loading: true, error: null });
      await medicationService.deleteSchedule(uuid);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.uuid !== uuid),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete medication';
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },
}));
