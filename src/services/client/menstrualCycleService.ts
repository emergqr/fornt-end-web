'use client';

/**
 * @file This file provides a mock service layer for the Menstrual Cycle Tracking module.
 * NOTE: This is a placeholder service. The functions are defined but will not work
 * until the corresponding backend endpoints are implemented.
 */

import {
  MenstrualCycleRead,
  MenstrualCycleCreate,
  MenstrualCycleUpdate,
} from '@/interfaces/client/menstrual-cycle.interface';

// The base URL for all menstrual cycle-related API requests.
const BASE_URL = '/menstrual-cycles';

/**
 * Simulates fetching the list of menstrual cycle records for the authenticated user.
 * @returns {Promise<MenstrualCycleRead[]>} A promise that resolves with an empty array.
 */
const getMyCycles = async (): Promise<MenstrualCycleRead[]> => {
  console.warn('getMyCycles service is a placeholder and not implemented.');
  return Promise.resolve([]); // Return empty array for now
};

/**
 * Simulates creating a new menstrual cycle record.
 * @param {MenstrualCycleCreate} data - The data for the new record.
 * @returns {Promise<MenstrualCycleRead>} A promise that resolves with the mock created record.
 */
const createCycle = async (data: MenstrualCycleCreate): Promise<MenstrualCycleRead> => {
  console.warn('createCycle service is a placeholder and not implemented.');
  // Return a mock response for now
  return Promise.resolve({ 
    uuid: `mock-uuid-${Date.now()}`,
    cycle_length: 28, // Mock calculated value
    period_length: 5, // Mock calculated value
    ...data 
  } as MenstrualCycleRead);
};

/**
 * Simulates updating an existing menstrual cycle record.
 * @param {string} uuid - The UUID of the record to update.
 * @param {MenstrualCycleUpdate} data - The data to update.
 * @returns {Promise<MenstrualCycleRead>} A promise that resolves with the mock updated record.
 */
const updateCycle = async (uuid: string, data: MenstrualCycleUpdate): Promise<MenstrualCycleRead> => {
  console.warn(`updateCycle for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve({ uuid, start_date: '', end_date: '', cycle_length: 28, period_length: 5, ...data } as MenstrualCycleRead);
};

/**
 * Simulates deleting a menstrual cycle record.
 * @param {string} uuid - The UUID of the record to delete.
 * @returns {Promise<void>}
 */
const deleteCycle = async (uuid: string): Promise<void> => {
  console.warn(`deleteCycle for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve();
};

/**
 * An object that groups all menstrual cycle-related service functions.
 */
export const menstrualCycleService = {
  getMyCycles,
  createCycle,
  updateCycle,
  deleteCycle,
};
