'use client';

import { create } from 'zustand';
import api from '@/services/api';
import { getApiErrorMessage } from '@/services/apiErrors';
import { TimelineItemRead } from '@/interfaces/client/medical-history.interface';

interface TimelineState {
    timeline: TimelineItemRead[];
    loading: boolean;
    error: string | null;
}

interface TimelineActions {
    fetchTimeline: () => Promise<void>;
}

const initialState: TimelineState = {
    timeline: [],
    loading: false,
    error: null,
};

export const useTimelineStore = create<TimelineState & TimelineActions>((set) => ({
    ...initialState,

    /**
     * Obtiene la línea de tiempo unificada del historial médico del usuario.
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
