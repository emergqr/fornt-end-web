'use client';

/**
 * @file This file provides mapping functions to transform data between the API's snake_case format
 * and the client-side camelCase format for the disease module. This acts as an anti-corruption layer,
 * isolating the frontend from backend naming conventions.
 */

import {
  PatientDisease,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '@/interfaces/client/disease.interface';

/**
 * Maps patient disease data from the API (snake_case) to the client-side interface (camelCase).
 * @param {any} apiData - The raw patient disease data received from the API.
 * @returns {PatientDisease} A `PatientDisease` object formatted for use in the client application.
 */
export const mapToPatientDiseaseClient = (apiData: any): PatientDisease => ({
  uuid: apiData.uuid,
  diagnosedAt: apiData.diagnosis_date,
  severity: apiData.severity,
  notes: apiData.notes,
  isActive: apiData.is_active,
  disease: {
    uuid: apiData.disease.uuid,
    name: apiData.disease.name,
    icd10Code: apiData.disease.icd10_code,
    snomedCtCode: apiData.disease.snomed_ct_code,
    category: apiData.disease.category,
    description: apiData.disease.description,
  },
});

/**
 * Maps the client-side disease creation data (camelCase) to the API's expected format (snake_case).
 * @param {PatientDiseaseCreate} clientData - The data for creating a new patient-disease association.
 * @returns {any} An object formatted to be sent to the API for creation.
 */
export const mapToPatientDiseaseCreateApi = (
  clientData: PatientDiseaseCreate
): any => ({
  disease_uuid: clientData.diseaseUuid,
  diagnosis_date: clientData.diagnosisDate,
  severity: clientData.severity,
  notes: clientData.notes,
  is_active: clientData.isActive,
});

/**
 * Maps the client-side disease update data (camelCase) to the API's expected format (snake_case).
 * @param {PatientDiseaseUpdate} clientData - The data for updating a patient-disease association.
 * @returns {any} An object formatted to be sent to the API for an update.
 */
export const mapToPatientDiseaseUpdateApi = (
  clientData: PatientDiseaseUpdate
): any => ({
  diagnosis_date: clientData.diagnosisDate,
  severity: clientData.severity,
  notes: clientData.notes,
  is_active: clientData.isActive,
});
