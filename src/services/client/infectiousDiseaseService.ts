'use client';

/**
 * @file This file provides a service layer for interacting with the infectious disease-related API endpoints.
 * It encapsulates all the logic for fetching, creating, updating, and deleting user infectious disease records.
 */

import api from '@/services/api';
import {
  InfectiousDiseaseRead,
  InfectiousDiseaseCreate,
  InfectiousDiseaseUpdate,
} from '@/interfaces/client/infectious-disease.interface';

// The base URL for all infectious disease-related API requests.
const BASE_URL = '/infectious-diseases';

/**
 * Fetches the list of infectious diseases for the authenticated client.
 * @returns {Promise<InfectiousDiseaseRead[]>} A promise that resolves with an array of the client's infectious disease records.
 */
const getMyInfectiousDiseases = async (): Promise<InfectiousDiseaseRead[]> => {
  const response = await api.get<InfectiousDiseaseRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new infectious disease record for the authenticated client.
 * @param {InfectiousDiseaseCreate} data - The data for the new record.
 * @returns {Promise<InfectiousDiseaseRead>} A promise that resolves with the newly created record data.
 */
const createInfectiousDisease = async (data: InfectiousDiseaseCreate): Promise<InfectiousDiseaseRead> => {
  const response = await api.post<InfectiousDiseaseRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing infectious disease record by its UUID.
 * @param {string} uuid - The unique identifier of the record to update.
 * @param {InfectiousDiseaseUpdate} data - An object containing the fields to update.
 * @returns {Promise<InfectiousDiseaseRead>} A promise that resolves with the updated record data.
 */
const updateInfectiousDisease = async (uuid: string, data: InfectiousDiseaseUpdate): Promise<InfectiousDiseaseRead> => {
  const response = await api.put<InfectiousDiseaseRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an infectious disease record by its UUID.
 * @param {string} uuid - The unique identifier of the record to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteInfectiousDisease = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

/**
 * An object that groups all infectious disease-related service functions for easy import and usage.
 */
export const infectiousDiseaseService = {
  getMyInfectiousDiseases,
  createInfectiousDisease,
  updateInfectiousDisease,
  deleteInfectiousDisease,
};
