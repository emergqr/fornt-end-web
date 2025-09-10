'use client';

/**
 * @file This file provides a service layer for managing the user's UUID in the browser's localStorage.
 * It abstracts the direct usage of localStorage for saving, retrieving, and removing the UUID.
 * NOTE: This file has been refactored to use web-standard localStorage instead of AsyncStorage from React Native.
 */

// Define a constant for the localStorage key to ensure consistency.
const USER_UUID_KEY = 'user_uuid';

/**
 * Saves the user's UUID to the browser's localStorage.
 * @param {string} uuid - The user's UUID string to be saved.
 * @returns {void}
 */
export const saveUserUUID = (uuid: string): void => {
  try {
    // Ensure this code only runs on the client-side where localStorage is available.
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_UUID_KEY, uuid);
    }
  } catch (error) {
    console.error('Failed to save user UUID to localStorage', error);
  }
};

/**
 * Retrieves the user's UUID from the browser's localStorage.
 * @returns {string | null} The UUID string, or null if it doesn't exist or an error occurs.
 */
export const getUserUUID = (): string | null => {
  try {
    // Ensure this code only runs on the client-side.
    if (typeof window !== 'undefined') {
      return localStorage.getItem(USER_UUID_KEY);
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve user UUID from localStorage', error);
    return null;
  }
};

/**
 * Removes the user's UUID from the browser's localStorage.
 * @returns {void}
 */
export const removeUserUUID = (): void => {
  try {
    // Ensure this code only runs on the client-side.
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_UUID_KEY);
    }
  } catch (error) {
    console.error('Failed to remove user UUID from localStorage', error);
  }
};
