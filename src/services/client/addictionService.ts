'use client';

/**
 * @file This file provides a service layer for interacting with the addiction-related API endpoints.
 */

import api from '@/services/api';
import {
  AddictionRead,
  AddictionCreate,
  AddictionUpdate,
} from '@/interfaces/client/addiction.interface';

// The base URL for all addiction-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_ADDICTIONS_BASE_URL || '/addictions/addictions';

/**
 * Fetches the list of addictions for the authenticated client.
 * @returns {Promise<AddictionRead[]>} A promise that resolves with an array of the client's addictions.
 */
const getMyAddictions = async (): Promise<AddictionRead[]> => {
  const response = await api.get<AddictionRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new addiction for the authenticated client.
 * @param {AddictionCreate} data - The data for the new addiction.
 * @returns {Promise<AddictionRead>} A promise that resolves with the newly created addiction data.
 */
const createAddiction = async (data: AddictionCreate): Promise<AddictionRead> => {
  const response = await api.post<AddictionRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing addiction by its UUID.
 * @param {string} uuid - The unique identifier of the addiction to update.
 * @param {AddictionUpdate} data - An object containing the addiction fields to update.
 * @returns {Promise<AddictionRead>} A promise that resolves with the updated addiction data.
 */
const updateAddiction = async (
  uuid: string,
  data: AddictionUpdate
): Promise<AddictionRead> => {
  const response = await api.put<AddictionRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an addiction by its UUID.
 * @param {string} uuid - The unique identifier of the addiction to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteAddiction = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const addictionService = {
  getMyAddictions,
  createAddiction,
  updateAddiction,
  deleteAddiction,
};
