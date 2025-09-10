/**
 * @file This file provides a collection of reusable validation functions to ensure
 * data integrity and consistency across the application.
 */

/**
 * Validates if a given string is a well-formed email address.
 * @param {string} email - The email string to validate.
 * @returns {boolean} `true` if the email follows a standard format, `false` otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // This regex provides a basic check for the email format: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a password meets the application's security criteria.
 * Criteria: 8-64 characters, at least one uppercase letter, one lowercase letter,
 * one number, and one special character from the set: $%&-.?¡¿!+_
 * @param {string} password - The password string to validate.
 * @returns {boolean} `true` if the password meets the security requirements, `false` otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  // This regex enforces the password policy using positive lookaheads.
  const passeRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$%&\-.?¡¿!+_])[a-zA-Z\d$%&\-.?¡¿!+_]{8,64}$/;
  return passeRegex.test(password);
};
