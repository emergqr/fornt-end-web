/**
 * @file Defines the interfaces for the Addiction module.
 * Corresponds to the schemas in openapi.json.
 */

export interface AddictionRead {
  uuid: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}

export interface AddictionCreate {
  name: string;
  start_date: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}

export interface AddictionUpdate {
  name?: string;
  start_date?: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}
