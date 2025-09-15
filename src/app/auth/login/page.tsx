'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';

// Import authentication store and service
import { useAuthStore } from '@/store/auth/auth.store';
import { authService } from '@/services/auth/authService';
import { AuthCredentials } from '@/interfaces/auth/auth-credentials.interface';

/**
 * Generates the Zod schema for login form validation, incorporating translations.
 * @param t - The translation function from `react-i18next`.
 * @returns {z.ZodObject} The Zod schema for the login form.
 */
const getLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string().email({ message: t('validation.loginEmailInvalid') }),
  password: z.string().min(6, { message: t('validation.loginPasswordMinLength') }),
});

// Type definition for the form inputs, inferred from the Zod schema.
type LoginFormInputs = z.infer<ReturnType<typeof getLoginSchema>>;

/**
 * LoginPage Component
 *
 * @component
 * @returns {React.ReactElement} The user login page.
 *
 * @description This component provides a form for users to sign in. It handles form state,
 * validation, submission, and displays server-side errors. It also redirects authenticated
 * users away from the login page.
 */
export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Initialize the validation schema with the translation function.
  const loginSchema = getLoginSchema(t);

  // `react-hook-form` setup for form management.
  const {
    control, // To connect controlled components like MUI TextField.
    handleSubmit, // Wrapper for the form submission handler.
    formState: { errors, isSubmitting }, // Form state, including errors and submission status.
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema), // Use Zod for schema validation.
    defaultValues: { email: '', password: '' },
  });

  /**
   * Handles the form submission.
   * @param {LoginFormInputs} data - The validated form data.
   */
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: AuthCredentials) => {
    setServerError(null);
    try {
      const response = await authService.login(data);
      // On successful login, update the auth store and redirect to the dashboard.
      login(response.access_token, response.client);
      router.push('/dashboard');
    } catch (error: any) {
      // On failure, display a server-provided error message or a default one.
      const errorMessage = error.response?.data?.message || t('auth_login.defaultError');
      setServerError(errorMessage);
    }
  };

  // Effect to redirect the user if they are already authenticated.
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">{t('auth_login.title')}</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {/* Display server-side errors here */}
          {serverError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{serverError}</Alert>}
          
          {/* Email Input - Controlled by react-hook-form */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label={t('auth_login.emailLabel')}
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Password Input - Controlled by react-hook-form */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label={t('auth_login.passwordLabel')}
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            {isSubmitting ? t('auth_login.submittingButton') : t('auth_login.submitButton')}
          </Button>
          
          {/* Links for password recovery and registration */}
          <Grid container>
            <Grid item xs>
              <MuiLink component={Link} href="/auth/forgot-password" variant="body2">
                {t('auth_login.forgotPasswordLink')}
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={Link} href="/auth/registro" variant="body2">
                {t('auth_login.noAccountLink')}
              </MuiLink>
            </Grid>
          </Grid>

        </Box>
      </Box>
    </Container>
  );
}
