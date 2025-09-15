/**
 * @file This file provides a service layer for interacting with the menstrual cycle-related API endpoints.
 */

import api from '@/services/api';
import {
  MenstrualLogRead,
  MenstrualLogCreate,
  MenstrualLogUpdate,
  MenstrualCyclePrediction,
} from '@/interfaces/client/menstrual-cycle.interface';

const MENSTRUAL_CICLE=process.env.NEXT_PUBLIC_API_MESTRUAL_CICLE_BASE;
const LOGS= process.env.NEXT_PUBLIC_API_LOG_BASE;
const PREDICTION= process.env.NEXT_PUBLIC_API_MESTRUAL_CICLE_PREDICTION;

/**
 * Fetches the list of menstrual logs for the authenticated user.
 * @returns {Promise<MenstrualLogRead[]>} A promise that resolves with an array of the user's menstrual logs.
 */
const getMyMenstrualLogs = async (): Promise<MenstrualLogRead[]> => {
  const response = await api.get<MenstrualLogRead[]>(`${MENSTRUAL_CICLE}${LOGS}`);
  return response.data;
};

/**
 * Creates a new menstrual log for the authenticated user.
 * @param {MenstrualLogCreate} data - The data for the new menstrual log.
 * @returns {Promise<MenstrualLogRead>} A promise that resolves with the newly created menstrual log data.
 */
const createMenstrualLog = async (data: MenstrualLogCreate): Promise<MenstrualLogRead> => {
  const response = await api.post<MenstrualLogRead>(`${MENSTRUAL_CICLE}${LOGS}`, data);
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
  const response = await api.put<MenstrualLogRead>(`${MENSTRUAL_CICLE}${LOGS}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a menstrual log by its UUID.
 * @param {string} uuid - The unique identifier of the log to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteMenstrualLog = async (uuid: string): Promise<void> => {
  await api.delete(`${MENSTRUAL_CICLE}${LOGS}/${uuid}`);
};

/**
 * Fetches the menstrual cycle predictions for the user.
 * @returns {Promise<MenstrualCyclePrediction>} A promise that resolves with the prediction data.
 */
const getMenstrualCyclePredictions = async (): Promise<MenstrualCyclePrediction> => {
  const response = await api.get<MenstrualCyclePrediction>(`${MENSTRUAL_CICLE}${PREDICTION}`);
  return response.data;
};

export const menstrualCycleService = {
  getMyMenstrualLogs,
  createMenstrualLog,
  updateMenstrualLog,
  deleteMenstrualLog,
  getMenstrualCyclePredictions,
};
