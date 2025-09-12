/**
 * @file This file provides a service layer for interacting with the pregnancy tracking-related API endpoints.
 */

import api from '@/services/api';
import {
  PregnancyRead,
  PregnancyCreate,
  PregnancyUpdate,
  PregnancyLogRead,
  PregnancyLogCreate,
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

/**
 * Fetches all log entries for a specific pregnancy.
 * @param {string} pregnancyUuid - The UUID of the pregnancy.
 * @returns {Promise<PregnancyLogRead[]>} A promise that resolves with the list of log entries.
 */
const getPregnancyLogs = async (pregnancyUuid: string): Promise<PregnancyLogRead[]> => {
  const response = await api.get<PregnancyLogRead[]>(`${BASE_URL}/${pregnancyUuid}/logs`);
  return response.data;
};

/**
 * Creates a new log entry for a specific pregnancy.
 * @param {string} pregnancyUuid - The UUID of the pregnancy.
 * @param {PregnancyLogCreate} data - The data for the new log entry.
 * @returns {Promise<PregnancyLogRead>} A promise that resolves with the newly created log entry.
 */
const createPregnancyLog = async (pregnancyUuid: string, data: PregnancyLogCreate): Promise<PregnancyLogRead> => {
  const response = await api.post<PregnancyLogRead>(`${BASE_URL}/${pregnancyUuid}/logs`, data);
  return response.data;
};

export const pregnancyService = {
  getMyPregnancyRecords,
  createPregnancyRecord,
  updatePregnancyRecord,
  deletePregnancyRecord,
  getPregnancyLogs,
  createPregnancyLog,
};
