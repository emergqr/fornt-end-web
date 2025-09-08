import api from '../api';

/**
 * Representa un único resultado de la búsqueda de terminología médica.
 * La estructura es genérica porque puede variar entre servicios (SNOMED, ICD-11, etc.).
 */
export interface MedicalCodeSearchResult {
  code: string;
  name: string;
  // Pueden existir otros campos, pero estos son los esenciales.
  [key: string]: any;
}

/**
 * Realiza una búsqueda de terminología médica en un servicio externo a través de nuestra API.
 *
 * @param serviceName - El servicio a consultar (ej. 'snomed', 'icd11').
 * @param term - El término de búsqueda.
 * @returns Una promesa que se resuelve en un array de resultados de búsqueda.
 */
const search = async (
  serviceName: string,
  term: string
): Promise<MedicalCodeSearchResult[]> => {
  const response = await api.get<MedicalCodeSearchResult[]>(
    `/medical-codes/search/${serviceName}`,
    {
      params: { term },
    }
  );
  return response.data;
};

export const medicalCodeService = {
  search,
};
