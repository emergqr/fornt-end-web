'use client';

/**
 * @file This file defines the interface for authentication credentials.
 * It is used as a standard structure for login and registration payloads.
 */

/**
 * Defines the shape of the object containing user credentials for authentication.
 */
export interface AuthCredentials {
  /**
   * The user's email address.
   */
  email: string;

  /**
   * The user's password.
   */
  password: string;

  /**
   * An optional field for repeating the password, used during registration to confirm the password.
   * It is not required for login.
   */
  passwordRepeat?: string;
}
