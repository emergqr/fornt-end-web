'use client';

/**
 * @file This file provides a service layer for interacting with external medical terminology APIs.
 * It abstracts the calls to our backend, which in turn queries services like SNOMED, ICD-11, etc.
 */

import api from '../api';

/**
 * Represents a single result from a medical terminology search.
 * The structure is kept generic as it can vary between different external services.
 */
export interface MedicalCodeSearchResult {
  code: string; // The unique code for the medical term (e.g., '59621000').
  name: string; // The human-readable name of the term (e.g., 'Essential hypertension').
  // The API might return other fields, but these are the essential ones.
  [key: string]: any;
}

/**
 * Performs a medical terminology search in an external service via our backend API.
 * Corresponds to the GET /medical-codes/search/{serviceName} endpoint.
 *
 * @param {string} serviceName - The external service to query (e.g., 'snomed', 'icd11').
 * @param {string} term - The search term (e.g., 'diabetes').
 * @returns {Promise<MedicalCodeSearchResult[]>} A promise that resolves with an array of search results.
 */
const search = async (
  serviceName: string,
  term: string
): Promise<MedicalCodeSearchResult[]> => {
  const response = await api.get<MedicalCodeSearchResult[]>(
    `/medical-codes/search/${serviceName}`,
    {
      params: { term }, // The search term is passed as a query parameter.
    }
  );
  return response.data;
};

/**
 * An object that groups all medical code service functions for easy import and usage.
 */
export const medicalCodeService = {
  search,
};
