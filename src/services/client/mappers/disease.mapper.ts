import {
  PatientDisease,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
} from '@/interfaces/client/disease.interface';

/**
 * Mapea los datos de la API (snake_case) a la interfaz del cliente (camelCase).
 * @param apiData - Los datos de la enfermedad del paciente desde la API.
 * @returns Un objeto PatientDisease para el cliente.
 */
export const mapToPatientDiseaseClient = (apiData: any): PatientDisease => ({
  uuid: apiData.uuid,
  diagnosedAt: apiData.diagnosis_date,
  severity: apiData.severity,
  notes: apiData.notes,
  isActive: apiData.is_active,
  disease: {
    uuid: apiData.disease.uuid,
    name: apiData.disease.name,
    icd10Code: apiData.disease.icd10_code,
    snomedCtCode: apiData.disease.snomed_ct_code,
    category: apiData.disease.category,
    description: apiData.disease.description,
  },
});

/**
 * Mapea los datos de creación del cliente (camelCase) al formato de la API (snake_case).
 * @param clientData - Los datos para crear una asociación de enfermedad.
 * @returns Un objeto listo para ser enviado a la API.
 */
export const mapToPatientDiseaseCreateApi = (
  clientData: PatientDiseaseCreate
): any => ({
  disease_uuid: clientData.diseaseUuid,
  diagnosis_date: clientData.diagnosisDate,
  severity: clientData.severity,
  notes: clientData.notes,
  is_active: clientData.isActive,
});

/**
 * Mapea los datos de actualización del cliente (camelCase) al formato de la API (snake_case).
 * @param clientData - Los datos para actualizar una asociación de enfermedad.
 * @returns Un objeto listo para ser enviado a la API.
 */
export const mapToPatientDiseaseUpdateApi = (
  clientData: PatientDiseaseUpdate
): any => ({
  diagnosis_date: clientData.diagnosisDate,
  severity: clientData.severity,
  notes: clientData.notes,
  is_active: clientData.isActive,
});