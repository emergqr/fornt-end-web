'use client';

/**
 * @file This file defines the interface for the user registration payload.
 * It specifies the structure of the data sent to the API when creating a new user account.
 * This corresponds to the 'ClientRegister' schema in the openapi.json specification.
 */

/**
 * Defines the shape of the data object sent to the registration endpoint.
 */
export interface RegisterPayload {
  /**
   * The user's unique email address.
   */
  email: string;

  /**
   * The user's chosen password. Validation (e.g., length, complexity) is handled by the form.
   */
  password: string;

  /**
   * The user's full name (optional at registration).
   */
  name?: string | null;

  /**
   * The user's phone number (optional at registration).
   */
  phone?: string | null;

  /**
   * The user's date of birth in 'YYYY-MM-DD' format (optional at registration).
   */
  birth_date?: string | null;

  /**
   * The user's sex (optional at registration).
   */
  sex?: string | null;

  /**
   * The user's occupation (optional at registration).
   */
  occupation?: string | null;

  /**
   * The user's preferred language code (e.g., 'en', 'es') (optional at registration).
   */
  preferred_language?: string | null;
}
