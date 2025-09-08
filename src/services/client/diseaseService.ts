import api from '@/services/api';
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
  DiseaseCreateFromCode, // Importar la nueva interfaz
} from '@/interfaces/client/disease.interface';

const BASE_URL = '/diseases';

/**
 * Fetches the list of diseases associated with the authenticated patient.
 */
const getMyDiseases = async (): Promise<PatientDiseaseRead[]> => {
  const response = await api.get<PatientDiseaseRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Fetches the master list of all available diseases in the system.
 */
const getDiseasesMasterList = async (): Promise<DiseaseRead[]> => {
  const response = await api.get<DiseaseRead[]>(`${BASE_URL}/master-list`);
  return response.data;
};

/**
 * Associates a new disease with the patient's profile.
 */
const createDisease = async (
  data: PatientDiseaseCreate
): Promise<PatientDiseaseRead> => {
  const response = await api.post<PatientDiseaseRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Creates and associates a disease from a standardized medical code.
 * @param data - The data containing the code, name, and source.
 * @returns A promise that resolves with the newly created PatientDiseaseRead.
 */
const createDiseaseFromCode = async (
  data: DiseaseCreateFromCode
): Promise<PatientDiseaseRead> => {
  const response = await api.post<PatientDiseaseRead>(`${BASE_URL}/from-code`, data);
  return response.data;
};

/**
 * Updates the details of an associated disease.
 */
const updateDisease = async (
  associationUuid: string,
  data: PatientDiseaseUpdate
): Promise<PatientDiseaseRead> => {
  const response = await api.put<PatientDiseaseRead>(`${BASE_URL}/${associationUuid}`, data);
  return response.data;
};

/**
 * Deletes a disease association from the patient's profile.
 */
const deleteDisease = async (associationUuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${associationUuid}`);
};

export const diseaseService = {
  getMyDiseases,
  getDiseasesMasterList,
  createDisease,
  createDiseaseFromCode, // Añadir la nueva función al objeto exportado
  updateDisease,
  deleteDisease,
};
