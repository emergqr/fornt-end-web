/**
 * @file This file provides a service layer for interacting with the psychiatric condition-related API endpoints.
 */

import api from '@/services/api';
import {
  PsychiatricConditionRead,
  PsychiatricConditionCreate,
  PsychiatricConditionUpdate,
} from '@/interfaces/client/psychiatric-condition.interface';

const BASE_URL = '/psychiatric-conditions/psychiatric-conditions';

/**
 * Fetches the list of psychiatric conditions for the authenticated client.
 * @returns {Promise<PsychiatricConditionRead[]>} A promise that resolves with an array of the client's psychiatric conditions.
 */
const getMyPsychiatricConditions = async (): Promise<PsychiatricConditionRead[]> => {
  const response = await api.get<PsychiatricConditionRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new psychiatric condition for the authenticated client.
 * @param {PsychiatricConditionCreate} data - The data for the new psychiatric condition.
 * @returns {Promise<PsychiatricConditionRead>} A promise that resolves with the newly created psychiatric condition data.
 */
const createPsychiatricCondition = async (data: PsychiatricConditionCreate): Promise<PsychiatricConditionRead> => {
  const response = await api.post<PsychiatricConditionRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing psychiatric condition by its UUID.
 * @param {string} uuid - The unique identifier of the condition to update.
 * @param {PsychiatricConditionUpdate} data - An object containing the condition fields to update.
 * @returns {Promise<PsychiatricConditionRead>} A promise that resolves with the updated condition data.
 */
const updatePsychiatricCondition = async (
  uuid: string,
  data: PsychiatricConditionUpdate
): Promise<PsychiatricConditionRead> => {
  const response = await api.put<PsychiatricConditionRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a psychiatric condition by its UUID.
 * @param {string} uuid - The unique identifier of the condition to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deletePsychiatricCondition = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const psychiatricConditionService = {
  getMyPsychiatricConditions,
  createPsychiatricCondition,
  updatePsychiatricCondition,
  deletePsychiatricCondition,
};
