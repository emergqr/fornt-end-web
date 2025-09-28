'use client';

/**
 * @file This file provides a service layer for interacting with the contact-related API endpoints.
 * It relies on environment variables for all endpoint paths.
 */

import api from '@/services/api';
import { Contact, ContactCreate, ContactUpdate } from '@/interfaces/client/contact.interface';

// The full base path for the contacts API, read from environment variables.
const CONTACTS_PATH = process.env.NEXT_PUBLIC_API_CONTACTS_PATH || '/api/v1/contacts';

/**
 * Fetches the list of contacts for the authenticated client.
 * @returns {Promise<Contact[]>} A promise that resolves with an array of the client's contacts.
 */
const getContacts = async (): Promise<Contact[]> => {
    const response = await api.get<Contact[]>(CONTACTS_PATH);
    return response.data;
};

/**
 * Creates a new contact for the authenticated client.
 * @param {ContactCreate} data - The data for the new contact.
 * @returns {Promise<Contact>} A promise that resolves with the newly created contact data.
 */
const createContact = async (data: ContactCreate): Promise<Contact> => {
    const response = await api.post<Contact>(CONTACTS_PATH, data);
    return response.data;
};

/**
 * Updates an existing contact by its UUID.
 * @param {string} uuid - The unique identifier of the contact to update.
 * @param {ContactUpdate} data - An object containing the contact fields to update.
 * @returns {Promise<Contact>} A promise that resolves with the updated contact data.
 */
const updateContact = async (uuid: string, data: ContactUpdate): Promise<Contact> => {
    const response = await api.put<Contact>(`${CONTACTS_PATH}/${uuid}`, data);
    return response.data;
};

/**
 * Deletes a contact by its UUID.
 * @param {string} uuid - The unique identifier of the contact to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is successful.
 */
const deleteContact = async (uuid: string): Promise<void> => {
    await api.delete<void>(`${CONTACTS_PATH}/${uuid}`);
};

/**
 * An object that groups all contact-related service functions for easy import and usage.
 */
export const contactService = {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
};