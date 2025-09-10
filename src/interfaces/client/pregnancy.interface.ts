/**
 * @file Defines the interfaces for the Pregnancy Tracking module.
 * Corresponds to the schemas in openapi.json.
 */

export interface PregnancyRead {
  uuid: string;
  start_date: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  status: string;
  notes?: string | null;
  current_week?: number | null;
}

export interface PregnancyCreate {
  start_date: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  status: string;
  notes?: string | null;
}

export interface PregnancyUpdate {
  start_date?: string; // YYYY-MM-DD
  due_date?: string | null; // YYYY-MM-DD
  status?: string;
  notes?: string | null;
}
