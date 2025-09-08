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
import { RegisterPayload } from '@/interfaces/auth/register-payload.interface';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Por favor, introduce un email válido' }),
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  passwordRepeat: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
}).refine((data) => data.password === data.passwordRepeat, {
  message: "Las contraseñas no coinciden",
  path: ["passwordRepeat"],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [serverError, setServerError] = React.useState<string | null>(null);

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

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data: RegisterPayload) => {
    setServerError(null);
    try {
      const response = await authService.register(data);
      login(response.access_token, response.client);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'No se pudo completar el registro. Por favor, inténtalo de nuevo.';
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
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Crear una cuenta
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
                label="Nombre Completo"
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
                label="Correo Electrónico"
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
                label="Contraseña"
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
                label="Repetir Contraseña"
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
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
          <Box textAlign="center">
            <Link href="/auth/login" passHref>
               <MuiLink variant="body2">¿Ya tienes una cuenta? Inicia sesión</MuiLink>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
