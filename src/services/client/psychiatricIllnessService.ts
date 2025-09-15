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
const MEDICAL_PSYCHIATRIC_ILLNESSES = process.env.NEXT_PUBLIC_API_MEDICAL_PSYCHIATRIC_ILLNESSES_BASE;

/**
 * Fetches the list of psychiatric conditions for the authenticated client.
 * @returns {Promise<PsychiatricIllnessRead[]>} A promise that resolves with an array of records.
 */
const getMyPsychiatricIllnesses = async (): Promise<PsychiatricIllnessRead[]> => {
   const response = await api.get<PsychiatricIllnessRead[]>(`${MEDICAL_PSYCHIATRIC_ILLNESSES}/`);
   return response.data;

};

/**
 * Creates a new psychiatric condition record.
 * @param {PsychiatricIllnessCreate} data - The data for the new record.
 * @returns {Promise<PsychiatricIllnessRead>} A promise that resolves with the newly created record.
 */
const createPsychiatricIllness = async (data: PsychiatricIllnessCreate): Promise<PsychiatricIllnessRead> => {
   const response = await api.post<PsychiatricIllnessRead>(`${MEDICAL_PSYCHIATRIC_ILLNESSES}/`, data);
   return response.data;

};

/**
 * Updates an existing psychiatric condition record.
 * @param {string} uuid - The UUID of the record to update.
 * @param {PsychiatricIllnessUpdate} data - The data to update.
 * @returns {Promise<PsychiatricIllnessRead>} A promise that resolves with the updated record.
 */
const updatePsychiatricIllness = async (uuid: string, data: PsychiatricIllnessUpdate): Promise<PsychiatricIllnessRead> => {
   const response = await api.put<PsychiatricIllnessRead>(`${MEDICAL_PSYCHIATRIC_ILLNESSES}/${uuid}`, data);
   return response.data;

};

/**
 * Deletes a psychiatric condition record.
 * @param {string} uuid - The UUID of the record to delete.
 * @returns {Promise<void>}
 */
const deletePsychiatricIllness = async (uuid: string): Promise<void> => {
  const response = await api.delete(`${MEDICAL_PSYCHIATRIC_ILLNESSES}/${uuid}`);
   return response.data;

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
