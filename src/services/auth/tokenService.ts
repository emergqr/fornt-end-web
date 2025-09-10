'use client';

/**
 * @file This file provides a service layer for managing the authentication token in the browser's localStorage.
 * It abstracts the direct usage of localStorage for saving, retrieving, and removing the token.
 * NOTE: This file has been refactored to use web-standard localStorage instead of AsyncStorage from React Native.
 */

// Define a constant for the localStorage key to ensure consistency and avoid typos.
const AUTH_TOKEN_KEY = 'authToken';

/**
 * Saves the authentication token to the browser's localStorage.
 * @param {string} token - The JWT token to be saved.
 * @returns {void}
 */
export const saveToken = (token: string): void => {
  try {
    // Ensure this code only runs on the client-side where localStorage is available.
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving the authentication token to localStorage', error);
  }
};

/**
 * Retrieves the authentication token from the browser's localStorage.
 * @returns {string | null} The token, or null if it doesn't exist or an error occurs.
 */
export const getToken = (): string | null => {
  try {
    // Ensure this code only runs on the client-side.
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving the authentication token from localStorage', error);
    return null;
  }
};

/**
 * Removes the authentication token from the browser's localStorage.
 * @returns {void}
 */
export const removeToken = (): void => {
  try {
    // Ensure this code only runs on the client-side.
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error removing the authentication token from localStorage', error);
  }
};
