'use client';

/**
 * @file This file defines the interfaces for the Pregnancy Tracking module.
 * It includes types for reading, creating, and updating pregnancy records.
 * This serves as a contract for future backend implementation.
 */

/**
 * Represents a single pregnancy tracking record as it would be read from the API.
 */
export interface PregnancyRead {
  /** The unique identifier for the pregnancy record (UUID). */
  uuid: string;
  /** The estimated due date in 'YYYY-MM-DD' format. */
  due_date: string;
  /** The start date of the last menstrual period, used for calculations. */
  last_period_date: string;
  /** Any general notes about the pregnancy. */
  notes?: string | null;
}

/**
 * Defines the data structure required to create a new pregnancy tracking record.
 */
export interface PregnancyCreate {
  due_date: string;
  last_period_date: string;
  notes?: string | null;
}

/**
 * Defines the data structure for updating an existing pregnancy record.
 * All fields are optional to allow for partial updates.
 */
export type PregnancyUpdate = Partial<PregnancyCreate>;
