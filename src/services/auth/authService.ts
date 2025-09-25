'use client';

/**
 * @file This file centralizes all API service calls related to user authentication.
 * It relies on environment variables for all endpoint paths.
 */

import api from '@/services/api'
import { AuthResponse } from '@/interfaces/auth-response.interface';
import { AuthCredentials } from '@/interfaces/auth-credentials.interface';
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';
import { ChangePasswordDto } from "@/interfaces/auth/change-password.dto";

// Define API paths directly from environment variables
const REGISTER_PATH = process.env.NEXT_PUBLIC_API_AUTH_REGISTER || '/auth/register'
const AUTH_REGISTER_PATH = process.env.NEXT_PUBLIC_API_AUTH || '/auth'
const LOGIN_PATH = process.env.NEXT_PUBLIC_API_AUTH_LOGIN || '/login';
const CHANGE_PASSWORD_PATH = process.env.NEXT_PUBLIC_API_CHANGUE_PASSWORD || '/change-password';
const RESET_PASSWORD_PATH = process.env.NEXT_PUBLIC_API_RESET_PASSWORD || '/reset-password';
const DELETE_ACCOUNT_PATH = process.env.NEXT_PUBLIC_API_CLIENT_ME_BASE || '/clients/me';

/**
 * Registers a new user.
 */
const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(AUTH_REGISTER_PATH+REGISTER_PATH, payload);
  return response.data;
};

/**
 * Logs in a user.
 */
const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(AUTH_REGISTER_PATH+LOGIN_PATH, credentials);
  return response.data;
};

/**
 * Changes the password for the currently authenticated user.
 */
const changePassword = async (passwordData: ChangePasswordDto): Promise<void> => {
  await api.post(AUTH_REGISTER_PATH+CHANGE_PASSWORD_PATH, passwordData);
};

/**
 * Initiates the password reset process for a given email address.
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post(AUTH_REGISTER_PATH+RESET_PASSWORD_PATH, { email });
};

/**
 * Deletes the account of the currently authenticated user.
 */
const deleteAccount = async (): Promise<void> => {
  await api.delete(DELETE_ACCOUNT_PATH);
};

export const authService = {
  register,
  login,
  changePassword,
  requestPasswordReset,
  deleteAccount,
};
