import api from '@/services/api';
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '@/interfaces/client/disease.interface';

const BASE_URL = '/diseases';

/**
 * Fetches the list of diseases associated with the authenticated patient.
 * @returns A promise that resolves with an array of PatientDiseaseRead.
 */
const getMyDiseases = async (): Promise<PatientDiseaseRead[]> => {
  const response = await api.get<PatientDiseaseRead[]>(`${BASE_URL}/`);
  return response.data;
};

/**
 * Fetches the master list of all available diseases in the system.
 * @returns A promise that resolves with an array of DiseaseRead.
 */
const getDiseasesMasterList = async (): Promise<DiseaseRead[]> => {
  const response = await api.get<DiseaseRead[]>(`${BASE_URL}/master-list`);
  return response.data;
};

/**
 * Associates a new disease with the patient's profile.
 * @param data - The data for the new disease association.
 * @returns A promise that resolves with the newly created PatientDiseaseRead.
 */
const createDisease = async (
  data: PatientDiseaseCreate
): Promise<PatientDiseaseRead> => {
  const response = await api.post<PatientDiseaseRead>(`${BASE_URL}/`, data);
  return response.data;
};

/**
 * Updates the details of an associated disease.
 * @param associationUuid - The UUID of the patient-disease association.
 * @param data - The data to update.
 * @returns A promise that resolves with the updated PatientDiseaseRead.
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
 * @param associationUuid - The UUID of the association to delete.
 */
const deleteDisease = async (associationUuid: string): Promise<void> => {
  await api.delete(`${BASE_URL}/${associationUuid}`);
};

export const diseaseService = {
  getMyDiseases,
  getDiseasesMasterList,
  createDisease,
  updateDisease,
  deleteDisease,
};
