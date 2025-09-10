'use client';

/**
 * @file This file defines the Zustand store for managing the state of the Panic Button feature.
 * It handles the loading and error states related to triggering a panic alert.
 */

import { create } from 'zustand';
import { panicService } from '@/services/client/panicService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * Interface defining the shape of the panic button state and its actions.
 */
interface PanicState {
  isLoading: boolean; // Flag to indicate if the panic alert is currently being sent.
  error: string | null; // Holds any error message from the API call.
  triggerPanic: () => Promise<void>; // Action to trigger the panic alert.
}

/**
 * Creates the Zustand store for Panic Button functionality.
 */
export const usePanicStore = create<PanicState>((set) => ({
  // Initial state
  isLoading: false,
  error: null,

  /**
   * Triggers the panic alert by calling the corresponding service.
   * It manages the loading and error states for the operation.
   */
  triggerPanic: async () => {
    set({ isLoading: true, error: null });
    try {
      await panicService.triggerPanicAlert();
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isLoading: false, error: errorMessage });
      // Re-throw the error so the UI component can catch it and display feedback.
      throw new Error(errorMessage);
    }
  },
}));
