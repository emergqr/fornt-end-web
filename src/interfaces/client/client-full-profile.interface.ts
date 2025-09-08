import { Client } from './client.interface';

/**
 * Represents the full user profile, including all related data.
 * Corresponds to the 'ClientFullProfile' schema in openapi.json.
 * Note: 'any' is used for complex nested objects for now.
 * Ideally, these would be replaced with proper interfaces (e.g., AddressRead, EmergDataResponse, etc.).
 */
export interface ClientFullProfile extends Client {
  address: any | null;
  emerg_data: any | null;
  contact_associations: any[];
  allergies: any[];
  patient_diseases: any[];
}