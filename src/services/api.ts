/**
 * @file This file initializes and configures the central Axios instance for all API communications.
 * It sets up the base URL, headers, and crucial interceptors for logging and data transformation.
 */

import axios from 'axios';

// Read the public API base URL from environment variables.
const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// A critical runtime check to ensure the environment is configured correctly.
if (!serverUrl) {
  console.error(
    'CRITICAL ERROR: The NEXT_PUBLIC_API_BASE_URL environment variable is not defined. Please check your .env.local file.'
  );
}

// Construct the full base URL for the API, including the version prefix.
const fullBaseURL = `${serverUrl}/api/v1`;

// Create a new Axios instance with default configuration.
const api = axios.create({
  baseURL: fullBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// This interceptor runs before each request is sent.
api.interceptors.request.use(
  (config) => {
    // Log the outgoing request for debugging purposes.
    const finalUrl = axios.getUri(config);
    console.log(`[API Request] -> ${config.method?.toUpperCase()} ${finalUrl}`);
    return config;
  },
  (error) => {
    // Log any errors that occur during request setup.
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * A centralized utility function to resolve the correct public URL for an API asset.
 * This is crucial for environments where the backend exposes assets on an internal port (e.g., 8000)
 * that is different from the public-facing port.
 * @param {string | null | undefined} path - The asset path or URL from the API response.
 * @returns {string | null | undefined} The resolved, publicly accessible URL.
 */
export const resolveApiAssetUrl = (path: string | null | undefined): string | null | undefined => {
  if (!path || !serverUrl) {
    return path;
  }

  const internalPort = ':8000';
  let publicPort = '';
  try {
    const publicUrl = new URL(serverUrl);
    publicPort = publicUrl.port ? `:${publicUrl.port}` : '';
  } catch (e) {
    // If the base URL is invalid, we cannot proceed.
    return path;
  }

  // Case 1: It's a full URL but contains the internal backend port.
  if (path.startsWith('http') && path.includes(internalPort)) {
    return path.replace(internalPort, publicPort);
  }

  // Case 2: It's a relative path (e.g., /storage/...).
  if (path.startsWith('/')) {
    return `${serverUrl}${path}`;
  }

  // If it's already a valid, full URL, return it as is.
  return path;
};

// --- Response Interceptor ---
/**
 * Recursively traverses an object or array and applies the `resolveApiAssetUrl` function
 * to any keys that are known to contain asset URLs.
 * @param {*} data - The data to traverse (can be an object, array, or primitive).
 * @returns {*} The data with corrected asset URLs.
 */
const recursiveUrlCorrection = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(recursiveUrlCorrection);
  }

  if (typeof data === 'object') {
    // A list of keys that are known to contain asset URLs.
    const urlKeys = ['avatar_url', 'full_avatar_url', 'url', 'file_path', 'flag'];
    
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (urlKeys.includes(key) && typeof value === 'string') {
        acc[key] = resolveApiAssetUrl(value);
      } else {
        // If the value is an object or array, recurse into it.
        acc[key] = recursiveUrlCorrection(value);
      }
      return acc;
    }, {} as { [key: string]: any });
  }

  return data;
};

// This interceptor runs on every successful response from the API.
api.interceptors.response.use(
  (response) => {
    // If the response contains data, apply the recursive URL correction.
    if (response.data) {
      response.data = recursiveUrlCorrection(response.data);
    }
    return response;
  },
  (error) => {
    // Log any errors that occur in the API response.
    console.error('[API Response Error]', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

console.log(`[API] Axios client initialized for baseURL: ${fullBaseURL}`);
console.log('[API] Response interceptor for asset URL resolution is active.');

export default api;
