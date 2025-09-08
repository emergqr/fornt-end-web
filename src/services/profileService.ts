import api from './api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { PublicProfileResponse } from '@/interfaces/client/client-full-profile.interface';

/**
 * Fetches the complete profile of the currently authenticated user.
 * @returns A promise that resolves with the client's profile data.
 */
const getProfile = async (): Promise<Client> => {
  const response = await api.get<Client>('/clients/me');
  return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param data - The data to update.
 * @returns A promise that resolves with the updated client profile.
 */
const updateProfile = async (data: ClientUpdate): Promise<Client> => {
  const response = await api.put<Client>('/clients/me', data);
  return response.data;
};

/**
 * Fetches the public emergency profile for a given user UUID.
 * This endpoint does not require authentication.
 * @param uuid - The UUID of the user.
 * @returns A promise that resolves with the public profile data.
 */
const getPublicProfile = async (uuid: string): Promise<PublicProfileResponse> => {
  const response = await api.get<PublicProfileResponse>(`/public-profile/${uuid}`);
  return response.data;
};

/**
 * Uploads a user's avatar image to the backend.
 * @param file - The image file selected by the user.
 * @returns A promise that resolves with the updated client profile.
 */
const uploadAvatar = async (file: File): Promise<Client> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<Client>('/clients/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// Export all functions as a single object
export const profileService = {
  getProfile,
  updateProfile,
  getPublicProfile,
  uploadAvatar,
};
