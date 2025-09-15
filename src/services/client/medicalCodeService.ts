'use client';

/**
 * @file This file provides a service layer for searching external medical code terminologies.
 */

import api from '@/services/api';

// The base URL for all medical code-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_MEDICAL_CODES_BASE_URL || '/medical-codes';

/**
 * Represents a single result from a medical code search.
 */
export interface MedicalCodeResult {
  code: string;
  name: string;
  [key: string]: any; // Allow for other properties from the external API.
}

/**
 * Searches for a medical term in an external service like SNOMED or ICD-11.
 * @param {string} serviceName - The name of the service to search (e.g., 'snomed').
 * @param {string} term - The search term provided by the user.
 * @returns {Promise<MedicalCodeResult[]>} A promise that resolves with an array of search results.
 */
const searchMedicalTerm = async (
  serviceName: string,
  term: string
): Promise<MedicalCodeResult[]> => {
  const response = await api.get<MedicalCodeResult[]>(
    `${BASE_URL}/search/${serviceName}`,
    {
      params: { term },
    }
  );
  return response.data;
};

export const medicalCodeService = {
  searchMedicalTerm,
};
