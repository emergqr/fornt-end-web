'use client';

/**
 * @file This file provides a centralized system for handling and interpreting API errors.
 * It defines a custom ApiError class and a utility function to generate standardized, user-friendly error messages.
 */

import { isAxiosError } from 'axios';

/**
 * A custom error class for handling API-specific errors.
 * It extends the native Error class to include an HTTP status code, allowing for more
 * specific error handling logic based on the server's response.
 */
export class ApiError extends Error {
  /** The HTTP status code from the API response. */
  status: number;

  /**
   * Creates an instance of ApiError.
   * @param {string} message - The error message.
   * @param {number} status - The HTTP status code.
   */
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Interprets a caught error object and returns a user-friendly string.
 * This function is the single source of truth for API error messages, handling various
 * scenarios like network errors, server errors (with or without specific messages), and client-side errors.
 * 
 * @param {unknown} error - The error object caught in a try-catch block.
 * @returns {string} A user-friendly error message suitable for display in the UI.
 */
export const getApiErrorMessage = (error: unknown): string => {
  // The most common case: an error originating from an Axios API call.
  if (isAxiosError(error)) {
    // Case 1: The server successfully responded with a non-2xx status code.
    if (error.response) {
      // Handle specific, well-known error codes for better UX.
      if (error.response.status === 401) {
        return 'Your session has expired. Please log in again.';
      }
      if (error.response.status === 404) {
        return 'The requested resource was not found on the server.';
      }
      // For other server errors, attempt to use the message provided by the backend.
      // The backend might send errors in a { detail: '...' } or { message: '...' } structure.
      const serverMessage = error.response.data?.detail || error.response.data?.message;
      return serverMessage || `Server error: ${error.response.status}`;
    }

    // Case 2: The request was made, but no response was received (e.g., network error).
    // This can be due to no internet connection, the backend being down, or CORS issues.
    if (error.request) {
      return 'Could not connect to the server. Please check your internet connection and try again.';
    }
  }

  // Case 3: A standard JavaScript Error object was thrown.
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for any other unknown error types.
  console.error('Non-API error:', error);
  return 'An unexpected error occurred. Please try again.';
};
