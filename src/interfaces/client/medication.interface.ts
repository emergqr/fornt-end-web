'use client';

/**
 * @file This file defines the interfaces for the Medication Schedule entity.
 * It includes types for reading, creating, and updating medication plans,
 * corresponding to the schemas in the openapi.json specification.
 * NOTE: The property names are in snake_case to match the API.
 */

/**
 * Defines the available frequency types for a medication schedule.
 * This corresponds to the 'FrequencyType' enum in the API.
 */
export type FrequencyType = | 'Diario' | 'Cada X horas' | 'Semanal' | 'Mensual' | 'Según necesidad' | 'Todas las noches';

/**
 * Represents a medication schedule as it is read from the API.
 * Corresponds to the 'MedicationScheduleRead' schema.
 */
export interface MedicationScheduleRead {
  uuid: string;
  medication_name: string;
  dosage: string; // e.g., "1 pill", "10mg"
  frequency_type: FrequencyType;
  time_of_day: string | null; // e.g., "08:00"
  start_date: string; // ISO 8601 date string (YYYY-MM-DD)
  end_date?: string | null; // ISO 8601 date string (YYYY-MM-DD)
  is_active: boolean;
}

/**
 * Defines the data structure required to create a new medication schedule.
 * Corresponds to the 'MedicationScheduleCreate' schema.
 */
export interface MedicationScheduleCreate {
  medication_name: string;
  dosage: string;
  frequency_type: FrequencyType;
  time_of_day?: string | null;
  start_date: string;
  end_date?: string | null;
  is_active?: boolean;
}

/**
 * Defines the data structure for updating an existing medication schedule.
 * NOTE: As of the current API spec, there is no dedicated update endpoint.
 * This type is defined for future-proofing and consistency.
 */
export type MedicationScheduleUpdate = Partial<MedicationScheduleCreate>;
