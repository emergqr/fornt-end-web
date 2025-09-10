'use client';

import { create } from 'zustand';
import api from '@/services/api';
import { getApiErrorMessage } from '@/services/apiErrors';
import { TimelineItemRead } from '@/interfaces/client/medical-history.interface';

/**
 * @file This file defines the Zustand store for managing the user's unified medical timeline.
 * It fetches and holds a chronological list of all major health events.
 */

/**
 * Interface defining the shape of the timeline state.
 */
interface TimelineState {
    timeline: TimelineItemRead[]; // An array holding the unified timeline items.
    loading: boolean; // Flag to indicate loading state.
    error: string | null; // Holds any error message from API calls.
}

/**
 * Interface defining the actions available in the timeline store.
 */
interface TimelineActions {
    fetchTimeline: () => Promise<void>; // Action to fetch the unified timeline data.
}

// Initial state for the timeline store.
const initialState: TimelineState = {
    timeline: [],
    loading: false,
    error: null,
};

/**
 * Creates the Zustand store for the unified medical timeline.
 */
export const useTimelineStore = create<TimelineState & TimelineActions>((set) => ({
    ...initialState,

    /**
     * Fetches the unified medical timeline for the authenticated user.
     * This endpoint consolidates various medical records (allergies, diseases, events, etc.)
     * into a single, chronologically sorted list.
     */
    fetchTimeline: async () => {
        set({ loading: true, error: null });
        try {
            const response = await api.get<TimelineItemRead[]>('/medical-history/timeline');
            set({ timeline: response.data, loading: false });
        } catch (error) {
            const errorMessage = getApiErrorMessage(error);
            set({ error: errorMessage, loading: false });
        }
    },
}));
