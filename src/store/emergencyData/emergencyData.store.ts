'use client';

import { create } from 'zustand';
import {
  EmergencyDataRead,
  EmergencyDataUpdate,
} from '@/interfaces/client/emergency-data.interface';
import { emergencyDataService } from '@/services/client/emergencyDataService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface EmergencyDataState {
  data: EmergencyDataRead | null;
  loading: boolean;
  error: string | null;
  fetchEmergencyData: () => Promise<void>;
  updateEmergencyData: (data: EmergencyDataUpdate) => Promise<void>;
}

export const useEmergencyDataStore = create<EmergencyDataState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchEmergencyData: async () => {
    set({ loading: true, error: null });
    try {
      const emergencyData = await emergencyDataService.getEmergencyData();
      set({ data: emergencyData, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  updateEmergencyData: async (data: EmergencyDataUpdate) => {
    try {
      const updatedData = await emergencyDataService.updateEmergencyData(data);
      set({ data: updatedData, error: null });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },
}));
