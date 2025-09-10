/**
 * @file This file centralizes all API calls related to user profiles.
 * It provides a clean interface for components to interact with profile-related endpoints.
 */

import api from './api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { PublicProfileResponse } from '@/interfaces/client/client-full-profile.interface';

/**
 * Fetches the complete profile of the currently authenticated user.
 * @returns {Promise<Client>} A promise that resolves with the client's profile data.
 */
const getProfile = async (): Promise<Client> => {
  const response = await api.get<Client>('/clients/me');
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {ClientUpdate} data - The data to update.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const updateProfile = async (data: ClientUpdate): Promise<Client> => {
  const response = await api.put<Client>('/clients/me', data);
  return response.data;
};

/**
 * Fetches the public emergency profile for a given user UUID.
 * This endpoint does not require authentication.
 * @param {string} uuid - The UUID of the user.
 * @returns {Promise<PublicProfileResponse>} A promise that resolves with the public profile data.
 */
const getPublicProfile = async (uuid: string): Promise<PublicProfileResponse> => {
  const response = await api.get<PublicProfileResponse>(`/public-profile/${uuid}`);
  return response.data;
};

/**
 * Uploads a user's avatar image to the backend.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const uploadAvatar = async (file: File): Promise<Client> => {
  // FormData is used to construct a set of key/value pairs representing form fields and their values,
  // which is necessary for file uploads.
  const formData = new FormData();
  formData.append('file', file);

  // The Content-Type header is overridden to 'multipart/form-data' for the file upload.
  const response = await api.post<Client>('/clients/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * An object that groups all profile-related service functions.
 */
export const profileService = {
  getProfile,
  updateProfile,
  getPublicProfile,
  uploadAvatar,
};
