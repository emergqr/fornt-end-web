'use client';

/**
 * @file This file defines the interfaces for the user's core emergency data.
 * It corresponds to the 'EmergDataResponse', 'EmergDataCreate', and 'EmergDataUpdate' schemas in the openapi.json.
 */

/**
 * Represents the core emergency data of a user.
 * Note: The property names are in snake_case to match the API response.
 * Some property names contain typos (e.g., 'bird_date') or are in Spanish ('direccion'),
 * which are kept here to maintain consistency with the backend.
 */
export interface EmergencyDataRead {
  /** The user's date of birth. NOTE: Mispelled as 'bird_date' in the current API spec. */
  bird_date?: string | null;
  /** The user's address. NOTE: Named in Spanish in the current API spec. */
  direccion?: string | null;
  /** The user's blood type (e.g., 'A+'). */
  blood?: string | null;
  /** A text field for legacy disease information. */
  diseases?: string | null;
  /** A text field for legacy allergy information. */
  allergies?: string | null;
  /** A text field for legacy medication information. */
  medications?: string | null;
  /** The user's health system or insurance policy number. */
  social_security_health_system?: string | null;
}

/**
 * Defines the data structure for creating a new emergency data record.
 * It is currently identical to the read structure.
 */
export type EmergencyDataCreate = EmergencyDataRead;

/**
 * Defines the data structure for updating an existing emergency data record.
 * It uses TypeScript's Partial utility type to make all fields optional.
 */
export type EmergencyDataUpdate = Partial<EmergencyDataCreate>;
