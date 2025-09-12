'use client';

/**
 * @file This file defines the Zustand store for managing the upcoming reminders widget data.
 */

import { create } from 'zustand';
import { UpcomingReminder } from '@/interfaces/client/analytics.interface';
import { analyticsService } from '@/services/client/analyticsService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface RemindersState {
  reminders: UpcomingReminder[];
  loading: boolean;
  error: string | null;
  fetchReminders: () => Promise<void>;
}

export const useRemindersStore = create<RemindersState>((set) => ({
  reminders: [],
  loading: false,
  error: null,

  fetchReminders: async () => {
    set({ loading: true, error: null });
    try {
      const reminders = await analyticsService.getUpcomingReminders();
      set({ reminders, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },
}));
