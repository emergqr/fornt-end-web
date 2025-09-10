/**
 * @file This file centralizes all API path segments for the application.
 * Using constants for API paths avoids magic strings, reduces typos, and makes
 * the codebase easier to maintain. If an API endpoint changes, it only needs to be updated here.
 */

/**
 * API paths related to the authentication module.
 */
export const AuthPaths = {
  REGISTER: '/register',
  LOGIN: '/login',
  CHANGE_PASSWORD: '/change-password',
  RESET_PASSWORD: '/reset-password',
};

/**
 * API paths related to the client module, typically prefixed with '/clients'.
 */
export const ClientPaths = {
  PROFILE: '/profile',
  AVATAR: '/avatar',
  CONTACTS: '/contacts',
  ADMIN_STATUS: '/admin-status',
};

/**
 * API paths for the address module.
 */
export const AddressPaths = {
  BASE: '/', // Represents the base path for addresses, e.g., /api/v1/addresses/
  /**
   * Generates the path for a specific address by its UUID.
   * @param {string} uuid - The unique identifier of the address.
   * @returns {string} The formatted API path segment.
   */
  BY_UUID: (uuid: string) => `/${uuid}`,
};

/**
 * API paths for the contact module.
 */
export const ContactPaths = {
  BASE: '/', // Represents the base path for contacts, e.g., /api/v1/contacts/
  /**
   * Generates the path for a specific contact by its UUID.
   * @param {string} uuid - The unique identifier of the contact.
   * @returns {string} The formatted API path segment.
   */
  BY_UUID: (uuid: string) => `/${uuid}`,
};

/**
 * API paths for the emergency data module.
 */
export const EmergDataPaths = {
  BASE: '/emerg-data/',
  ME: '/emerg-data/me', // Path to get the current user's emergency data
};
