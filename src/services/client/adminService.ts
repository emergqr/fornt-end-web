'use client';

/**
 * @file This file provides a mock service layer for the Admin Panel.
 * NOTE: This is a temporary implementation using mock data because the corresponding
 * backend endpoints do not exist yet. Once the API is ready, this file should be
 * updated to make real HTTP requests.
 */

import { Client } from '@/interfaces/client/client.interface';

// Mock data representing a list of users in the system.
const mockUsers: Client[] = [
  {
    id: 1,
    uuid: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    email: 'admin@emerqr.com',
    name: 'Admin User',
    is_active: true,
    is_admin: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    uuid: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d1a',
    email: 'test.user@example.com',
    name: 'Test User One',
    is_active: true,
    is_admin: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    uuid: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d1a2b',
    email: 'inactive.user@example.com',
    name: 'Inactive User',
    is_active: false,
    is_admin: false,
    created_at: new Date().toISOString(),
  },
];

/**
 * Simulates fetching a paginated list of all users.
 * @returns {Promise<Client[]>} A promise that resolves with the mock user list.
 */
const getAllClients = async (): Promise<Client[]> => {
  console.warn('Using mock data for getAllClients()');
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUsers;
};

/**
 * Simulates updating a user's admin status.
 * @param {string} uuid - The UUID of the user to update.
 * @param {boolean} isAdmin - The new admin status.
 * @returns {Promise<Client>} A promise that resolves with the updated user data.
 */
const updateUserAdminStatus = async (uuid: string, isAdmin: boolean): Promise<Client> => {
    console.warn(`Simulating update admin status for user: ${uuid}`);
    const user = mockUsers.find(u => u.uuid === uuid);
    if (!user) throw new Error('User not found');
    user.is_admin = isAdmin;
    return user;
};

/**
 * An object that groups all admin-related service functions.
 */
export const adminService = {
  getAllClients,
  updateUserAdminStatus,
};
