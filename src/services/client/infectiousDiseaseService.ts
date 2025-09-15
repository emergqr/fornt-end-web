'use client';

/**
 * @file This file provides a service layer for interacting with the infectious disease-related API endpoints.
 */

import api from '@/services/api';
import {
  InfectiousDiseaseRead,
  InfectiousDiseaseCreate,
  InfectiousDiseaseUpdate,
} from '@/interfaces/client/infectious-disease.interface';

// The base URL for all infectious disease-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_INFECTIOUS_DISEASES_BASE_URL || '/infectious-diseases/infectious-diseases';

/**
 * Fetches the list of infectious diseases for the authenticated client.
 * @returns {Promise<InfectiousDiseaseRead[]>} A promise that resolves with an array of the client's infectious diseases.
 */
const getMyInfectiousDiseases = async (): Promise<InfectiousDiseaseRead[]> => {
  const response = await api.get<InfectiousDiseaseRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new infectious disease for the authenticated client.
 * @param {InfectiousDiseaseCreate} data - The data for the new infectious disease.
 * @returns {Promise<InfectiousDiseaseRead>} A promise that resolves with the newly created infectious disease data.
 */
const createInfectiousDisease = async (data: InfectiousDiseaseCreate): Promise<InfectiousDiseaseRead> => {
  const response = await api.post<InfectiousDiseaseRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing infectious disease by its UUID.
 * @param {string} uuid - The unique identifier of the infectious disease to update.
 * @param {InfectiousDiseaseUpdate} data - An object containing the infectious disease fields to update.
 * @returns {Promise<InfectiousDiseaseRead>} A promise that resolves with the updated infectious disease data.
 */
const updateInfectiousDisease = async (
  uuid: string,
  data: InfectiousDiseaseUpdate
): Promise<InfectiousDiseaseRead> => {
  const response = await api.put<InfectiousDiseaseRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an infectious disease by its UUID.
 * @param {string} uuid - The unique identifier of the infectious disease to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteInfectiousDisease = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const infectiousDiseaseService = {
  getMyInfectiousDiseases,
  createInfectiousDisease,
  updateInfectiousDisease,
  deleteInfectiousDisease,
};
