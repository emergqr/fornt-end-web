/**
 * @file Defines the interfaces for the Infectious Disease module.
 * Corresponds to the schemas in openapi.json.
 */

export interface InfectiousDiseaseRead {
  uuid: string;
  name: string;
  diagnosis_date: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}

export interface InfectiousDiseaseCreate {
  name: string;
  diagnosis_date: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}

export interface InfectiousDiseaseUpdate {
  name?: string;
  diagnosis_date?: string; // YYYY-MM-DD
  status?: string | null;
  notes?: string | null;
}
