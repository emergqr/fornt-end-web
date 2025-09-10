'use client';

/**
 * @file This file defines the Data Transfer Object (DTO) for changing a user's password.
 * It specifies the exact structure of the data payload required by the change password API endpoint.
 */

/**
 * Defines the shape of the object used to send password change requests.
 */
export interface ChangePasswordDto {
  /**
   * The user's current password, required for verification.
   */
  old_password: string;

  /**
   * The new password the user wishes to set.
   */
  new_password: string;

  /**
   * A confirmation of the new password to prevent typos.
   * The backend should validate that this matches `new_password`.
   */
  new_passwordRepeat: string;
}
