'use client';

/**
 * @file This file provides a service layer for handling file uploads.
 * It is specifically designed to upload documents associated with a medical event.
 */

import api from '@/services/api';
import { MedicalDocumentRead } from '@/interfaces/client/medical-history.interface';

// The base URL for medical history event-related API requests.
const BASE_URL = process.env.NEXT_PUBLIC_API_MEDICAL_HISTORY_EVENTS_URL || '/medical-history/events';

/**
 * Uploads one or more documents and associates them with an existing medical event.
 * This function constructs a multipart/form-data request to handle the file transfer.
 * 
 * Corresponds to the POST /medical-history/events/{eventUuid}/documents endpoint.
 *
 * @param {string} eventUuid - The unique identifier of the medical event to which the documents will be attached.
 * @param {File[]} files - An array of File objects to be uploaded.
 * @returns {Promise<MedicalDocumentRead[]>} A promise that resolves with an array of the created medical document records.
 */
export const uploadDocumentsForEvent = async (
    eventUuid: string,
    files: File[],
): Promise<MedicalDocumentRead[]> => {
    const formData = new FormData();

    for (const file of files) {
        formData.append('files', file);
    }

    const response = await api.post<MedicalDocumentRead[]>(
        `${BASE_URL}/${eventUuid}/documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    return response.data;
};