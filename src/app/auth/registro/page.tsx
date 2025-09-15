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
import { useRouter } from 'next/navigation';

// Import authentication store, service, and interfaces
import { useAuthStore } from '@/store/auth/auth.store';
import { authService } from '@/services/auth/authService';
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';

/**
 * Generates the Zod schema for the registration form validation.
 * @param t - The translation function from `react-i18next`.
 * @returns {z.ZodObject} The Zod schema for the registration form.
 * @description Includes a `.refine()` method to ensure password and passwordRepeat fields match.
 */
const getRegisterSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.registerNameMinLength') }),
  email: z.string().email({ message: t('validation.emailInvalid') }),
  password: z.string().min(6, { message: t('validation.registerPasswordMinLength') }),
  passwordRepeat: z.string().min(6, { message: t('validation.registerPasswordRepeatMinLength') }),
}).refine((data) => data.password === data.passwordRepeat, {
  message: t('validation.registerPasswordsDoNotMatch'),
  path: ["passwordRepeat"], // Specifies which field the error message should be attached to.
});

// Type definition for the form inputs, inferred from the Zod schema.
type RegisterFormInputs = z.infer<ReturnType<typeof getRegisterSchema>>;

/**
 * RegisterPage Component
 *
 * @component
 * @returns {React.ReactElement} The user registration page.
 *
 * @description This component provides a form for new users to create an account.
 * It handles form validation, including password confirmation, and manages the registration
 * process through the authentication service and store.
 */
export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const registerSchema = getRegisterSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordRepeat: '',
    },
  });

  /**
   * Handles the form submission for user registration.
   * @param {RegisterFormInputs} data - The validated form data.
   */
  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data: RegisterPayload) => {
    setServerError(null);
    try {
      const response = await authService.register(data);
      // On successful registration, log the user in and redirect to the dashboard.
      login(response.access_token, response.client);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('auth_register.defaultError');
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
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('auth_register.title')}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {serverError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {serverError}
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="name"
                label={t('auth_register.nameLabel')}
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
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
                label={t('auth_register.emailLabel')}
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label={t('auth_register.passwordLabel')}
                type="password"
                id="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          <Controller
            name="passwordRepeat"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label={t('auth_register.passwordRepeatLabel')}
                type="password"
                id="passwordRepeat"
                autoComplete="new-password"
                error={!!errors.passwordRepeat}
                helperText={errors.passwordRepeat?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth_register.submittingButton') : t('auth_register.submitButton')}
          </Button>
          <Box textAlign="center">
            <MuiLink component={Link} href="/auth/login" variant="body2">
              {t('auth_register.hasAccountLink')}
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
