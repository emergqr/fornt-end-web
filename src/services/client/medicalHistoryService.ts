'use client';

/**
 * @file This file provides a service layer for interacting with the medical history API endpoints.
 * It handles all CRUD operations for a user's medical events and their associated documents.
 */

import api from '@/services/api';
import {
    MedicalDocumentRead,
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';

// The base URL for all medical history-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_MEDICAL_HISTORY_BASE_URL || '/medical-history';

/**
 * Fetches the list of allowed medical event types from the API.
 * @returns {Promise<string[]>} A promise that resolves with an array of event type names.
 */
export const getMedicalEventTypes = async (): Promise<string[]> => {
    const response = await api.get<string[]>(`${BASE_URL}/event-types`);
    return response.data;
};

/**
 * Fetches the chronological list of all medical events for the authenticated user.
 * @returns {Promise<MedicalEventRead[]>} A promise that resolves with an array of medical events.
 */
export const getMedicalHistory = async (): Promise<MedicalEventRead[]> => {
    const response = await api.get<MedicalEventRead[]>(`${BASE_URL}/events`);
    return response.data;
};

/**
 * Fetches a specific medical event by its UUID.
 * @param {string} eventUuid - The unique identifier of the medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the detailed event data.
 */
export const getMedicalEvent = async (eventUuid: string): Promise<MedicalEventRead> => {
    const response = await api.get<MedicalEventRead>(`${BASE_URL}/events/${eventUuid}`);
    return response.data;
};

/**
 * Creates a new medical event for the authenticated user.
 * @param {MedicalEventCreate} data - The data for the new medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the newly created event data.
 */
export const createMedicalEvent = async (data: MedicalEventCreate): Promise<MedicalEventRead> => {
    const response = await api.post<MedicalEventRead>(`${BASE_URL}/events`, data);
    return response.data;
};

/**
 * Updates an existing medical event by its UUID.
 * @param {string} eventUuid - The unique identifier of the event to update.
 * @param {MedicalEventUpdate} data - An object containing the event fields to update.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the updated event data.
 */
export const updateMedicalEvent = async (eventUuid: string, data: MedicalEventUpdate): Promise<MedicalEventRead> => {
    const response = await api.put<MedicalEventRead>(`${BASE_URL}/events/${eventUuid}`, data);
    return response.data;
};

/**
 * Deletes a medical event by its UUID.
 * @param {string} eventUuid - The unique identifier of the event to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
export const deleteMedicalEvent = async (eventUuid: string): Promise<void> => {
    await api.delete(`${BASE_URL}/events/${eventUuid}`);
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
        `${BASE_URL}/events/${eventUuid}/documents`,
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