'use client';

/**
 * @file This file centralizes all API calls related to user profiles.
 */

import api from './api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { PublicProfileResponse, ClientFullProfile } from '@/interfaces/client/client-full-profile.interface';

// Define base paths from environment variables with fallbacks
const CLIENTS_BASE_URL = process.env.NEXT_PUBLIC_API_CLIENTS_BASE_URL || '/clients';
const PUBLIC_PROFILE_BASE_URL = process.env.NEXT_PUBLIC_API_PUBLIC_PROFILE_BASE_URL || '/public-profile';

/**
 * Fetches the basic profile of the currently authenticated user.
 * @returns {Promise<Client>} A promise that resolves with the client's basic profile data.
 */
const getProfile = async (): Promise<Client> => {
  const response = await api.get<Client>(`${CLIENTS_BASE_URL}/me`);
  return response.data;
};

/**
 * Fetches the full profile of the currently authenticated user, including related data.
 * @returns {Promise<ClientFullProfile>} A promise that resolves with the client's full profile data.
 */
const getFullProfile = async (): Promise<ClientFullProfile> => {
  const response = await api.get<ClientFullProfile>(`${CLIENTS_BASE_URL}/me/profile`);
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param {ClientUpdate} data - An object containing the fields to update.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const updateProfile = async (data: ClientUpdate): Promise<Client> => {
  const response = await api.put<Client>(`${CLIENTS_BASE_URL}/me`, data);
  return response.data;
};

/**
 * Updates the preferred language for the currently authenticated user.
 * @param {string} languageCode - The new language code (e.g., 'en', 'es').
 * @returns {Promise<Client>} A promise that resolves with the updated client profile.
 */
const updateLanguagePreference = async (languageCode: string): Promise<Client> => {
  const response = await api.patch<Client>(`${CLIENTS_BASE_URL}/me/language`, { preferred_language: languageCode });
  return response.data;
};

/**
 * Fetches the public emergency profile for a given user UUID.
 * @param {string} uuid - The UUID of the user.
 * @returns {Promise<PublicProfileResponse>} A promise that resolves with the public profile data.
 */
const getPublicProfile = async (uuid: string): Promise<PublicProfileResponse> => {
  const response = await api.get<PublicProfileResponse>(`${PUBLIC_PROFILE_BASE_URL}/${uuid}`);
  return response.data;
};

/**
 * Uploads a user's avatar image to the backend.
 * @param {File} file - The image file selected by the user.
 * @returns {Promise<Client>} A promise that resolves with the updated client profile, including the new avatar URL.
 */
const uploadAvatar = async (file: File): Promise<Client> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<Client>(`${CLIENTS_BASE_URL}/me/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const profileService = {
  getProfile,
  getFullProfile,
  updateProfile,
  updateLanguagePreference,
  getPublicProfile,
  uploadAvatar,
};
