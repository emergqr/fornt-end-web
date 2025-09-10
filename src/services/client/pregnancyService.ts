/**
 * @file This file provides a service layer for interacting with the pregnancy tracking-related API endpoints.
 */

import api from '@/services/api';
import {
  PregnancyRead,
  PregnancyCreate,
  PregnancyUpdate,
} from '@/interfaces/client/pregnancy.interface';

const BASE_URL = '/pregnancies/pregnancies';

/**
 * Fetches the list of pregnancy records for the authenticated user.
 * @returns {Promise<PregnancyRead[]>} A promise that resolves with an array of the user's pregnancy records.
 */
const getMyPregnancyRecords = async (): Promise<PregnancyRead[]> => {
  const response = await api.get<PregnancyRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new pregnancy record for the authenticated user.
 * @param {PregnancyCreate} data - The data for the new pregnancy record.
 * @returns {Promise<PregnancyRead>} A promise that resolves with the newly created pregnancy record data.
 */
const createPregnancyRecord = async (data: PregnancyCreate): Promise<PregnancyRead> => {
  const response = await api.post<PregnancyRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing pregnancy record by its UUID.
 * @param {string} uuid - The unique identifier of the record to update.
 * @param {PregnancyUpdate} data - An object containing the record fields to update.
 * @returns {Promise<PregnancyRead>} A promise that resolves with the updated record data.
 */
const updatePregnancyRecord = async (
  uuid: string,
  data: PregnancyUpdate
): Promise<PregnancyRead> => {
  const response = await api.put<PregnancyRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a pregnancy record by its UUID.
 * @param {string} uuid - The unique identifier of the record to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deletePregnancyRecord = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const pregnancyService = {
  getMyPregnancyRecords,
  createPregnancyRecord,
  updatePregnancyRecord,
  deletePregnancyRecord,
};
