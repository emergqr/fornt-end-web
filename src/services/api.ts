'use client';

/**
 * @file This file initializes and configures the central Axios instance for all API communications.
 * It sets up the base URL and default headers. Interceptors are configured in `apiInterceptors.ts`.
 */

import axios from 'axios';

// The Axios instance is created with a base URL that reads the environment variable directly.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1` : '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * A centralized utility to resolve the correct public URL for an API asset.
 * This function is designed to be safe for use on both server and client.
 * @param {string | null | undefined} path - The asset path or URL from the API response.
 * @returns {string | null | undefined} The resolved, publicly accessible URL.
 */
export const resolveApiAssetUrl = (path: string | null | undefined): string | null | undefined => {
  // If there's no path, we can't do anything.
  if (!path) {
    return path;
  }

  // If the path is already a full URL, return it directly.
  if (path.startsWith('http')) {
    return path;
  }

  // Directly read the environment variable inside the function.
  // This ensures it works correctly whether running on server or client.
  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!serverUrl) {
    console.error('CRITICAL: NEXT_PUBLIC_API_BASE_URL is not available. Asset URLs will be incorrect.');
    return path; // Return relative path if base URL is not configured.
  }

  // For relative paths (e.g., /storage/clients/avatar.jpg), combine with the base URL.
  if (path.startsWith('/')) {
    // DEBUG LOG: Show the two parts being combined.
    console.log(`>>> Combining URL parts: Base='${serverUrl}', Path='${path}'`);
    try {
      const fullUrl = new URL(path, serverUrl);
      return fullUrl.href;
    } catch (e) {
      console.error(`[URL Resolution Error] Failed to construct URL. Base: ${serverUrl}, Path: ${path}`);
      return serverUrl + path; // Fallback
    }
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

export default api;
