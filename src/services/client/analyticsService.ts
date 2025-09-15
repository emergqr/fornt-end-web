'use client';

/**
 * @file This file provides a service layer for fetching dashboard analytics and reminders.
 */

import api from '@/services/api';
import { HealthSummary, UpcomingReminder } from '@/interfaces/client/analytics.interface';

// Define base paths from environment variables with fallbacks
const ANALYTICS_BASE_URL = process.env.NEXT_PUBLIC_API_ANALYTICS_BASE_URL || '/analytics';
const MEDICAL_HISTORY_BASE_URL = process.env.NEXT_PUBLIC_API_MEDICAL_HISTORY_BASE_URL || '/medical-history';

/**
 * Fetches a summary of key health metrics for the user.
 * Corresponds to the GET /analytics/summary endpoint.
 * @returns {Promise<HealthSummary>} A promise that resolves with the health summary data.
 */
const getHealthSummary = async (): Promise<HealthSummary> => {
  const response = await api.get<HealthSummary>(`${ANALYTICS_BASE_URL}/summary`);
  return response.data;
};

/**
 * Fetches a list of upcoming reminders (appointments and medications) for the user.
 * Corresponds to the GET /medical-history/upcoming-reminders endpoint.
 * @returns {Promise<UpcomingReminder[]>} A promise that resolves with an array of upcoming reminders.
 */
const getUpcomingReminders = async (): Promise<UpcomingReminder[]> => {
  const response = await api.get<UpcomingReminder[]>(`${MEDICAL_HISTORY_BASE_URL}/upcoming-reminders`);
  return response.data;
};

export const analyticsService = {
  getHealthSummary,
  getUpcomingReminders,
};
