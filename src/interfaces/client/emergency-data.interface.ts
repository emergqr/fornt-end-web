/**
 * Basado en los schemas EmergData de openapi.json
 */

/**
 * Representa los datos de emergencia de un usuario, tal como se leen desde la API.
 * Coincide con el schema EmergDataResponse.
 */
export interface EmergencyDataRead {
  blood?: string | null; // Corregido de blood_type a blood
  social_security_health_system?: string | null;
  [key: string]: any;
}

/**
 * Representa los datos para crear o actualizar los datos de emergencia.
 * Coincide con el schema EmergDataUpdate.
 */
export type EmergencyDataUpdate = Partial<EmergencyDataRead>;
