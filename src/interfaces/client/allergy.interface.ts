'use client';

/**
 * @file This file defines the interfaces related to the Allergy and Reaction History entities.
 * It includes types for reading, creating, and updating allergies and their associated reactions,
 * corresponding to the schemas in the openapi.json specification.
 */

/**
 * Represents a single reaction history record as it is read from the API.
 */
export interface ReactionHistoryRead {
  /** The unique identifier for the reaction history record (UUID). */
  uuid: string;
  /** The date when the reaction occurred, in 'YYYY-MM-DD' format. */
  reaction_date: string;
  /** A description of the symptoms experienced during the reaction. */
  symptoms: string | null;
}

/**
 * Defines the data structure required to create a new reaction history record.
 */
export interface ReactionHistoryCreate {
  reaction_date: string; // format: date
  symptoms?: string | null;
}

/**
 * Represents a complete allergy object as it is read from the API.
 */
export interface AllergyRead {
  uuid: string;
  /** The name of the substance the user is allergic to. */
  allergen: string;
  /** The type of reaction (e.g., 'Skin rash', 'Anaphylaxis'). */
  reaction_type: string | null;
  /** The severity of the reaction (e.g., 'Mild', 'Moderate', 'Severe'). */
  severity: string | null;
  /** The recommended immediate treatment for the reaction. */
  acute_treatment: string | null;
  /** The date when the allergy was diagnosed, in 'YYYY-MM-DD' format. */
  diagnosis_date: string | null;
  /** A flag indicating if this allergy should be prominently displayed in an emergency context. */
  show_in_emergency: boolean;
  /** The source API from which the allergy information was obtained (e.g., 'snomed'). */
  source_api: string | null;
  /** The standardized code for the allergen from the source API. */
  source_code: string | null;
  /** An array of past reaction history records associated with this allergy. */
  reaction_history: ReactionHistoryRead[];
}

/**
 * Defines the data structure for creating a new allergy manually.
 */
export interface AllergyCreate {
  allergen: string;
  reaction_type?: string | null;
  severity?: string | null;
  acute_treatment?: string | null;
  diagnosis_date?: string | null; // format: date
  show_in_emergency?: boolean;
}

/**
 * Defines the data structure for creating a new allergy from a standardized medical code.
 * This is used for the smart search feature.
 */
export interface AllergyCreateFromCode {
  name: string;
  code: string;
  source: string;
  reaction_type?: string | null;
  severity?: string | null;
}

/**
 * Defines the data structure for updating an existing allergy.
 * All fields are optional to allow for partial updates.
 */
export interface AllergyUpdate {
  allergen?: string | null;
  reaction_type?: string | null;
  severity?: string | null;
  acute_treatment?: string | null;
  diagnosis_date?: string | null; // format: date
  show_in_emergency?: boolean | null;
}

export interface AllergyCategory {
  name: string;
}