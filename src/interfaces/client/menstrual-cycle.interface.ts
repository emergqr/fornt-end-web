/**
 * @file Defines the interfaces for the Menstrual Cycle module.
 * Corresponds to the schemas in openapi.json.
 */

export interface MenstrualLogRead {
  uuid: string;
  start_date: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  symptoms?: string[] | null;
  flow_level?: string | null;
  notes?: string | null;
}

export interface MenstrualLogCreate {
  start_date: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  symptoms?: string[] | null;
  flow_level?: string | null;
  notes?: string | null;
}

export interface MenstrualLogUpdate {
  start_date?: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD
  symptoms?: string[] | null;
  flow_level?: string | null;
  notes?: string | null;
}
