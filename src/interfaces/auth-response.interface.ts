'use client';

/**
 * @file This file defines the interface for the API response upon successful authentication (login or register).
 * It ensures type safety for the data received from the backend.
 */

import { Client } from "@/interfaces/client/client.interface";

/**
 * Defines the structure of the authentication response object.
 */
export interface AuthResponse {
  /**
   * The JSON Web Token (JWT) used for authenticating subsequent API requests.
   */
  access_token: string;

  /**
   * The full profile data of the authenticated user.
   */
  client: Client;
}
