import api from '@/services/api';
import {
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';

// CORREGIDO: Se eliminó el prefijo duplicado.
const MEDICAL_HISTORY_API_PREFIX = '/medical-history';

/**
 * Obtiene la lista de tipos de eventos médicos permitidos.
 * Corresponde a: GET /api/v1/medical-history/event-types
 */
export const getMedicalEventTypes = async (): Promise<string[]> => {
    const response = await api.get<string[]>(`${MEDICAL_HISTORY_API_PREFIX}/event-types`);
    return response.data;
};


/**
 * Obtiene la lista cronológica de todos los eventos médicos del cliente.
 * Corresponde a: GET /api/v1/medical-history/events
 */
export const getMedicalHistory = async (): Promise<MedicalEventRead[]> => {
    const response = await api.get<MedicalEventRead[]>(`${MEDICAL_HISTORY_API_PREFIX}/events`);
    return response.data;
};

/**
 * Obtiene un evento médico específico por su UUID.
 * Corresponde a: GET /api/v1/medical-history/events/{event_uuid}
 * @param eventUuid - El UUID del evento médico.
 */
export const getMedicalEvent = async (eventUuid: string): Promise<MedicalEventRead> => {
    const response = await api.get<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`);
    return response.data;
};

/**
 * Crea un nuevo evento médico.
 * Corresponde a: POST /api/v1/medical-history/events
 * @param data - Los datos para el nuevo evento.
 */
export const createMedicalEvent = async (data: MedicalEventCreate): Promise<MedicalEventRead> => {
    const response = await api.post<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events`, data);
    return response.data;
};

/**
 * Actualiza un evento médico existente.
 * Corresponde a: PUT /api/v1/medical-history/events/{event_uuid}
 * @param eventUuid - El UUID del evento a actualizar.
 * @param data - Los campos a actualizar.
 */
export const updateMedicalEvent = async (eventUuid: string, data: MedicalEventUpdate): Promise<MedicalEventRead> => {
    const response = await api.put<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`, data);
    return response.data;
};

/**
 * Elimina un evento médico.
 * Corresponde a: DELETE /api/v1/medical-history/events/{event_uuid}
 * @param eventUuid - El UUID del evento a eliminar.
 */
export const deleteMedicalEvent = async (eventUuid: string): Promise<void> => {
    await api.delete(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`);
};
