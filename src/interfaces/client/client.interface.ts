'use client';

/**
 * @file This file defines the core Client interface, representing the main user model.
 * It corresponds to the 'Client' schema in the openapi.json specification.
 */

/**
 * Defines the structure of the basic client data returned by the API.
 */
export interface Client {
  /** The primary key of the user (integer). */
  id: number;
  /** The unique identifier for the user (UUID). */
  uuid: string;
  /** The user's unique email address. */
  email: string;
  /** The user's full name. */
  name?: string | null;
  /** The user's phone number. */
  phone?: string | null;
  /** The user's date of birth in 'YYYY-MM-DD' format. */
  birth_date?: string | null;
  /** The user's preferred language code (e.g., 'en', 'es'). */
  preferred_language?: string | null;
  /** The user's sex. */
  sex?: string | null;
  /** The user's occupation. */
  occupation?: string | null;
  /** The relative path or URL to the user's avatar image. */
  avatar_url?: string | null;
  /** A flag indicating if the user's account is active. */
  is_active: boolean;
  /** A flag indicating if the user has administrative privileges. */
  is_admin: boolean;
  /** The timestamp of when the user account was created (ISO 8601 format). */
  created_at: string;
  /** A read-only property that provides the full, publicly accessible URL to the user's avatar. */
  full_avatar_url?: string | null;
  /** A read-only property that calculates the user's age based on their birth date. */
  age?: number | null;
}
