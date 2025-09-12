'use client';

/**
 * @file This file sets up Axios interceptors to handle API requests and responses globally.
 * It injects authentication tokens, language headers, and manages global error handling,
 * such as automatic user logout on session expiry.
 */

import api, { recursiveUrlCorrection } from './api'; // Import the URL correction utility
import { getApiErrorMessage } from './apiErrors';
import { i18n as i18nInstanceType } from 'i18next'; // Import the i18n instance type

/**
 * Configures the application's Axios interceptors.
 * This function should be called once when the application initializes.
 * @param {() => Promise<string | null>} getTokenFn - A function that retrieves the authentication token.
 * @param {() => Promise<void>} signOutFn - A function that handles the user sign-out process.
 * @param {i18nInstanceType} i18nInstance - The i18next instance to get the current language.
 */
export const setupApiInterceptors = (
  getTokenFn: () => Promise<string | null>,
  signOutFn: () => Promise<void>,
  i18nInstance: i18nInstanceType,
) => {
  /**
   * Request Interceptor:
   * Injects Authorization and Accept-Language headers into every outgoing request.
   */
  api.interceptors.request.use(
    async (config) => {
      const token = await getTokenFn();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const language = i18nInstance.language;
      if (language) {
        config.headers['Accept-Language'] = language;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  /**
   * Response Interceptor:
   * Handles global success and error responses.
   */
  api.interceptors.response.use(
    (response) => {
      // On a successful response, apply the recursive URL correction for assets.
      if (response.data) {
        response.data = recursiveUrlCorrection(response.data);
      }
      return response;
    },
    (error) => {
      const errorMessage = getApiErrorMessage(error);
      // On a 401 Unauthorized error, trigger a global sign-out.
      if (error.response?.status === 401) {
        signOutFn();
      }
      // Reject the promise with a standardized error message.
      return Promise.reject(new Error(errorMessage));
    },
  );
  console.log('[API] Interceptors configured successfully.');
};