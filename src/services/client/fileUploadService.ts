'use client';

/**
 * @file This file provides a service layer for handling file uploads.
 * It is specifically designed to upload documents associated with a medical event.
 */

import api from '@/services/api';
import { MedicalDocumentRead } from '@/interfaces/client/medical-history.interface';

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
    // FormData is essential for sending files via an HTTP request.
    const formData = new FormData();

    // Append each file to the FormData object.
    // The backend should be configured to accept multiple files under the same field name ('files').
    for (const file of files) {
        formData.append('files', file);
    }

    // The Content-Type header must be set to 'multipart/form-data' for file uploads.
    // Axios typically handles this automatically when a FormData object is passed as the body,
    // but explicitly setting it ensures correctness.
    const response = await api.post<MedicalDocumentRead[]>(
        `/medical-history/events/${eventUuid}/documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    return response.data;
};