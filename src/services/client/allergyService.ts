'use client';

/**
 * @file This file provides a service layer for interacting with the allergy-related API endpoints.
 * It encapsulates all the logic for fetching, creating, updating, and deleting user allergies,
 * as well as managing their reaction histories.
 */

import api from '@/services/api';
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
  AllergyCreateFromCode,
} from '@/interfaces/client/allergy.interface';

// The base URL for all allergy-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_ALLERGIES_BASE_URL || '/allergies';

/**
 * Fetches the list of allergies for the authenticated client.
 * @returns {Promise<AllergyRead[]>} A promise that resolves with an array of the client's allergies.
 */
const getMyAllergies = async (): Promise<AllergyRead[]> => {
  const response = await api.get<AllergyRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new allergy for the authenticated client.
 * @param {AllergyCreate} data - The data for the new allergy.
 * @returns {Promise<AllergyRead>} A promise that resolves with the newly created allergy data.
 */
const createAllergy = async (data: AllergyCreate): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Creates and associates an allergy from a standardized medical code (e.g., SNOMED).
 * @param {AllergyCreateFromCode} data - The data containing the code, name, and source.
 * @returns {Promise<AllergyRead>} A promise that resolves with the newly created allergy data.
 */
const createAllergyFromCode = async (
  data: AllergyCreateFromCode
): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/from-code`, data);
  return response.data;
};

/**
 * Updates an existing allergy by its UUID.
 * @param {string} uuid - The unique identifier of the allergy to update.
 * @param {AllergyUpdate} data - An object containing the allergy fields to update.
 * @returns {Promise<AllergyRead>} A promise that resolves with the updated allergy data.
 */
const updateAllergy = async (uuid: string, data: AllergyUpdate): Promise<AllergyRead> => {
  const response = await api.put<AllergyRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an allergy by its UUID.
 * @param {string} uuid - The unique identifier of the allergy to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteAllergy = async (uuid: string): Promise<void> => {
  await api.delete<void>(`${BASE_URL}/${uuid}`);
};

/**
 * Adds a reaction history record to a specific allergy.
 * @param {string} allergyUuid - The UUID of the allergy to add the reaction to.
 * @param {ReactionHistoryCreate} data - The data for the new reaction.
 * @returns {Promise<AllergyRead>} A promise that resolves with the updated allergy data, including the new reaction.
 */
const addReactionToAllergy = async (
  allergyUuid: string,
  data: ReactionHistoryCreate
): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/${allergyUuid}/reactions`, data);
  return response.data;
};

/**
 * An object that groups all allergy-related service functions for easy import and usage.
 */
export const allergyService = {
    getMyAllergies,
    createAllergy,
    createAllergyFromCode,
    updateAllergy,
    deleteAllergy,
    addReactionToAllergy,
};