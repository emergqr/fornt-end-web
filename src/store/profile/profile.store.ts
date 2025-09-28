import { create } from 'zustand';

import { getApiErrorMessage } from '@/services/apiErrors';
import { profileService} from '@/services/profileService';
import { useAuthStore } from '../auth/auth.store';
import { ClientFullProfile } from '@/interfaces/client/client-full-profile.interface';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import { recursiveUrlCorrection } from '@/services/api';

// --- STORE INTERFACE ---
interface ProfileState {
  profile: ClientFullProfile | null;
  isFetching: boolean; // For initial profile load
  isUpdating: boolean; // For updating profile fields
  isUploadingAvatar: boolean; // For avatar upload specifically
  error: string | null;
  fetchProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  updateProfile: (data: ClientUpdate) => Promise<void>;
}

// --- ZUSTAND STORE ---
export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isFetching: false,
  isUpdating: false,
  isUploadingAvatar: false,
  error: null,

  fetchProfile: async () => {
    set({ isFetching: true, error: null });
    try {
      const profileData = await profileService.getFullProfile();
      // Apply the URL correction to the raw data from the API.
      const correctedProfile = recursiveUrlCorrection(profileData);

      set({ profile: correctedProfile, isFetching: false });

      // Update the user in the auth store to keep them in sync.
      // This ensures that if the profile is re-fetched, the header/drawer
      // also get the latest information (e.g., updated name).
      useAuthStore.getState().setUser(correctedProfile);
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isFetching: false, error: errorMessage, profile: null });
    }
  },

  updateProfile: async (data: ClientUpdate) => {
    set({ isUpdating: true, error: null });
    try {
      await profileService.updateProfile(data);
      // Re-fetch the full profile to ensure all data is consistent after update.
      await get().fetchProfile();
      set({ isUpdating: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({
        isUpdating: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  uploadAvatar: async (file: File) => {
    set({ isUploadingAvatar: true, error: null });
    try {
      await profileService.uploadAvatar(file);
      // Re-fetch the full profile to get the new avatar URL and ensure consistency.
      await get().fetchProfile();
      set({ isUploadingAvatar: false });
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      set({ isUploadingAvatar: false, error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
