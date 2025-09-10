'use client';

/**
 * @file This file defines the shape of the authentication state, including its properties and actions.
 * It is used to provide a strict type definition for the Zustand authentication store.
 */

import { User } from './user.interface';
import { AuthCredentials } from './auth-credentials.interface';

/**
 * Represents the properties (the data) of the authentication state.
 */
interface AuthStateProperties {
  /** Flag to indicate if an authentication-related async operation is in progress. */
  isLoading: boolean;
  /** The JWT authentication token. Null if the user is not authenticated. */
  userToken: string | null;
  /** The authenticated user's profile data. Null if the user is not authenticated. */
  user: User | null;
  /** Holds any error message from authentication-related API calls. */
  error: string | null;
}

/**
 * Represents the actions (the functions) available in the authentication store to modify the state.
 */
interface AuthStateActions {
  /** Action to handle user sign-in. */
  signIn: (credentials: AuthCredentials) => Promise<void>;
  /** Action to handle user sign-out. */
  signOut: () => Promise<void>;
  /** Action to handle new user registration. */
  signUp: (credentials: AuthCredentials) => Promise<void>;
  /** Action to restore a user session from stored credentials on app startup. */
  restoreSession: () => Promise<void>;
  /** Action to clear any existing error messages from the state. */
  clearError: () => void;
}

/**
 * The complete authentication state, combining properties and actions.
 * This type is used to define the shape of the `useAuthStore` in Zustand.
 */
export type AuthState = AuthStateProperties & AuthStateActions;
