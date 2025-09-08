import api from '../api';
import { AuthResponse } from '@/interfaces/auth-response.interface';
import { AuthCredentials } from '@/interfaces/auth-credentials.interface';
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';
import { ChangePasswordDto } from "@/interfaces/auth/change-password.dto";

// Define the base path for authentication endpoints for clarity.
const AUTH_BASE_PATH = '/auth';

/**
 * Registers a new user with the provided credentials.
 * @param payload - The user's registration data.
 * @returns A promise that resolves to an object containing the auth token and client data.
 */
const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${AUTH_BASE_PATH}/register`,
    payload
  );
  return response.data;
};

/**
 * Logs in a user with the provided credentials.
 * @param credentials - The user's email and password.
 * @returns A promise that resolves to an object containing the auth token and client data.
 */
const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${AUTH_BASE_PATH}/login`,
    credentials
  );
  return response.data;
};

/**
 * Changes the password for the currently authenticated user.
 * @param passwordData - The old and new password data.
 */
const changePassword = async (passwordData: ChangePasswordDto): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/change-password`, passwordData);
};

/**
 * Initiates the password reset process for a given email.
 * @param email - The user's email.
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/reset-password`, { email });
};

// Export all functions as a single service object for consistent usage.
export const authService = {
  register,
  login,
  changePassword,
  requestPasswordReset,
};
