'use client';

/**
 * @file This file centralizes all API calls related to user profiles.
 * It provides a clean and reusable interface for components and stores
 * to interact with profile-related endpoints, such as fetching, updating, and uploading avatars.
 */

import api from './api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { PublicProfileResponse } from '@/interfaces/client/client-full-profile.interface';

/**
 * Fetches the complete profile of the currently authenticated user.
 * Corresponds to the GET /clients/me endpoint.
 * @returns {Promise<Client>} A promise that resolves with the client's profile data.
 */
const getProfile = async (): Promise<Client> => {
  const response = await api.get<Client>('/clients/me');
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * Corresponds to the PUT /clients/me endpoint.
 * @param {ClientUpdate} data - An object containing the fields to update.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const updateProfile = async (data: ClientUpdate): Promise<Client> => {
  const response = await api.put<Client>('/clients/me', data);
  return response.data;
};

/**
 * Updates the preferred language for the currently authenticated user.
 * Corresponds to the PATCH /clients/me/language endpoint.
 * @param {string} languageCode - The new language code (e.g., 'en', 'es').
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const updateLanguagePreference = async (languageCode: string): Promise<Client> => {
  const response = await api.patch<Client>('/clients/me/language', {
    preferred_language: languageCode,
  });
  return response.data;
};

/**
 * Fetches the public emergency profile for a given user UUID.
 * This endpoint does not require authentication and is used for the public QR code view.
 * Corresponds to the GET /public-profile/{uuid} endpoint.
 * @param {string} uuid - The UUID of the user.
 * @returns {Promise<PublicProfileResponse>} A promise that resolves with the public profile data.
 */
const getPublicProfile = async (uuid: string): Promise<PublicProfileResponse> => {
  const response = await api.get<PublicProfileResponse>(`/public-profile/${uuid}`);
  return response.data;
};

/**
 * Uploads a user's avatar image to the backend.
 * This function constructs a FormData object to handle the file upload.
 * Corresponds to the POST /clients/me/avatar endpoint.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile, including the new avatar URL.
 */
const uploadAvatar = async (file: File): Promise<Client> => {
  // FormData is required for sending files in an HTTP request.
  const formData = new FormData();
  formData.append('file', file);

  // The Content-Type header must be overridden to 'multipart/form-data' for the file upload.
  const response = await api.post<Client>('/clients/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * An object that groups all profile-related service functions for easy import.
 */
export const profileService = {
  getProfile,
  updateProfile,
  updateLanguagePreference,
  getPublicProfile,
  uploadAvatar,
};
