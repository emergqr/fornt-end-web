'use client';

import { create } from 'zustand';
import {
  AddressRead,
  AddressCreate,
  AddressUpdate,
} from '@/interfaces/client/address.interface';
import { addressService } from '@/services/client/addressService';
import { getApiErrorMessage } from '@/services/apiErrors';

interface AddressState {
  address: AddressRead | null;
  loading: boolean;
  error: string | null;
  fetchAddress: () => Promise<void>;
  addAddress: (data: AddressCreate) => Promise<void>;
  updateAddress: (uuid: string, data: AddressUpdate) => Promise<void>;
  deleteAddress: (uuid: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set) => ({
  address: null,
  loading: false,
  error: null,

  fetchAddress: async () => {
    set({ loading: true, error: null });
    try {
      // Asumimos que el usuario solo tiene una dirección activa a la vez.
      const addresses = await addressService.getMyAddresses();
      set({ address: addresses[0] || null, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error), loading: false });
    }
  },

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
