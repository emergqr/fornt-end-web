'use client';

import { create } from 'zustand';
import {
    MedicalDocumentRead,
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';
import { medicalHistoryService } from '@/services/client/medicalHistoryService';
import { uploadDocumentsForEvent } from '@/services/client/fileUploadService';

/**
 * @file This file defines the Zustand store for managing the user's medical history events.
 */

/**
 * Interface defining the shape of the medical history state and its associated actions.
 */
interface MedicalHistoryState {
    events: MedicalEventRead[];
    loading: boolean;
    error: string | null;
    fetchMedicalHistory: () => Promise<void>;
    addMedicalEvent: (data: MedicalEventCreate, files: File[]) => Promise<MedicalEventRead>;
    editMedicalEvent: (uuid: string, data: MedicalEventUpdate) => Promise<void>;
    removeMedicalEvent: (uuid: string) => Promise<void>;
    addDocumentsToEvent: (eventUuid: string, files: File[]) => Promise<void>; // New action
}

/**
 * Creates the Zustand store for medical history management.
 */
export const useMedicalHistoryStore = create<MedicalHistoryState>((set, get) => ({
    // Initial state
    events: [],
    loading: false,
    error: null,

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

    addMedicalEvent: async (data: MedicalEventCreate, files: File[]) => {
        set({ loading: true, error: null });
        try {
            let newEvent = await medicalHistoryService.createMedicalEvent(data);
            if (files.length > 0) {
                const uploadedDocuments = await uploadDocumentsForEvent(newEvent.uuid, files);
                newEvent.documents = uploadedDocuments;
            }
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
     * Uploads documents and attaches them to an already existing medical event.
     * @param {string} eventUuid - The UUID of the event to attach files to.
     * @param {File[]} files - An array of files to upload.
     */
    addDocumentsToEvent: async (eventUuid: string, files: File[]) => {
        set({ loading: true, error: null });
        try {
            const uploadedDocuments = await uploadDocumentsForEvent(eventUuid, files);
            
            // Update the state by adding the new documents to the specific event
            set(state => ({
                events: state.events.map(event => {
                    if (event.uuid === eventUuid) {
                        return {
                            ...event,
                            documents: [...event.documents, ...uploadedDocuments],
                        };
                    }
                    return event;
                }),
                loading: false,
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to upload documents';
            set({ loading: false, error: errorMessage });
            throw new Error(errorMessage);
        }
    },

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
