'use client';

/**
 * @file This file defines the Zustand store for managing the health summary widget data.
 */

import { create } from 'zustand';
import { HealthSummary } from '@/interfaces/client/analytics.interface';
import { analyticsService } from '@/services/client/analyticsService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface SummaryState {
  summary: HealthSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
}

export const useSummaryStore = create<SummaryState>((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const summary = await analyticsService.getHealthSummary();
      set({ summary, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },
}));
