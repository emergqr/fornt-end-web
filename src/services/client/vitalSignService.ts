'use client';

/**
 * @file This file provides a service layer for interacting with the vital sign API endpoints.
 */

import api from '@/services/api';
import { VitalSignRead, VitalSignCreate, VitalSignUpdate } from '@/interfaces/client/vital-sign.interface';

// The full base path for the vital signs API, read from environment variables.
const VITALS_API_PATH = process.env.NEXT_PUBLIC_API_VITALS_PATH || '/vital-signs';

/**
 * Fetches the list of available vital sign types.
 * @returns {Promise<string[]>} A promise that resolves with an array of vital sign types.
 */
const getVitalSignTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>(`${VITALS_API_PATH}/types`);
  return response.data;
};

/**
 * Fetches all vital sign records for the authenticated user.
 * @returns {Promise<VitalSignRead[]>} A promise that resolves with an array of vital sign records.
 */
const getMyVitalSigns = async (): Promise<VitalSignRead[]> => {
  const response = await api.get<VitalSignRead[]>(`${VITALS_API_PATH}/`);
  return response.data;
};

/**
 * Creates a new vital sign record.
 * @param {VitalSignCreate} data - The data for the new vital sign.
 * @returns {Promise<VitalSignRead>} A promise that resolves with the newly created vital sign record.
 */
const createVitalSign = async (data: VitalSignCreate): Promise<VitalSignRead> => {
  const response = await api.post<VitalSignRead>(`${VITALS_API_PATH}/`, data);
  return response.data;
};

/**
 * Updates an existing vital sign record.
 * @param {string} uuid - The UUID of the record to update.
 * @param {VitalSignUpdate} data - The data to update.
 * @returns {Promise<VitalSignRead>} A promise that resolves with the updated vital sign record.
 */
const updateVitalSign = async (uuid: string, data: VitalSignUpdate): Promise<VitalSignRead> => {
  const response = await api.put<VitalSignRead>(`${VITALS_API_PATH}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a vital sign record.
 * @param {string} uuid - The UUID of the record to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteVitalSign = async (uuid: string): Promise<void> => {
  await api.delete(`${VITALS_API_PATH}/${uuid}`);
};

export const vitalSignService = {
  getVitalSignTypes,
  getMyVitalSigns,
  createVitalSign,
  updateVitalSign,
  deleteVitalSign,
};
