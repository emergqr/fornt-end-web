'use client';

/**
 * @file This file defines the interfaces related to the Addiction entity.
 * It includes types for reading, creating, and updating addiction records.
 * The structure is analogous to the PatientDisease entity.
 */

/**
 * Represents a single addiction record as it is read from the API.
 */
export interface AddictionRead {
  /** The unique identifier for the addiction record (UUID). */
  uuid: string;
  /** The name of the addiction (e.g., 'Nicotine', 'Alcohol'). */
  name: string;
  /** The date when the user started tracking this addiction, in 'YYYY-MM-DD' format. */
  start_date: string;
  /** The status or severity of the addiction (e.g., 'Active', 'In Remission'). */
  status: string | null;
  /** Any additional notes about the addiction. */
  notes: string | null;
}

/**
 * Defines the data structure required to create a new addiction record.
 */
export interface AddictionCreate {
  name: string;
  start_date: string;
  status?: string | null;
  notes?: string | null;
}

/**
 * Defines the data structure for updating an existing addiction record.
 * All fields are optional to allow for partial updates.
 */
export type AddictionUpdate = Partial<AddictionCreate>;
