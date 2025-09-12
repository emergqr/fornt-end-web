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

/**
 * Represents the prediction data for the menstrual cycle.
 */
export type PredictionConfidence = 'Baja' | 'Media' | 'Alta' | 'Datos insuficientes';

export interface MenstrualCyclePrediction {
  predicted_next_period_start?: string | null;
  predicted_fertile_window_start?: string | null;
  predicted_fertile_window_end?: string | null;
  confidence: PredictionConfidence;
  average_cycle_length?: number | null;
}
