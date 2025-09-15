'use client';

import { create } from 'zustand';
import { useAuthStore } from '@/store/auth/auth.store';
import { qrService } from '@/services/qr/qrService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * @file This file defines the Zustand store for managing the user's QR code data.
 * It is responsible for fetching the QR code string from the qrService and managing state.
 */

interface QRState {
    qrData: string | null;
    isLoading: boolean;
    error: string | null;
    fetchQR: () => Promise<void>;
    regenerateQR: () => Promise<void>;
}

export const useQRStore = create<QRState>((set, get) => ({
    qrData: null,
    isLoading: true,
    error: null,

    /**
     * Fetches the QR code string by calling the dedicated service.
     */
    fetchQR: async () => {
        set({ isLoading: true, error: null });
        try {
            const user = useAuthStore.getState().user;
            if (!user || !user.uuid) {
                throw new Error('User information is not available.');
            }
            const { qrString } = await qrService.getMyQR(user.uuid);
            set({ qrData: qrString, isLoading: false });
        } catch (error) {
            set({ error: getApiErrorMessage(error), isLoading: false });
        }
    },

    /**
     * Regenerates the QR code string by re-fetching it from the service.
     */
    regenerateQR: async () => {
        // This action is functionally the same as fetchQR but can be used for explicit regeneration.
        await get().fetchQR();
    },
}));
