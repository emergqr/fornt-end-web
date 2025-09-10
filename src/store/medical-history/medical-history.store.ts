'use client';

import { create } from 'zustand';
import {
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';
import * as medicalHistoryService from '@/services/client/medicalHistoryService';
import { uploadDocumentsForEvent } from '@/services/client/fileUploadService';

/**
 * @file This file defines the Zustand store for managing the user's medical history events.
 * It handles state and actions for fetching, creating, updating, and deleting medical events,
 * including the logic for uploading associated documents.
 */

/**
 * Interface defining the shape of the medical history state and its associated actions.
 */
interface MedicalHistoryState {
    events: MedicalEventRead[]; // An array to hold the user's medical event records.
    loading: boolean; // Flag to indicate loading state during async operations.
    error: string | null; // Holds any error message from API calls.
    fetchMedicalHistory: () => Promise<void>; // Action to fetch all medical events.
    addMedicalEvent: (data: MedicalEventCreate, files: File[]) => Promise<MedicalEventRead>; // Action to add a new event, potentially with file uploads.
    editMedicalEvent: (uuid: string, data: MedicalEventUpdate) => Promise<void>; // Action to update an existing event.
    removeMedicalEvent: (uuid: string) => Promise<void>; // Action to delete an event.
}

/**
 * Creates the Zustand store for medical history management.
 */
export const useMedicalHistoryStore = create<MedicalHistoryState>((set) => ({
    // Initial state
    events: [],
    loading: false,
    error: null,

    /**
     * Fetches all medical history events for the authenticated user from the API.
     */
    fetchMedicalHistory: async () => {
        try {
            set({ loading: true, error: null });
            const events = await medicalHistoryService.getMedicalHistory();
            set({ events, loading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch medical history';
            set({ loading: false, error: errorMessage });
        }
    },

    /**
     * Adds a new medical event, handling document uploads in a two-step process.
     * First, it creates the event with the text data. Then, if files are provided,
     * it uploads them and associates them with the newly created event.
     * @param {MedicalEventCreate} data - The core data for the new medical event.
     * @param {File[]} files - An array of files to be uploaded and associated with the event.
     * @returns {Promise<MedicalEventRead>} The newly created event, including document URLs if any were uploaded.
     */
    addMedicalEvent: async (data: MedicalEventCreate, files: File[]) => {
        set({ loading: true, error: null });
        try {
            // Step 1: Create the event with text data.
            let newEvent = await medicalHistoryService.createMedicalEvent(data);

            // Step 2: If there are files, upload them and associate them with the new event.
            if (files.length > 0) {
                const uploadedDocuments = await uploadDocumentsForEvent(newEvent.uuid, files);
                // Update the local event object with the document data returned from the API.
                newEvent.documents = uploadedDocuments;
            }

            // Add the new event to the state and re-sort the list chronologically.
            set((state) => ({
                events: [newEvent, ...state.events].sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime()),
                loading: false,
            }));
            return newEvent;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save medical event';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

    /**
     * Updates an existing medical event.
     * @param {string} uuid - The UUID of the event to update.
     * @param {MedicalEventUpdate} data - The updated event data.
     */
    editMedicalEvent: async (uuid: string, data: MedicalEventUpdate) => {
        set({ loading: true, error: null });
        try {
            const updatedEvent = await medicalHistoryService.updateMedicalEvent(uuid, data);
            set((state) => ({
                events: state.events.map((event) => (event.uuid === uuid ? updatedEvent : event)),
                loading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update medical event';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

    /**
     * Deletes a medical event from the user's profile.
     * @param {string} uuid - The UUID of the event to delete.
     */
    removeMedicalEvent: async (uuid: string) => {
        set({ loading: true, error: null });
        try {
            await medicalHistoryService.deleteMedicalEvent(uuid);
            set((state) => ({
                events: state.events.filter((event) => event.uuid !== uuid),
                loading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete medical event';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },
}));
