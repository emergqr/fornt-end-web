'use client';

/**
 * @file This file centralizes all API calls related to user profiles.
 */

import api from './api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { PublicProfileResponse, ClientFullProfile } from '@/interfaces/client/client-full-profile.interface';

// Define API paths directly from environment variables
const CLIENTS_ME_PATH = process.env.NEXT_PUBLIC_API_CLIENT_ME_BASE || '/clients/me';
const PROFILE_PATH = process.env.NEXT_PUBLIC_API_PROFILR || '/profile';
const LANGUAGE_PATH = process.env.NEXT_PUBLIC_API_LANGUAGE || '/language';
const AVATAR_PATH = process.env.NEXT_PUBLIC_API_CLIENT_AVATAR || '/avatar';
const PUBLIC_PROFILE_PATH = process.env.NEXT_PUBLIC_API_PUBLIC_PROFILR || '/public-profile';

const getProfile = async (): Promise<Client> => {
  const response = await api.get<Client>(CLIENTS_ME_PATH);
  return response.data;
};

const getFullProfile = async (): Promise<ClientFullProfile> => {
  const response = await api.get<ClientFullProfile>(`${CLIENTS_ME_PATH}${PROFILE_PATH}`);
  return response.data;
};

const updateProfile = async (data: ClientUpdate): Promise<Client> => {
  const response = await api.put<Client>(CLIENTS_ME_PATH, data);
  return response.data;
};

const updateLanguagePreference = async (languageCode: string): Promise<Client> => {
  const response = await api.patch<Client>(`${CLIENTS_ME_PATH}${LANGUAGE_PATH}`, { preferred_language: languageCode });
  return response.data;
};

const getPublicProfile = async (uuid: string): Promise<PublicProfileResponse> => {
  const response = await api.get<PublicProfileResponse>(`${CLIENTS_ME_PATH}${PUBLIC_PROFILE_PATH}/${uuid}`);
  return response.data;
};

const uploadAvatar = async (file: File): Promise<Client> => {
  const formData = new FormData();
  formData.append('file', file);

  // Override the global default 'Content-Type: application/json' for this specific request.
  const response = await api.put<Client>(CLIENTS_ME_PATH + AVATAR_PATH, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const profileService = {
  getProfile,
  getFullProfile,
  updateProfile,
  updateLanguagePreference,
  uploadAvatar,
  getPublicProfile
};
