'use client';

/**
 * @file This file defines the interfaces related to the Psychiatric Illness entity.
 * It includes types for reading, creating, and updating psychiatric condition records.
 */

/**
 * Represents a single psychiatric condition record as it is read from the API.
 */
export interface PsychiatricIllnessRead {
  /** The unique identifier for the record (UUID). */
  uuid: string;
  /** The name of the condition (e.g., 'Clinical Depression', 'Anxiety Disorder'). */
  name: string;
  /** The date when the condition was diagnosed, in 'YYYY-MM-DD' format. */
  diagnosis_date: string;
  /** The current status of the condition (e.g., 'In Treatment', 'Stable'). */
  status: string | null;
  /** Any additional notes about the condition, medication, or therapy. */
  notes: string | null;
}

/**
 * Defines the data structure required to create a new psychiatric condition record.
 */
export interface PsychiatricIllnessCreate {
  name: string;
  diagnosis_date: string;
  status?: string | null;
  notes?: string | null;
}

/**
 * Defines the data structure for updating an existing psychiatric condition record.
 * All fields are optional to allow for partial updates.
 */
export type PsychiatricIllnessUpdate = Partial<PsychiatricIllnessCreate>;
