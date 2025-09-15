'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';

// Import authentication service and error handling utilities
import { authService } from '@/services/auth/authService';
import { getApiErrorMessage } from '@/services/apiErrors';

/**
 * Generates the Zod schema for the forgot password form validation.
 * @param t - The translation function from `react-i18next`.
 * @returns {z.ZodObject} The Zod schema for the form.
 */
const getForgotPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string().email({ message: t('validation.emailInvalid') }),
});

// Type definition for the form inputs, inferred from the Zod schema.
type ForgotPasswordFormInputs = z.infer<ReturnType<typeof getForgotPasswordSchema>>;

/**
 * ForgotPasswordPage Component
 *
 * @component
 * @returns {React.ReactElement} The password recovery page.
 *
 * @description This component provides a form for users to request a password reset link.
 * It collects the user's email, validates it, and calls the authentication service.
 * For security reasons, it displays a generic success message to prevent email enumeration attacks.
 */
export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const forgotPasswordSchema = getForgotPasswordSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  /**
   * Handles the form submission for the password reset request.
   * @param {ForgotPasswordFormInputs} data - The validated form data.
   */
  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await authService.requestPasswordReset(data.email);
      // Display a generic success message regardless of whether the email exists or not.
      // This is a security measure to prevent attackers from discovering registered email addresses.
      setFeedback({ 
        type: 'success', 
        message: t('auth_forgot_password.successMessage') 
      });
    } catch (error) {
      // Even in case of a server error, we show the same generic success message.
      // The actual error can be logged to a monitoring service for debugging.
      console.error("Password reset request failed:", getApiErrorMessage(error));
      setFeedback({ 
        type: 'success', 
        message: t('auth_forgot_password.successMessage') 
      });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {t('auth_forgot_password.title')}
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          {t('auth_forgot_password.subtitle')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Feedback alert is displayed here */}
          {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
          
          {/* The form is hidden after a successful submission to prevent resubmission */}
          {!feedback || feedback.type === 'error' ? (
            <>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth_forgot_password.emailLabel')}
                    type="email"
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? t('auth_forgot_password.submittingButton') : t('auth_forgot_password.submitButton')}
              </Button>
            </>
          ) : null}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <MuiLink component={Link} href="/auth/login" variant="body2">
              {t('auth_forgot_password.backToLoginLink')}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
