import { create } from 'zustand';
import {
    MedicalEventCreate,
    MedicalEventRead,
    MedicalEventUpdate,
} from '@/interfaces/client/medical-history.interface';
import * as medicalHistoryService from '@/services/client/medicalHistoryService';
import { uploadDocumentsForEvent } from '@/services/client/fileUploadService';

interface MedicalHistoryState {
    events: MedicalEventRead[];
    loading: boolean;
    error: string | null;
    fetchMedicalHistory: () => Promise<void>;
    // The file type is changed from DocumentPicker.DocumentPickerAsset[] to the web standard File[]
    addMedicalEvent: (data: MedicalEventCreate, files: File[]) => Promise<MedicalEventRead>;
    editMedicalEvent: (uuid: string, data: MedicalEventUpdate) => Promise<void>;
    removeMedicalEvent: (uuid: string) => Promise<void>;
}

export const useMedicalHistoryStore = create<MedicalHistoryState>((set) => ({
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
            // Step 1: Create the event with text data.
            let newEvent = await medicalHistoryService.createMedicalEvent(data);

            // Step 2: If there are files, upload them and associate them.
            if (files.length > 0) {
                // Assuming uploadDocumentsForEvent can handle a File[] array.
                const uploadedDocuments = await uploadDocumentsForEvent(newEvent.uuid, files);
                // Update the local event with the newly uploaded documents.
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
