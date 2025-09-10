'use client';

/**
 * @file This file defines the interfaces related to the Address entity.
 * It includes types for reading, creating, and updating an address,
 * corresponding to the Address schemas in the openapi.json specification.
 */

/**
 * Represents a complete address object as it is read from the API.
 * Corresponds to the 'AddressRead' schema.
 */
export interface AddressRead {
  /** The unique identifier for the address (UUID). */
  uuid: string;
  /** The street name and number. */
  street: string;
  /** The city. */
  city: string;
  /** The state, province, or region. */
  state: string;
  /** The postal code. */
  postal_code: string;
  /** The country. */
  country: string;
  /** A flag indicating if this is the user's primary address. */
  is_active: boolean;
}

/**
 * Defines the data structure required to create a new address.
 * Corresponds to the 'AddressCreate' schema.
 */
export interface AddressCreate {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_active?: boolean;
}

/**
 * Defines the data structure for updating an existing address.
 * It uses TypeScript's Partial utility type to make all fields of AddressCreate optional,
 * allowing for partial updates.
 * Corresponds to the 'AddressUpdate' schema.
 */
export type AddressUpdate = Partial<AddressCreate>;
