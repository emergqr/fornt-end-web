'use client';

/**
 * @file This file provides a mock service layer for the Pregnancy Tracking module.
 * NOTE: This is a placeholder service. The functions are defined but will not work
 * until the corresponding backend endpoints are implemented.
 */

import {
  PregnancyRead,
  PregnancyCreate,
  PregnancyUpdate,
} from '@/interfaces/client/pregnancy.interface';

// The base URL for all pregnancy-related API requests.
const BASE_URL = '/pregnancies';

/**
 * Simulates fetching the list of pregnancy records for the authenticated user.
 * @returns {Promise<PregnancyRead[]>} A promise that resolves with an empty array.
 */
const getMyPregnancies = async (): Promise<PregnancyRead[]> => {
  console.warn('getMyPregnancies service is a placeholder and not implemented.');
  return Promise.resolve([]); // Return empty array for now
};

/**
 * Simulates creating a new pregnancy record.
 * @param {PregnancyCreate} data - The data for the new record.
 * @returns {Promise<PregnancyRead>} A promise that resolves with the mock created record.
 */
const createPregnancy = async (data: PregnancyCreate): Promise<PregnancyRead> => {
  console.warn('createPregnancy service is a placeholder and not implemented.');
  // Return a mock response for now
  return Promise.resolve({ 
    uuid: `mock-uuid-${Date.now()}`,
    ...data 
  } as PregnancyRead);
};

/**
 * Simulates updating an existing pregnancy record.
 * @param {string} uuid - The UUID of the record to update.
 * @param {PregnancyUpdate} data - The data to update.
 * @returns {Promise<PregnancyRead>} A promise that resolves with the mock updated record.
 */
const updatePregnancy = async (uuid: string, data: PregnancyUpdate): Promise<PregnancyRead> => {
  console.warn(`updatePregnancy for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve({ uuid, due_date: '', last_period_date: '', ...data } as PregnancyRead);
};

/**
 * Simulates deleting a pregnancy record.
 * @param {string} uuid - The UUID of the record to delete.
 * @returns {Promise<void>}
 */
const deletePregnancy = async (uuid: string): Promise<void> => {
  console.warn(`deletePregnancy for ${uuid} is a placeholder and not implemented.`);
  return Promise.resolve();
};

/**
 * An object that groups all pregnancy-related service functions.
 */
export const pregnancyService = {
  getMyPregnancies,
  createPregnancy,
  updatePregnancy,
  deletePregnancy,
};
