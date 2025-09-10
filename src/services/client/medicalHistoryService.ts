'use client';

/**
 * @file This file provides a service layer for interacting with the medical history API endpoints.
 * It handles all CRUD (Create, Read, Update, Delete) operations for a user's medical events.
 */

import api from '@/services/api';
import {
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';

// The base URL for all medical history-related API requests.
// NOTE: The double "/medical-history" is intentional and matches the backend routing structure.
const MEDICAL_HISTORY_API_PREFIX = '/medical-history/medical-history';

/**
 * Fetches the list of allowed medical event types from the API.
 * Corresponds to the GET /medical-history/medical-history/event-types endpoint.
 * @returns {Promise<string[]>} A promise that resolves with an array of event type names.
 */
export const getMedicalEventTypes = async (): Promise<string[]> => {
    const response = await api.get<string[]>(`${MEDICAL_HISTORY_API_PREFIX}/event-types`);
    return response.data;
};

/**
 * Fetches the chronological list of all medical events for the authenticated user.
 * Corresponds to the GET /medical-history/medical-history/events endpoint.
 * @returns {Promise<MedicalEventRead[]>} A promise that resolves with an array of medical events.
 */
export const getMedicalHistory = async (): Promise<MedicalEventRead[]> => {
    const response = await api.get<MedicalEventRead[]>(`${MEDICAL_HISTORY_API_PREFIX}/events`);
    return response.data;
};

/**
 * Fetches a specific medical event by its UUID.
 * Corresponds to the GET /medical-history/medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the detailed event data.
 */
export const getMedicalEvent = async (eventUuid: string): Promise<MedicalEventRead> => {
    const response = await api.get<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`);
    return response.data;
};

/**
 * Creates a new medical event for the authenticated user.
 * Corresponds to the POST /medical-history/medical-history/events endpoint.
 * @param {MedicalEventCreate} data - The data for the new medical event.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the newly created event data.
 */
export const createMedicalEvent = async (data: MedicalEventCreate): Promise<MedicalEventRead> => {
    const response = await api.post<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events`, data);
    return response.data;
};

/**
 * Updates an existing medical event by its UUID.
 * Corresponds to the PUT /medical-history/medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the event to update.
 * @param {MedicalEventUpdate} data - An object containing the event fields to update.
 * @returns {Promise<MedicalEventRead>} A promise that resolves with the updated event data.
 */
export const updateMedicalEvent = async (eventUuid: string, data: MedicalEventUpdate): Promise<MedicalEventRead> => {
    const response = await api.put<MedicalEventRead>(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`, data);
    return response.data;
};

/**
 * Deletes a medical event by its UUID.
 * Corresponds to the DELETE /medical-history/medical-history/events/{event_uuid} endpoint.
 * @param {string} eventUuid - The unique identifier of the event to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
export const deleteMedicalEvent = async (eventUuid: string): Promise<void> => {
    await api.delete(`${MEDICAL_HISTORY_API_PREFIX}/events/${eventUuid}`);
};
