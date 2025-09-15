'use client';

/**
 * @file This file provides a service layer for interacting with the medical history API endpoints.
 * It handles all CRUD (Create, Read, Update, Delete) operations for a user's medical events.
 */

import api from '@/services/api';
import {
    MedicalDocumentRead,
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';

// The base URL for all medical history event-related API requests.
const MEDICAL_HISTORY_EVENTS_PREFIX = '/medical-history/events';

/**
 * Fetches the list of allowed medical event types from the API.
 * Corresponds to the GET /medical-history/event-types endpoint.
 * @returns {Promise<string[]>} A promise that resolves with an array of event type names.
 */
export const getMedicalEventTypes = async (): Promise<string[]> => {
    // This endpoint has a slightly different path, so we construct it directly.
    const response = await api.get<string[]>('/medical-history/event-types');
    return response.data;
};

/**
 * Fetches the chronological list of all medical events for the authenticated user.
 * Corresponds to the GET /medical-history/events endpoint.
 * @returns {Promise<MedicalEventRead[]>} A promise that resolves with an array of medical events.
 */
export const getMedicalHistory = async (): Promise<MedicalEventRead[]> => {
    const response = await api.get<MedicalEventRead[]>(`${MEDICAL_HISTORY_EVENTS_PREFIX}`);
    return response.data;
};

/**
 * Fetches a specific medical event by its UUID.
 * Corresponds to the GET /medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the detailed event data.
 */
export const getMedicalEvent = async (eventUuid: string): Promise<MedicalEventRead> => {
    const response = await api.get<MedicalEventRead>(`${MEDICAL_HISTORY_EVENTS_PREFIX}/${eventUuid}`);
    return response.data;
};

/**
 * Creates a new medical event for the authenticated user.
 * Corresponds to the POST /medical-history/events endpoint.
 * @param {MedicalEventCreate} data - The data for the new medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the newly created event data.
 */
export const createMedicalEvent = async (data: MedicalEventCreate): Promise<MedicalEventRead> => {
    const response = await api.post<MedicalEventRead>(`${MEDICAL_HISTORY_EVENTS_PREFIX}`, data);
    return response.data;
};

/**
 * Updates an existing medical event by its UUID.
 * Corresponds to the PUT /medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the event to update.
 * @param {MedicalEventUpdate} data - An object containing the event fields to update.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the updated event data.
 */
export const updateMedicalEvent = async (eventUuid: string, data: MedicalEventUpdate): Promise<MedicalEventRead> => {
    const response = await api.put<MedicalEventRead>(`${MEDICAL_HISTORY_EVENTS_PREFIX}/${eventUuid}`, data);
    return response.data;
};

/**
 * Deletes a medical event by its UUID.
 * Corresponds to the DELETE /medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the event to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
export const deleteMedicalEvent = async (eventUuid: string): Promise<void> => {
    await api.delete(`${MEDICAL_HISTORY_EVENTS_PREFIX}/${eventUuid}`);
};

/**
 * Uploads and attaches a document to a specific medical event.
 * @param {string} eventUuid - The UUID of the event to attach the document to.
 * @param {File} file - The file to be uploaded.
 * @returns {Promise<MedicalDocumentRead>} A promise that resolves with the data of the newly created document.
 */
export const uploadDocumentForMedicalEvent = async (eventUuid: string, file: File): Promise<MedicalDocumentRead> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<MedicalDocumentRead>(
        `${MEDICAL_HISTORY_EVENTS_PREFIX}/${eventUuid}/documents`,
        formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }
    );
    return response.data;
};

export const medicalHistoryService = {
    getMedicalEventTypes,
    getMedicalHistory,
    getMedicalEvent,
    createMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
    uploadDocumentForMedicalEvent,
};