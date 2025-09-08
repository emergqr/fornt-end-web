import api from '@/services/api';
import {
  EmergencyDataRead,
  EmergencyDataUpdate,
} from '@/interfaces/client/emergency-data.interface';

const BASE_URL = '/emerg-data';

/**
 * Fetches the emergency data for the authenticated client.
 */
const getEmergencyData = async (): Promise<EmergencyDataRead> => {
  // El endpoint de la API para obtener los datos del usuario es /me
  const response = await api.get<EmergencyDataRead>(`${BASE_URL}/me`);
  return response.data;
};

/**
 * Creates or updates the emergency data for the client.
 */
const updateEmergencyData = async (data: EmergencyDataUpdate): Promise<EmergencyDataRead> => {
  const response = await api.put<EmergencyDataRead>(`${BASE_URL}/me`, data);
  return response.data;
};

export const emergencyDataService = {
  getEmergencyData,
  updateEmergencyData,
};
