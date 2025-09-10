'use client';

/**
 * @file This file provides a service layer for the Panic Button functionality.
 * It encapsulates the API call to trigger an emergency alert.
 */

import api from '@/services/api';

// The base URL for the panic button API endpoint.
const BASE_URL = '/panic/panic';

/**
 * Triggers the panic alert for the authenticated user.
 * This will notify all designated emergency contacts.
 * Corresponds to the POST /panic/panic/trigger endpoint.
 * @returns {Promise<void>} A promise that resolves when the alert has been successfully triggered.
 */
const triggerPanicAlert = async (): Promise<void> => {
  // This endpoint might not return a body, so we expect a 204 status on success.
  await api.post(`${BASE_URL}/trigger`);
};

/**
 * An object that groups all panic-related service functions.
 */
export const panicService = {
  triggerPanicAlert,
};
