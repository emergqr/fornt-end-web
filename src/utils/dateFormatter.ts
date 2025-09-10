/**
 * @file This file provides utility functions for formatting dates, ensuring a consistent
 * date representation between the API and the user interface.
 */

/**
 * Formats a Date object or a date string into the 'YYYY-MM-DD' format required by the API.
 * This function handles various input types, including Date objects, valid date strings, or null/undefined values,
 * returning a standardized string or null.
 * 
 * @param {Date | string | null | undefined} date - The Date object or string to format.
 * @returns {string | null} A formatted date string in 'YYYY-MM-DD' format, or null if the input is invalid.
 */
export const formatDateForApi = (
  date: Date | string | null | undefined,
): string | null => {
  if (!date) {
    return null;
  }

  // If the input is already a Date object, use it; otherwise, parse the string.
  const dateObj = date instanceof Date ? date : new Date(date);

  // Check if the resulting date is valid. `new Date('invalid-string')` results in an invalid date.
  if (isNaN(dateObj.getTime())) {
    return null;
  }

  // `toISOString()` returns 'YYYY-MM-DDTHH:mm:ss.sssZ'. We split at 'T' to get the date part,
  // ensuring a consistent UTC-based format for the API.
  return dateObj.toISOString().split('T')[0];
};

/**
 * Formats a Date object or a date string into a user-friendly, localized format (e.g., 'DD/MM/YYYY').
 * 
 * @param {Date | string | null | undefined} date - The Date object or string to format.
 * @returns {string} A formatted date string for display, or an empty string if the date is invalid.
 */
export const formatDateForDisplay = (
  date: Date | string | null | undefined,
): string => {
  if (!date) {
    return '';
  }

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // `toLocaleDateString` is used to format the date according to the user's locale,
  // which is generally preferred for display purposes. The 'es-ES' is an example locale.
  // For more advanced formatting, a library like `date-fns` would be beneficial.
  return dateObj.toLocaleDateString('es-ES');
};