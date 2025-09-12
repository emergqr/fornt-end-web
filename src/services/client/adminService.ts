'use client';

/**
 * @file This file provides a service layer for administrator-specific actions,
 * such as fetching all users and managing their accounts.
 */

import api from '@/services/api';
import { Client } from '@/interfaces/client/client.interface';

const BASE_URL = '/clients';

/**
 * Fetches a paginated list of all clients in the system.
 * This is an admin-only action.
 * @param {number} [skip=0] - The number of records to skip for pagination.
 * @param {number} [limit=100] - The maximum number of records to return.
 * @returns {Promise<Client[]>} A promise that resolves with an array of client data.
 */
const getAllClients = async (skip: number = 0, limit: number = 100): Promise<Client[]> => {
  const response = await api.get<Client[]>(`${BASE_URL}/`, {
    params: { skip, limit },
  });
  return response.data;
};

/**
 * Deletes a client's account by their UUID.
 * This is an admin-only, destructive action.
 * @param {string} uuid - The unique identifier of the client to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteClient = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

/**
 * An object that groups all admin-related service functions for easy import and usage.
 */
export const adminService = {
  getAllClients,
  deleteClient,
};
