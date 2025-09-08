import api from '@/services/api';
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '@/interfaces/client/vital-sign.interface';

const BASE_URL = '/vital-signs';

/**
 * Fetches the list of vital signs for the authenticated patient.
 */
const getMyVitalSigns = async (): Promise<VitalSignRead[]> => {
  const response = await api.get<VitalSignRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Fetches the list of available vital sign types.
 */
const getVitalSignTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>(`${BASE_URL}/types`);
  return response.data;
};

/**
 * Creates a new vital sign record.
 */
const createVitalSign = async (data: VitalSignCreate): Promise<VitalSignRead> => {
  const response = await api.post<VitalSignRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates an existing vital sign record.
 */
const updateVitalSign = async (
  uuid: string,
  data: VitalSignUpdate
): Promise<VitalSignRead> => {
  const response = await api.put<VitalSignRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a vital sign record.
 */
const deleteVitalSign = async (uuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${uuid}`);
};

export const vitalSignService = {
  getMyVitalSigns,
  getVitalSignTypes,
  createVitalSign,
  updateVitalSign,
  deleteVitalSign,
};
