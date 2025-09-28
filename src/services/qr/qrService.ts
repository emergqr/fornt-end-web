'use client';

/**
 * @file This file provides a service for QR code management.
 * It is the single source of truth for constructing the QR code URL string
 * using base URL and path from environment variables.
 */

/**
 * Constructs the full public URL to be encoded in the QR code.
 * @param {string} uuid - The user's unique identifier.
 * @returns {Promise<{ qrString: string }>} A promise that resolves with an object containing the full QR URL string.
 * @throws {Error} If the user UUID is not provided or environment variables are missing.
 */
const getMyQR = async (uuid: string): Promise<{ qrString: string }> => {
    if (!uuid) {
        throw new Error('User UUID is required to generate a QR code.');
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const qrProfilePath = process.env.NEXT_PUBLIC_QR_PROFILE_PATH;

    if (!appBaseUrl || !qrProfilePath) {
        console.error('Environment variables NEXT_PUBLIC_APP_BASE_URL or NEXT_PUBLIC_QR_PROFILE_PATH are not set.');
        throw new Error('Application is not configured correctly to generate QR codes.');
    }

    // Construct the full URL from environment variables.
    const qrString = `${appBaseUrl}/${qrProfilePath}/${uuid}`;
    
    return { qrString };
};

/**
 * Regenerates the user's QR code string.
 * @param {string} uuid - The user's unique identifier.
 * @returns {Promise<{ qrString: string }>} A promise that resolves with the regenerated QR string.
 */
const regenerateMyQR = async (uuid: string): Promise<{ qrString:string }> => {
    // This is functionally the same as getMyQR, but provides a separate endpoint for clarity.
    return getMyQR(uuid);
};

/**
 * An object that groups all QR code-related service functions for easy import and usage.
 */
export const qrService = {
    getMyQR,
    regenerateMyQR,
};