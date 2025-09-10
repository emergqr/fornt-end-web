'use client';

/**
 * @file This file centralizes all API service calls related to user authentication.
 * It provides a clean and reusable interface for handling registration, login, password changes, and account deletion.
 */

import api from '../api';
import { AuthResponse } from '@/interfaces/auth-response.interface';
import { AuthCredentials } from '@/interfaces/auth-credentials.interface';
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';
import { ChangePasswordDto } from "@/interfaces/auth/change-password.dto";

// Defines the base paths for the authentication and client-related API endpoints.
const AUTH_BASE_PATH = '/auth';
const CLIENTS_BASE_PATH = '/clients';

/**
 * Registers a new user with the provided payload.
 * Corresponds to the POST /auth/register endpoint.
 * @param {RegisterPayload} payload - The user's registration data (name, email, password).
 * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response, including a token and user data.
 */
const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    `${AUTH_BASE_PATH}/register`,
    payload
  );
  return response.data;
};

/**
 * Logs in a user with the given credentials.
 * Corresponds to the POST /auth/login endpoint.
 * @param {AuthCredentials} credentials - The user's email and password.
 * @returns {Promise<AuthResponse>} A promise that resolves with the authentication response.
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
 * Corresponds to the POST /auth/change-password endpoint.
 * @param {ChangePasswordDto} passwordData - The old and new password data.
 * @returns {Promise<void>} A promise that resolves when the password has been successfully changed.
 */
const changePassword = async (passwordData: ChangePasswordDto): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/change-password`, passwordData);
};

/**
 * Initiates the password reset process for a given email address.
 * Corresponds to the POST /auth/reset-password endpoint.
 * @param {string} email - The user's email address.
 * @returns {Promise<void>} A promise that resolves when the request has been successfully sent.
 */
const requestPasswordReset = async (email: string): Promise<void> => {
  await api.post(`${AUTH_BASE_PATH}/reset-password`, { email });
};

/**
 * Deletes the account of the currently authenticated user.
 * Corresponds to the DELETE /clients/me endpoint.
 * @returns {Promise<void>} A promise that resolves when the account has been successfully deleted.
 */
const deleteAccount = async (): Promise<void> => {
  await api.delete(`${CLIENTS_BASE_PATH}/me`);
};

/**
 * An object that groups all authentication-related service functions for easy import and usage.
 */
export const authService = {
  register,
  login,
  changePassword,
  requestPasswordReset,
  deleteAccount,
};
