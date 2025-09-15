'use client';

/**
 * @file This file provides a service layer for interacting with the disease-related API endpoints.
 * It encapsulates all the logic for managing a user's diagnosed conditions (diseases).
 */

import api from '@/services/api';
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
  DiseaseCreateFromCode,
} from '@/interfaces/client/disease.interface';

// The base URL for all disease-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_DISEASES_BASE_URL || '/diseases';

/**
 * Fetches the list of diseases associated with the authenticated patient.
 * @returns {Promise<PatientDiseaseRead[]>} A promise that resolves with an array of the user's diagnosed conditions.
 */
const getMyDiseases = async (): Promise<PatientDiseaseRead[]> => {
  const response = await api.get<PatientDiseaseRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Fetches the master list of all available diseases in the system.
 * @returns {Promise<DiseaseRead[]>} A promise that resolves with the master list of diseases.
 */
const getDiseasesMasterList = async (): Promise<DiseaseRead[]> => {
  const response = await api.get<DiseaseRead[]>(`${BASE_URL}/master-list`);
  return response.data;
};

/**
 * Associates an existing disease from the master list with the patient's profile.
 * @param {PatientDiseaseCreate} data - The data for the new disease association.
 * @returns {Promise<PatientDiseaseRead>} A promise that resolves with the newly created patient-disease association.
 */
const createDisease = async (
  data: PatientDiseaseCreate
): Promise<PatientDiseaseRead> => {
  const response = await api.post<PatientDiseaseRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Creates and associates a disease from a standardized medical code (e.g., SNOMED).
 * @param {DiseaseCreateFromCode} data - The data containing the code, name, source, and diagnosis details.
 * @returns {Promise<PatientDiseaseRead>} A promise that resolves with the newly created patient-disease association.
 */
const createDiseaseFromCode = async (
  data: DiseaseCreateFromCode
): Promise<PatientDiseaseRead> => {
  const response = await api.post<PatientDiseaseRead>(`${BASE_URL}/from-code`, data);
  return response.data;
};

/**
 * Updates the details of a disease association (e.g., diagnosis date, severity).
 * @param {string} associationUuid - The unique identifier of the patient-disease association.
 * @param {PatientDiseaseUpdate} data - An object containing the fields to update.
 * @returns {Promise<PatientDiseaseRead>} A promise that resolves with the updated association data.
 */
const updateDisease = async (
  associationUuid: string,
  data: PatientDiseaseUpdate
): Promise<PatientDiseaseRead> => {
  const response = await api.put<PatientDiseaseRead>(`${BASE_URL}/${associationUuid}`, data);
  return response.data;
};

/**
 * Deletes a disease association from the patient's profile.
 * @param {string} associationUuid - The unique identifier of the association to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteDisease = async (associationUuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${associationUuid}`);
};

/**
 * An object that groups all disease-related service functions for easy import and usage.
 */
export const diseaseService = {
  getMyDiseases,
  getDiseasesMasterList,
  createDisease,
  createDiseaseFromCode,
  updateDisease,
  deleteDisease,
};
