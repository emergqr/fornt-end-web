'use client';

/**
 * @file This file defines the interface for updating a client's profile.
 * It corresponds to the 'ClientUpdate' schema in the openapi.json specification.
 * All fields are optional to allow for partial updates.
 */

import { AddressCreate } from './address.interface';
import { EmergencyDataUpdate } from './emergency-data.interface';

/**
 * Defines the data structure for updating a client's profile.
 * All fields are optional, allowing the client to update only the information they choose.
 */
export interface ClientUpdate {
  email?: string | null;
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  birth_date?: string | null; // Expected format: YYYY-MM-DD
  sex?: string | null;
  occupation?: string | null;
  /**
   * Data for creating or updating the user's address.
   * The backend handles the logic of creation vs. update.
   */
  address?: AddressCreate | null;
  /**
   * Data for creating or updating the user's emergency data.
   */
  emerg_data?: EmergencyDataUpdate | null;
  preferred_language?: string | null;
}
