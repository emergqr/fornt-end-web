'use client';

/**
 * @file This file sets up Axios interceptors to handle API requests and responses globally.
 * It injects authentication tokens, language headers, logs outgoing requests,
 * and manages global error handling.
 */

import axios from 'axios'; // Import axios to use its utility functions
import api, { recursiveUrlCorrection } from './api';
import { getApiErrorMessage } from './apiErrors';
import { i18n as i18nInstanceType } from 'i18next';

/**
 * Configures the application's Axios interceptors.
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
   * Injects headers and logs the outgoing request for debugging purposes.
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

      // Log the full, resolved URL of the outgoing request.
      const finalUrl = axios.getUri(config);
      console.log(`[API Request] -> ${config.method?.toUpperCase()} ${finalUrl}`);

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
      if (response.data) {
        response.data = recursiveUrlCorrection(response.data);
      }
      return response;
    },
    (error) => {
      const errorMessage = getApiErrorMessage(error);
      if (error.response?.status === 401) {
        signOutFn();
      }
      return Promise.reject(new Error(errorMessage));
    },
  );
  console.log('[API] Interceptors configured successfully with request logging.');
};