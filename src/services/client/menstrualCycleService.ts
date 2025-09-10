/**
 * @file This file provides a service layer for interacting with the menstrual cycle-related API endpoints.
 */

import api from '@/services/api';
import {
  MenstrualLogRead,
  MenstrualLogCreate,
  MenstrualLogUpdate,
} from '@/interfaces/client/menstrual-cycle.interface';

const BASE_URL = '/menstrual-cycle/menstrual-cycle/logs';

/**
 * Fetches the list of menstrual logs for the authenticated user.
 * @returns {Promise<MenstrualLogRead[]>} A promise that resolves with an array of the user's menstrual logs.
 */
const getMyMenstrualLogs = async (): Promise<MenstrualLogRead[]> => {
  const response = await api.get<MenstrualLogRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new menstrual log for the authenticated user.
 * @param {MenstrualLogCreate} data - The data for the new menstrual log.
 * @returns {Promise<MenstrualLogRead>} A promise that resolves with the newly created menstrual log data.
 */
const createMenstrualLog = async (data: MenstrualLogCreate): Promise<MenstrualLogRead> => {
  const response = await api.post<MenstrualLogRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing menstrual log by its UUID.
 * @param {string} uuid - The unique identifier of the log to update.
 * @param {MenstrualLogUpdate} data - An object containing the log fields to update.
 * @returns {Promise<MenstrualLogRead>} A promise that resolves with the updated log data.
 */
const updateMenstrualLog = async (
  uuid: string,
  data: MenstrualLogUpdate
): Promise<MenstrualLogRead> => {
  const response = await api.put<MenstrualLogRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a menstrual log by its UUID.
 * @param {string} uuid - The unique identifier of the log to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteMenstrualLog = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const menstrualCycleService = {
  getMyMenstrualLogs,
  createMenstrualLog,
  updateMenstrualLog,
  deleteMenstrualLog,
};
