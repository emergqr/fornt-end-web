import api from '@/services/api';
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
  AllergyCreateFromCode, // Importar la nueva interfaz
} from '@/interfaces/client/allergy.interface';
 
const BASE_URL = '/allergies';

const getMyAllergies = async (): Promise<AllergyRead[]> => {
  const response = await api.get<AllergyRead[]>(`${BASE_URL}/`);
  return response.data;
};

const createAllergy = async (data: AllergyCreate): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Creates and associates an allergy from a standardized medical code.
 * @param data - The data containing the code, name, and source.
 * @returns A promise that resolves with the newly created AllergyRead.
 */
const createAllergyFromCode = async (
  data: AllergyCreateFromCode
): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/from-code`, data);
  return response.data;
};

const updateAllergy = async (uuid: string, data: AllergyUpdate): Promise<AllergyRead> => {
  const response = await api.put<AllergyRead>(`${BASE_URL}/${uuid}`, data);
  return response.data;
};

const deleteAllergy = async (uuid: string): Promise<void> => {
  await api.delete<void>(`${BASE_URL}/${uuid}`);
};

const addReactionToAllergy = async (
  allergyUuid: string,
  data: ReactionHistoryCreate
): Promise<AllergyRead> => {
  const response = await api.post<AllergyRead>(`${BASE_URL}/${allergyUuid}/reactions`, data);
  return response.data;
};

export const allergyService = {
    getMyAllergies,
    createAllergy,
    createAllergyFromCode, // Añadir la nueva función al objeto exportado
    updateAllergy,
    deleteAllergy,
    addReactionToAllergy,
};