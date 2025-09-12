/**
 * @file Defines the interfaces for the analytics and dashboard widgets.
 * Corresponds to the schemas in openapi.json.
 */

/**
 * Represents the health summary data with key metrics about the user's profile.
 */
export interface HealthSummary {
  [key: string]: any; // Allows for a flexible structure of key-value pairs.
}

/**
 * Represents a single upcoming reminder, which can be a medical appointment or a medication dose.
 */
export interface UpcomingReminder {
  type: 'appointment' | 'medication';
  datetime: string; // ISO 8601 format
  title: string;
  details: string;
  uuid: string;
}
