'use client';

import { create } from 'zustand';
import { useAuthStore } from '@/store/auth/auth.store';

/**
 * @file This file defines the Zustand store for managing the user's QR code.
 * It handles the generation of the QR code content, which is the URL to the user's public profile.
 */

/**
 * Interface defining the shape of the QR code state and its actions.
 */
interface QRState {
    qrData: string | null; // The string data to be encoded into the QR code (e.g., a URL).
    isLoading: boolean; // Flag to indicate if the QR data is being generated.
    error: string | null; // Holds any error message if the QR data cannot be generated.
    fetchQR: () => void; // Action to generate or fetch the QR code data.
    regenerateQR: () => void; // Action to regenerate the QR code data.
}

/**
 * Creates the Zustand store for QR code management.
 * The QR code content is generated client-side based on the authenticated user's UUID.
 */
export const useQRStore = create<QRState>((set) => ({
    // Initial state
    qrData: null,
    isLoading: true,
    error: null,

    /**
     * Generates the QR code string using the authenticated user's UUID.
     * It depends on the useAuthStore to get the necessary user information.
     */
    fetchQR: () => {
        set({ isLoading: true, error: null });
        const user = useAuthStore.getState().user;

        if (user && user.uuid) {
            // The QR code content is the URL to the user's public profile.
            const qrString = `https://www.emerqr.com/view/profile/${user.uuid}`;
            set({ qrData: qrString, isLoading: false, error: null });
        } else {
            // This case occurs if the user is not logged in or the profile hasn't been loaded yet.
            set({
                qrData: null,
                isLoading: false,
                error: 'Could not find user information to generate QR code.',
            });
        }
    },

    /**
     * Regenerates the QR code string.
     * In the current implementation, this is functionally identical to fetchQR because the user's UUID is static.
     * Its purpose is to ensure the QR data is up-to-date if the user context were to change.
     */
    regenerateQR: () => {
        set({ isLoading: true, error: null });
        const user = useAuthStore.getState().user;

        if (user && user.uuid) {
            const qrString = `https://www.emerqr.com/view/profile/${user.uuid}`;
            set({ qrData: qrString, isLoading: false, error: null });
        } else {
            set({
                qrData: null,
                isLoading: false,
                error: 'Could not find user information to regenerate QR code.',
            });
        }
    },
}));
