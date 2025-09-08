import { create } from 'zustand';
import {
  AllergyCreate,
  AllergyRead,
  AllergyUpdate,
  ReactionHistoryCreate,
  AllergyCreateFromCode, // Importar la nueva interfaz
} from '@/interfaces/client/allergy.interface';
import { allergyService } from '@/services/client/allergyService';

interface AllergyState {
  allergies: AllergyRead[];
  loading: boolean;
  error: string | null;
  fetchMyAllergies: () => Promise<void>;
  addAllergy: (data: AllergyCreate) => Promise<AllergyRead>;
  addAllergyFromCode: (data: AllergyCreateFromCode) => Promise<void>; // Nueva acción
  editAllergy: (uuid: string, data: AllergyUpdate) => Promise<AllergyRead>;
  removeAllergy: (uuid: string) => Promise<void>;
  addNewReaction: (allergyUuid: string, data: ReactionHistoryCreate) => Promise<void>;
  clearError: () => void;
}

export const useAllergyStore = create<AllergyState>((set, get) => ({
  allergies: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMyAllergies: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const allergies = await allergyService.getMyAllergies();
      set({ allergies, loading: false });
    } catch (e: any) {
      set({ error: e.message || 'Failed to fetch allergies', loading: false });
    }
  },

  addAllergy: async (data: AllergyCreate) => {
    set({ loading: true, error: null });
    try {
      const newAllergy = await allergyService.createAllergy(data);
      set((state) => ({
        allergies: [...state.allergies, newAllergy],
        loading: false,
      }));
      return newAllergy;
    } catch (e: any) {
      set({ error: e.message || 'Failed to add allergy', loading: false });
      throw e;
    }
  },

  // Implementación de la nueva acción
  addAllergyFromCode: async (data: AllergyCreateFromCode) => {
    set({ error: null });
    try {
      const newAllergy = await allergyService.createAllergyFromCode(data);
      set((state) => ({
        allergies: [...state.allergies, newAllergy],
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add allergy from code' });
      throw e;
    }
  },

  editAllergy: async (uuid: string, data: AllergyUpdate) => {
    set({ loading: true, error: null });
    try {
      const updatedAllergy = await allergyService.updateAllergy(uuid, data);
      set((state) => ({
        allergies: state.allergies.map((a) => (a.uuid === uuid ? updatedAllergy : a)),
        loading: false,
      }));
      return updatedAllergy;
    } catch (e: any) {
      set({ error: e.message || 'Failed to update allergy', loading: false });
      throw e;
    }
  },

  removeAllergy: async (uuid: string) => {
    try {
      await allergyService.deleteAllergy(uuid);
      set((state) => ({
        allergies: state.allergies.filter((a) => a.uuid !== uuid),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to delete allergy' });
      throw e;
    }
  },

  addNewReaction: async (allergyUuid: string, data: ReactionHistoryCreate) => {
    try {
      const updatedAllergy = await allergyService.addReactionToAllergy(allergyUuid, data);
       set((state) => ({
        allergies: state.allergies.map((a) => (a.uuid === allergyUuid ? updatedAllergy : a)),
      }));
    } catch (e: any) {
      set({ error: e.message || 'Failed to add reaction' });
      throw e;
    }
  },
}));
