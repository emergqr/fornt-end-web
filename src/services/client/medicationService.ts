import api from '@/services/api';
import {
  MedicationScheduleCreate,
  MedicationScheduleRead,
  MedicationScheduleUpdate,
} from '@/interfaces/client/medication.interface';

// Correct base URL for medication schedules as per the API specification
const BASE_URL = '/medical-history/schedules';

/**
 * Fetches all medication schedules for the current user.
 */
const getMySchedules = async (): Promise<MedicationScheduleRead[]> => {
  const response = await api.get<MedicationScheduleRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new medication schedule.
 */
const createSchedule = async (data: MedicationScheduleCreate): Promise<MedicationScheduleRead> => {
  const response = await api.post<MedicationScheduleRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing medication schedule.
 * NOTE: The API specification does not include an update endpoint for medication schedules.
 * This function is included for completeness, but it will likely fail if the endpoint doesn't exist.
 * We will assume a PATCH or PUT to /medical-history/schedules/{uuid} is the standard.
 */
const updateSchedule = async (uuid: string, data: MedicationScheduleUpdate): Promise<MedicationScheduleRead> => {
  const response = await api.put<MedicationScheduleRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a medication schedule.
 * NOTE: The API specification does not include a delete endpoint for medication schedules.
 * This function is included for completeness, assuming a DELETE to /medical-history/schedules/{uuid}.
 */
const deleteSchedule = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const medicationService = {
  getMySchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
