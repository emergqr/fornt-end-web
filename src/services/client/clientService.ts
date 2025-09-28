'use client';

/**
 * @deprecated This service is deprecated and will be removed in a future version.
 * Please use `profileService.ts` for profile-related operations and `authService.ts` for account deletion.
 * This file is kept for backward compatibility but should not be used for new features.
 */

import api from '@/services/api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';

// The base URL for all client-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_CLIENT_ME_BASE || '/clients/me';
const BASE_URL_PROFILE = process.env.NEXT_PUBLIC_API_PROFILR || '/profile';
/**
 * @deprecated Use `profileService.getProfile` instead.
 */
const getMyProfile = async (): Promise<Client> => {
    const response = await api.get<Client>(`${BASE_URL}/`);
    return response.data;
};

/**
 * @deprecated Use `profileService.getFullProfile` instead.
 */
const getMyFullProfile = async (): Promise<Client> => {
    const response = await api.get<Client>(BASE_URL+BASE_URL_PROFILE);
    return response.data;
};

/**
 * @deprecated Use `profileService.updateProfile` instead.
 */
const updateMyProfile = async (data: ClientUpdate): Promise<Client> => {
    const response = await api.put<Client>(`${BASE_URL}`, data);
    return response.data;
};

/**
 * @deprecated Use `authService.deleteAccount` instead.
 */
const deleteMyAccount = async (): Promise<void> => {
    await api.delete<void>(`${BASE_URL}`);
};

export const clientService = {
    getMyProfile,
    getMyFullProfile,
    updateMyProfile,
    deleteMyAccount,
};