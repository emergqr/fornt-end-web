import api from '@/services/api';
import {
  VitalSignRead,
  VitalSignCreate,
  VitalSignUpdate,
} from '@/interfaces/client/vital-sign.interface';

const BASE_URL = '/vital-signs';
const VITAL_SIGN = process.env.NEXT_PUBLIC_API_VITAL_SIGN_BASE;
const TYPE = process.env.NEXT_PUBLIC_API_TYPES;
/**
 * Fetches the list of vital signs for the authenticated patient.
 */
const getMyVitalSigns = async (): Promise<VitalSignRead[]> => {
  const response = await api.get<VitalSignRead[]>(`${VITAL_SIGN}/`);
  return response.data;
};

/**
 * Fetches the list of available vital sign types.
 */
const getVitalSignTypes = async (): Promise<string[]> => {
  const response = await api.get<string[]>(`${VITAL_SIGN}${TYPE}`);
  return response.data;
};

/**
 * Creates a new vital sign record.
 */
const createVitalSign = async (data: VitalSignCreate): Promise<VitalSignRead> => {
  const response = await api.post<VitalSignRead>(`${VITAL_SIGN}/`, data);
  return response.data;
};

/**
 * Updates an existing vital sign record.
 */
const updateVitalSign = async (
  uuid: string,
  data: VitalSignUpdate
): Promise<VitalSignRead> => {
  const response = await api.put<VitalSignRead>(`${VITAL_SIGN}/${uuid}`, data);
  return response.data;
};

/**
 * Deletes a vital sign record.
 */
const deleteVitalSign = async (uuid: string): Promise<void> => {
  await api.delete(`${VITAL_SIGN}/${uuid}`);
};

export const vitalSignService = {
  getMyVitalSigns,
  getVitalSignTypes,
  createVitalSign,
  updateVitalSign,
  deleteVitalSign,
};
