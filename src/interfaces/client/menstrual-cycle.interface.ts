'use client';

/**
 * @file This file defines the interfaces for the Menstrual Cycle Tracking module.
 * It includes types for reading, creating, and updating cycle records.
 * This serves as a contract for future backend implementation.
 */

/**
 * Represents a single menstrual cycle record as it would be read from the API.
 */
export interface MenstrualCycleRead {
  /** The unique identifier for the cycle record (UUID). */
  uuid: string;
  /** The start date of the period in 'YYYY-MM-DD' format. */
  start_date: string;
  /** The end date of the period in 'YYYY-MM-DD' format. */
  end_date: string;
  /** The calculated duration of the cycle in days. */
  cycle_length: number;
  /** The duration of the period in days. */
  period_length: number;
  /** Any additional notes about symptoms, mood, etc. */
  notes?: string | null;
}

/**
 * Defines the data structure required to create a new menstrual cycle record.
 */
export interface MenstrualCycleCreate {
  start_date: string;
  end_date: string;
  notes?: string | null;
}

/**
 * Defines the data structure for updating an existing menstrual cycle record.
 * All fields are optional to allow for partial updates.
 */
export type MenstrualCycleUpdate = Partial<MenstrualCycleCreate>;
