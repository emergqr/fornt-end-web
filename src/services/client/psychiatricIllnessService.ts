'use client';

/**
 * @file This file provides a service layer for the Psychiatric Illness module.
 * NOTE: This is a placeholder service. The functions are defined but will not work
 * until the corresponding backend endpoints are implemented.
 */

import api from '@/services/api';
import {
  PsychiatricIllnessRead,
  PsychiatricIllnessCreate,
  PsychiatricIllnessUpdate,
} from '@/interfaces/client/psychiatric-illness.interface';

// The base URL for all psychiatric illness-related API requests.
const BASE_URL = '/psychiatric-illnesses';

/**
 * Fetches the list of psychiatric conditions for the authenticated client.
 * @returns {Promise<PsychiatricIllnessRead[]>} A promise that resolves with an array of records.
 */
const getMyPsychiatricIllnesses = async (): Promise<PsychiatricIllnessRead[]> => {
  // const response = await api.get<PsychiatricIllnessRead[]>(`${BASE_URL}/`);
  // return response.data;
  console.warn('getMyPsychiatricIllnesses service is a placeholder and not implemented.');
  return Promise.resolve([]); // Return empty array for now
};

/**
 * Creates a new psychiatric condition record.
 * @param {PsychiatricIllnessCreate} data - The data for the new record.
 * @returns {Promise<PsychiatricIllnessRead>} A promise that resolves with the newly created record.
 */
const createPsychiatricIllness = async (data: PsychiatricIllnessCreate): Promise<PsychiatricIllnessRead> => {
  // const response = await api.post<PsychiatricIllnessRead>(`${BASE_URL}/`, data);
  // return response.data;
  console.warn('createPsychiatricIllness service is a placeholder and not implemented.');
  // Return a mock response for now
  return Promise.resolve({ uuid: 'mock-uuid', ...data } as PsychiatricIllnessRead);
};

/**
 * Updates an existing psychiatric condition record.
 * @param {string} uuid - The UUID of the record to update.
 * @param {PsychiatricIllnessUpdate} data - The data to update.
 * @returns {Promise<PsychiatricIllnessRead>} A promise that resolves with the updated record.
 */
const updatePsychiatricIllness = async (uuid: string, data: PsychiatricIllnessUpdate): Promise<PsychiatricIllnessRead> => {
  // const response = await api.put<PsychiatricIllnessRead>(`${BASE_URL}/${uuid}`, data);
  // return response.data;
  console.warn(`updatePsychiatricIllness for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve({ uuid, name: '', diagnosis_date: '', ...data } as PsychiatricIllnessRead);
};

/**
 * Deletes a psychiatric condition record.
 * @param {string} uuid - The UUID of the record to delete.
 * @returns {Promise<void>}
 */
const deletePsychiatricIllness = async (uuid: string): Promise<void> => {
  // await api.delete(`${BASE_URL}/${uuid}`);
  console.warn(`deletePsychiatricIllness for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve();
};

/**
 * An object that groups all psychiatric illness-related service functions.
 */
export const psychiatricIllnessService = {
  getMyPsychiatricIllnesses,
  createPsychiatricIllness,
  updatePsychiatricIllness,
  deletePsychiatricIllness,
};
