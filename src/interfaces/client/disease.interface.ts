'use client';

/**
 * @file This file defines the interfaces related to the Disease and Patient-Disease association entities.
 * It includes types for reading, creating, and updating these records, corresponding to the schemas in openapi.json.
 */

/**
 * Represents a disease from the master list in the system.
 * Corresponds to the 'DiseaseRead' schema.
 */
export interface DiseaseRead {
  uuid: string;
  name: string;
  icd10_code: string;
  snomed_ct_code: string | null;
  category: string | null;
  description: string | null;
}

/**
 * Represents the association of a disease with a patient, including diagnosis details.
 * Corresponds to the 'PatientDiseaseRead' schema.
 */
export interface PatientDiseaseRead {
  uuid: string;
  diagnosis_date: string; // ISO date string
  severity: string | null;
  notes: string | null;
  is_active: boolean;
  show_in_emergency: boolean;
  disease: DiseaseRead; // The nested disease information.
}

/**
 * Defines the data structure for associating an existing disease with a patient.
 * Corresponds to the 'PatientDiseaseCreate' schema.
 */
export interface PatientDiseaseCreate {
  disease_uuid: string;
  diagnosis_date: string; // ISO date string
  severity?: string | null;
  notes?: string | null;
  is_active?: boolean;
  show_in_emergency?: boolean;
}

/**
 * Defines the data structure for creating a new disease association from a standardized medical code.
 * This is used for the smart search feature.
 */
export interface DiseaseCreateFromCode {
    name: string;
    code: string;
    source: string;
    diagnosis_date: string;
    severity?: string | null;
    notes?: string | null;
}

/**
 * Defines the data structure for updating the details of a patient-disease association.
 * All fields are optional to allow for partial updates.
 * Corresponds to the 'PatientDiseaseUpdate' schema.
 */
export interface PatientDiseaseUpdate {
  diagnosis_date?: string | null;
  severity?: string | null;
  notes?: string | null;
  is_active?: boolean | null;
  show_in_emergency?: boolean | null;
}
