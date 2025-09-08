import api from '../api';
import { AuthResponse } from '@/interfaces/auth-response.interface';
import { AuthCredentials } from '@/interfaces/auth-credentials.interface';
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';
import { ChangePasswordDto } from "@/interfaces/auth/change-password.dto";

const AUTH_BASE_PATH = '/auth';
const CLIENTS_BASE_PATH = '/clients';

/**
 * Registers a new user.
 */
const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${AUTH_BASE_PATH}/register`,
    payload
  );
  return response.data;
};

/**
 * Logs in a user.
 */
const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${AUTH_BASE_PATH}/login`,
    credentials
  );
  return response.data;
};

/**
 * Changes the password for the authenticated user.
 */
const changePassword = async (passwordData: ChangePasswordDto): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/change-password`, passwordData);
};

/**
 * Initiates the password reset process.
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/reset-password`, { email });
};

/**
 * Deletes the currently authenticated user's account.
 */
const deleteAccount = async (): Promise<void> => {
  await api.delete(`${CLIENTS_BASE_PATH}/me`);
};

export const authService = {
  register,
  login,
  changePassword,
  requestPasswordReset,
  deleteAccount, // Añadir la nueva función
};
