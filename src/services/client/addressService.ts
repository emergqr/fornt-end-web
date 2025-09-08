import api from '@/services/api';
import {
  AddressRead,
  AddressCreate,
  AddressUpdate,
} from '@/interfaces/client/address.interface';

const BASE_URL = '/addresses';

/**
 * Fetches the list of addresses for the authenticated client.
 */
const getMyAddresses = async (): Promise<AddressRead[]> => {
  const response = await api.get<AddressRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Creates a new address for the client.
 */
const createAddress = async (data: AddressCreate): Promise<AddressRead> => {
  const response = await api.post<AddressRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing address.
 */
const updateAddress = async (
  uuid: string,
  data: AddressUpdate
): Promise<AddressRead> => {
  const response = await api.put<AddressRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes an address.
 */
const deleteAddress = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const addressService = {
  getMyAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
