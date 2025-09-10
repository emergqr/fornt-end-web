'use client';

/**
 * @file This file defines the comprehensive interface for a user's full profile,
 * including all related data entities. It is used for views that require a complete
 * snapshot of the user's information, such as the public emergency profile.
 */

import { Client } from './client.interface';
import { AddressRead } from './address.interface';
import { AllergyRead } from './allergy.interface';
import { Contact } from './contact.interface';
import { PatientDiseaseRead } from './disease.interface';
import { EmergencyDataRead } from './emergency-data.interface';

/**
 * Represents the full user profile, extending the base Client interface
 * with all associated medical and personal data.
 * Corresponds to the 'ClientFullProfile' and 'PublicProfileResponse' schemas in openapi.json.
 */
export interface ClientFullProfile extends Client {
  /** The user's primary address. */
  address: AddressRead | null;
  /** The user's core emergency data (blood type, etc.). */
  emerg_data: EmergencyDataRead | null;
  /** An array of the user's associated contacts. */
  contact_associations: Contact[];
  /** An array of the user's registered allergies. */
  allergies: AllergyRead[];
  /** An array of the user's diagnosed medical conditions. */
  patient_diseases: PatientDiseaseRead[];
}

/**
 * Defines the structure for the public profile API response.
 * It contains the client's public data and their emergency-related information.
 */
export interface PublicProfileResponse {
  client: ClientFullProfile;
  blood_type: string | null;
  social_security_health_system: string | null;
  emergency_contacts: Contact[];
  allergies: AllergyRead[];
  patient_diseases: PatientDiseaseRead[];
}
