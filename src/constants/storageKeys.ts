/**
 * @file This file centralizes the keys used for web storage (e.g., localStorage, sessionStorage).
 * Using constants for storage keys prevents typos and ensures consistency across the application
 * when setting or retrieving data from the browser's storage.
 */

/**
 * The key used to store and retrieve the user's authentication token from web storage.
 * This token is essential for making authenticated API requests.
 */
export const AUTH_TOKEN_KEY = 'userAuthToken';
