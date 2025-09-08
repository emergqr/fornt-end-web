'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Link from 'next/link';
import MuiLink from '@mui/material/Link';

import { authService } from '@/services/auth/authService';
import { getApiErrorMessage } from '@/services/apiErrors';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido' }),
});

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await authService.requestPasswordReset(data.email);
      setFeedback({ 
        type: 'success', 
        message: 'Si existe una cuenta con ese correo, se han enviado las instrucciones para restablecer la contraseña.' 
      });
    } catch (error) {
      // Por seguridad, incluso en caso de error, mostramos un mensaje genérico.
      const message = getApiErrorMessage(error);
      setFeedback({ type: 'error', message });
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Restablecer Contraseña
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
          Introduce tu correo electrónico y te enviaremos un enlace para recuperar tu cuenta.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
          {!feedback || feedback.type === 'error' ? (
            <>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo Electrónico"
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
                {isSubmitting ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
              </Button>
            </>
          ) : null}
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Link href="/auth/login" passHref>
              <MuiLink variant="body2">Volver a Iniciar Sesión</MuiLink>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
