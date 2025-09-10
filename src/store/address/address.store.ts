'use client';

import { create } from 'zustand';
import {
  AddressRead,
  AddressCreate,
  AddressUpdate,
} from '@/interfaces/client/address.interface';
import { addressService } from '@/services/client/addressService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * @file This file defines the Zustand store for managing the user's address.
 * It handles fetching, creating, updating, and deleting the address data.
 */

/**
 * Interface defining the shape of the address state and its actions.
 */
interface AddressState {
  address: AddressRead | null; // Holds the current address data.
  loading: boolean; // Flag to indicate loading state during async operations.
  error: string | null; // Holds any error message from API calls.
  fetchAddress: () => Promise<void>; // Action to fetch the user's address.
  addAddress: (data: AddressCreate) => Promise<void>; // Action to create a new address.
  updateAddress: (uuid: string, data: AddressUpdate) => Promise<void>; // Action to update an existing address.
  deleteAddress: (uuid: string) => Promise<void>; // Action to delete an address.
}

/**
 * Creates the Zustand store for address management.
 * This implementation assumes a user can have only one primary address at a time.
 */
export const useAddressStore = create<AddressState>((set) => ({
  // Initial state
  address: null,
  loading: false,
  error: null,

  /**
   * Fetches the user's addresses from the API and stores the first one.
   * The current implementation assumes the first address returned is the primary one.
   */
  fetchAddress: async () => {
    set({ loading: true, error: null });
    try {
      const addresses = await addressService.getMyAddresses();
      set({ address: addresses[0] || null, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

  /**
   * Creates a new address for the user.
   * @param {AddressCreate} data - The data for the new address.
   */
  addAddress: async (data: AddressCreate) => {
    try {
      const newAddress = await addressService.createAddress(data);
      set({ address: newAddress, error: null });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  /**
   * Updates an existing address.
   * @param {string} uuid - The UUID of the address to update.
   * @param {AddressUpdate} data - The updated address data.
   */
  updateAddress: async (uuid: string, data: AddressUpdate) => {
    try {
      const updatedAddress = await addressService.updateAddress(uuid, data);
      set({ address: updatedAddress, error: null });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },

  /**
   * Deletes an address.
   * @param {string} uuid - The UUID of the address to delete.
   */
  deleteAddress: async (uuid: string) => {
    try {
      await addressService.deleteAddress(uuid);
      set({ address: null, error: null });
    } catch (error) {
      const message = getApiErrorMessage(error);
      set({ error: message });
      throw new Error(message);
    }
  },
}));
