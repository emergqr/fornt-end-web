'use client';

/**
 * @file This file has been refactored to align with the project's standard API service structure.
 * It was previously using a custom ApiHandler and environment variables, which has been replaced
 * with the central `api` instance to leverage global interceptors for auth, language, and error handling.
 * This service is responsible for all API calls related to the main client entity.
 */

import api from '@/services/api';
import { Client } from '@/interfaces/client/client.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';

// The base URL for all client-related API requests.
const BASE_URL = '/clients';

/**
 * Fetches the profile of the currently authenticated user.
 * Corresponds to the GET /clients/me endpoint.
 * @returns {Promise<Client>} A promise that resolves with the user's profile data.
 */
const getMyProfile = async (): Promise<Client> => {
    const response = await api.get<Client>(`${BASE_URL}/me`);
    return response.data;
};

/**
 * Fetches the full profile of the currently authenticated user, including related data.
 * Corresponds to the GET /clients/me/profile endpoint.
 * @returns {Promise<Client>} A promise that resolves with the user's full profile data.
 */
const getMyFullProfile = async (): Promise<Client> => {
    const response = await api.get<Client>(`${BASE_URL}/me/profile`);
    return response.data;
};

/**
 * Updates the profile of the currently authenticated user.
 * Corresponds to the PUT /clients/me endpoint.
 * @param {ClientUpdate} data - The data to update.
 * @returns {Promise<Client>} A promise that resolves with the updated user's profile data.
 */
const updateMyProfile = async (data: ClientUpdate): Promise<Client> => {
    const response = await api.put<Client>(`${BASE_URL}/me`, data);
    return response.data;
};

/**
 * Deletes the account of the currently authenticated user.
 * Corresponds to the DELETE /clients/me endpoint.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteMyAccount = async (): Promise<void> => {
    await api.delete<void>(`${BASE_URL}/me`);
};

/**
 * An object that groups all client-related service functions for easy import and usage.
 */
export const clientService = {
    getMyProfile,
    getMyFullProfile,
    updateMyProfile,
    deleteMyAccount,
};