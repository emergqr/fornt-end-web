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

/**
 * Represents a single log entry in a pregnancy diary.
 */
export interface PregnancyLogRead {
  uuid: string;
  log_date: string;
  weight_kg?: number | null;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  edema_level?: string | null;
  bleeding?: boolean;
  headache?: boolean;
  blurred_vision?: boolean;
  abdominal_pain?: boolean;
  fetal_movements?: number | null;
  notes?: string | null;
}

/**
 * Defines the data structure for creating a new pregnancy log entry.
 */
export type PregnancyLogCreate = Omit<PregnancyLogRead, 'uuid'>;
