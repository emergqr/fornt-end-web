import { create } from 'zustand';
import {
  PatientDiseaseRead,
  DiseaseRead,
  PatientDiseaseCreate,
  PatientDiseaseUpdate,
  DiseaseCreateFromCode, // Importar la nueva interfaz
} from '@/interfaces/client/disease.interface';
import { diseaseService } from '@/services/client/diseaseService';

/**
 * Define la forma del estado y las acciones para el store de enfermedades.
 */
interface DiseaseState {
  diseases: PatientDiseaseRead[];
  loading: boolean;
  error: string | null;
  masterList: DiseaseRead[];
  masterListLoading: boolean;
  fetchMyDiseases: () => Promise<void>;
  addDisease: (data: PatientDiseaseCreate) => Promise<void>;
  addDiseaseFromCode: (data: DiseaseCreateFromCode) => Promise<void>; // Nueva acción
  editDisease: (uuid: string, data: PatientDiseaseUpdate) => Promise<void>;
  removeDisease: (uuid: string) => Promise<void>;
  fetchMasterList: () => Promise<void>;
  clearError: () => void;
}

/**
 * Store de Zustand para gestionar el estado de las enfermedades del paciente.
 */
export const useDiseaseStore = create<DiseaseState>((set, get) => ({
  // Estado inicial
  diseases: [],
  loading: false,
  error: null,
  masterList: [],
  masterListLoading: false,

  // --- ACCIONES ---

  clearError: () => set({ error: null }),

  fetchMyDiseases: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const diseases = await diseaseService.getMyDiseases();
      set({ diseases, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch diseases', loading: false });
    }
  },

  addDisease: async (data: PatientDiseaseCreate) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDisease(data);
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add disease' });
      throw e;
    }
  },

  // Implementación de la nueva acción
  addDiseaseFromCode: async (data: DiseaseCreateFromCode) => {
    set({ error: null });
    try {
      const newDisease = await diseaseService.createDiseaseFromCode(data);
      set((state) => ({
        diseases: [...state.diseases, newDisease].sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add disease from code' });
      throw e;
    }
  },

  editDisease: async (uuid: string, data: PatientDiseaseUpdate) => {
    set({ error: null });
    try {
      const updatedDisease = await diseaseService.updateDisease(uuid, data);
      set((state) => ({
        diseases: state.diseases.map((d) => (d.uuid === uuid ? updatedDisease : d)).sort((a, b) => new Date(b.diagnosis_date).getTime() - new Date(a.diagnosis_date).getTime()),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to update disease' });
      throw e;
    }
  },

  removeDisease: async (uuid: string) => {
    await diseaseService.deleteDisease(uuid);
    set((state) => ({ diseases: state.diseases.filter((d) => d.uuid !== uuid) }));
  },

  fetchMasterList: async () => {
    if (get().masterListLoading || get().masterList.length > 0) return;
    set({ masterListLoading: true });
    try {
      const masterList = await diseaseService.getDiseasesMasterList();
      set({ masterList, masterListLoading: false });
    } catch (e: any) {
      console.error('Failed to fetch diseases master list:', e.message);
      set({ masterListLoading: false });
    }
  },
}));
