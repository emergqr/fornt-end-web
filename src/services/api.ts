'use client';

/**
 * @file This file initializes and configures the central Axios instance for all API communications.
 * It sets up the base URL and default headers. Interceptors are configured in `apiInterceptors.ts`.
 */

import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!serverUrl) {
  console.error(
    'CRITICAL ERROR: The NEXT_PUBLIC_API_BASE_URL environment variable is not defined. Please check your .env.local file.'
  );
}

const fullBaseURL = `${serverUrl}/api/v1`;

const api = axios.create({
  baseURL: fullBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A centralized utility to resolve the correct public URL for an API asset.
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
    return path;
  }

  if (path.startsWith('http') && path.includes(internalPort)) {
    return path.replace(internalPort, publicPort);
  }

  if (path.startsWith('/')) {
    return `${serverUrl}${path}`;
  }

  return path;
};

/**
 * Recursively traverses an object or array and applies `resolveApiAssetUrl`
 * to any keys that are known to contain asset URLs.
 * @param {*} data - The data to traverse.
 * @returns {*} The data with corrected asset URLs.
 */
export const recursiveUrlCorrection = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(recursiveUrlCorrection);
  }

  if (typeof data === 'object') {
    const urlKeys = ['avatar_url', 'full_avatar_url', 'url', 'file_path', 'flag'];
    
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (urlKeys.includes(key) && typeof value === 'string') {
        acc[key] = resolveApiAssetUrl(value);
      } else {
        acc[key] = recursiveUrlCorrection(value);
      }
      return acc;
    }, {} as { [key: string]: any });
  }

  return data;
};

console.log(`[API] Axios client initialized for baseURL: ${fullBaseURL}`);

export default api;
