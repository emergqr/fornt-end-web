'use client';

/**
 * @file This file defines the core User interface, representing the structure
 * of a user object as used throughout the application.
 */

/**
 * Defines the basic shape of a user object.
 */
export interface User {
  /**
   * The unique identifier for the user (e.g., UUID).
   */
  id: string;

  /**
   * The user's unique email address.
   */
  email: string;

  /**
   * The user's full name.
   */
  name: string;

  // Add other fields returned by your API here, such as roles, preferences, etc.
}
