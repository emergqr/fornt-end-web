'use client';

/**
 * @file This file provides a service layer for interacting with the user's core emergency data API endpoints.
 * It handles fetching and updating critical information like blood type and health system details.
 */

import api from '@/services/api';
import {
  EmergencyDataRead,
  EmergencyDataUpdate,
} from '@/interfaces/client/emergency-data.interface';

// The base URL for all emergency data-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_EMERG_DATA_BASE_URL || '/emerg-data';

/**
 * Fetches the emergency data for the authenticated client.
 * Corresponds to the GET /emerg-data/me endpoint.
 * @returns {Promise<EmergencyDataRead>} A promise that resolves with the user's emergency data.
 */
const getEmergencyData = async (): Promise<EmergencyDataRead> => {
  const response = await api.get<EmergencyDataRead>(`${BASE_URL}/me`);
  return response.data;
};

/**
 * Creates or updates the emergency data for the authenticated client.
 * Corresponds to the PUT /emerg-data/me endpoint.
 * @param {EmergencyDataUpdate} data - An object containing the fields to update.
 * @returns {Promise<EmergencyDataRead>} A promise that resolves with the updated emergency data.
 */
const updateEmergencyData = async (data: EmergencyDataUpdate): Promise<EmergencyDataRead> => {
  const response = await api.put<EmergencyDataRead>(`${BASE_URL}/me`, data);
  return response.data;
};

/**
 * An object that groups all emergency data-related service functions for easy import and usage.
 */
export const emergencyDataService = {
  getEmergencyData,
  updateEmergencyData,
};
