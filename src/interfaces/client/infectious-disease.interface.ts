'use client';

/**
 * @file This file defines the interfaces related to the Infectious Disease entity.
 * It includes types for reading, creating, and updating infectious disease records.
 */

/**
 * Represents a single infectious disease record as it is read from the API.
 */
export interface InfectiousDiseaseRead {
  /** The unique identifier for the record (UUID). */
  uuid: string;
  /** The name of the infectious disease (e.g., 'COVID-19', 'Hepatitis B'). */
  name: string;
  /** The date when the disease was diagnosed, in 'YYYY-MM-DD' format. */
  diagnosis_date: string;
  /** The current status of the disease (e.g., 'Active', 'Cured', 'Chronic'). */
  status: string | null;
  /** Any additional notes about the disease, treatment, or vaccination history. */
  notes: string | null;
}

/**
 * Defines the data structure required to create a new infectious disease record.
 */
export interface InfectiousDiseaseCreate {
  name: string;
  diagnosis_date: string;
  status?: string | null;
  notes?: string | null;
}

/**
 * Defines the data structure for updating an existing infectious disease record.
 * All fields are optional to allow for partial updates.
 */
export type InfectiousDiseaseUpdate = Partial<InfectiousDiseaseCreate>;
