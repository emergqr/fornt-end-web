'use client';

/**
 * @file This file provides a service layer for interacting with the address-related API endpoints.
 * It encapsulates all the logic for fetching, creating, updating, and deleting user addresses.
 */

import api from '@/services/api';
import {
  AddressRead,
  AddressCreate,
  AddressUpdate,
} from '@/interfaces/client/address.interface';

// The base URL for all address-related API requests, read from environment variables.
const BASE_URL = process.env.NEXT_PUBLIC_API_ADDRESSES_BASE_URL || '/addresses';

/**
 * Fetches the list of addresses for the authenticated client.
 * @returns {Promise<AddressRead[]>} A promise that resolves with an array of the client's addresses.
 */
const getMyAddresses = async (): Promise<AddressRead[]> => {
  const response = await api.get<AddressRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new address for the authenticated client.
 * @param {AddressCreate} data - The data for the new address.
 * @returns {Promise<AddressRead>} A promise that resolves with the newly created address data.
 */
const createAddress = async (data: AddressCreate): Promise<AddressRead> => {
  const response = await api.post<AddressRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing address by its UUID.
 * @param {string} uuid - The unique identifier of the address to update.
 * @param {AddressUpdate} data - An object containing the address fields to update.
 * @returns {Promise<AddressRead>} A promise that resolves with the updated address data.
 */
const updateAddress = async (
  uuid: string,
  data: AddressUpdate
): Promise<AddressRead> => {
  const response = await api.put<AddressRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an address by its UUID.
 * @param {string} uuid - The unique identifier of the address to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteAddress = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

/**
 * An object that groups all address-related service functions for easy import and usage.
 */
export const addressService = {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
