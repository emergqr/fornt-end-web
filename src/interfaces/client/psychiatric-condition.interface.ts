/**
 * @file Defines the interfaces for the Psychiatric Condition module.
 * Corresponds to the schemas in openapi.json.
 */

export interface PsychiatricConditionRead {
  uuid: string;
  name: string;
  diagnosis_date: string; // YYYY-MM-DD
  status?: string | null;
  medication?: string | null;
  notes?: string | null;
}

export interface PsychiatricConditionCreate {
  name: string;
  diagnosis_date: string; // YYYY-MM-DD
  status?: string | null;
  medication?: string | null;
  notes?: string | null;
}

export interface PsychiatricConditionUpdate {
  name?: string;
  diagnosis_date?: string; // YYYY-MM-DD
  status?: string | null;
  medication?: string | null;
  notes?: string | null;
}
