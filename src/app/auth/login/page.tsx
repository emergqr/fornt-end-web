'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth/auth.store';
import { authService } from '@/services/auth/authService';
import { AuthCredentials } from '@/interfaces/auth/auth-credentials.interface';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data: AuthCredentials) => {
    setServerError(null);
    try {
      const response = await authService.login(data);
      login(response.access_token, response.client);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
      setServerError(errorMessage);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <Container maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {serverError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{serverError}</Alert>}
          
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
                label="Correo Electrónico"
                autoComplete="email"
                autoFocus
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
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
          <Box textAlign="center">
            <Link href="/auth/registro" passHref>
               <MuiLink variant="body2">¿No tienes una cuenta? Regístrate</MuiLink>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
