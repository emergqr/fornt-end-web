'use client';

/**
 * @file This file provides a service layer for interacting with the medication schedule API endpoints.
 * It encapsulates all the logic for fetching and creating user medication schedules.
 * NOTE: As of the current API specification, update and delete operations are not supported.
 */

import api from '@/services/api';
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
} from '@/interfaces/client/medication.interface';

// The base URL for all medication schedule-related API requests.
const BASE_URL = '/medical-history/schedules';

/**
 * Fetches all medication schedules for the authenticated user.
 * Corresponds to the GET /medical-history/schedules endpoint.
 * @returns {Promise<MedicationScheduleRead[]>} A promise that resolves with an array of the user's medication schedules.
 */
const getMySchedules = async (): Promise<MedicationScheduleRead[]> => {
  const response = await api.get<MedicationScheduleRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new medication schedule for the authenticated user.
 * Corresponds to the POST /medical-history/schedules endpoint.
 * @param {MedicationScheduleCreate} data - The data for the new medication schedule.
 * @returns {Promise<MedicationScheduleRead>} A promise that resolves with the newly created schedule data.
 */
const createSchedule = async (data: MedicationScheduleCreate): Promise<MedicationScheduleRead> => {
  const response = await api.post<MedicationScheduleRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * An object that groups all available medication service functions for easy import and usage.
 */
export const medicationService = {
  getMySchedules,
  createSchedule,
};
