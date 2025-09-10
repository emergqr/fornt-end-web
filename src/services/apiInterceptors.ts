/**
 * @file This file sets up Axios interceptors to handle API requests and responses globally.
 * It injects authentication tokens, language headers, and manages global error handling,
 * such as automatic user logout on session expiry.
 */

import api from './api';
import { getApiErrorMessage } from './apiErrors';
import { i18n as i18nInstanceType } from 'i18next'; // Import the i18n instance type

/**
 * Configures the application's Axios interceptors.
 * This function should be called once when the application initializes.
 * It uses dependency injection to avoid circular dependencies between the API layer and the auth store.
 * 
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
   * This function is executed before each API request is sent.
   * Its primary roles are to inject the Authorization and Accept-Language headers.
   */
  api.interceptors.request.use(
    async (config) => { // The interceptor is async to allow awaiting the token.
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
   * This function is executed when a response is received from the API.
   */
  api.interceptors.response.use(
    (response) => response, // If the response is successful, pass it through.
    (error) => {
      const errorMessage = getApiErrorMessage(error);
      // If the token is invalid or has expired (401), sign the user out.
      if (error.response?.status === 401) {
        signOutFn(); // Call the provided signOut function.
      }
      // Reject the promise with a user-friendly error message.
      return Promise.reject(new Error(errorMessage));
    },
  );
};