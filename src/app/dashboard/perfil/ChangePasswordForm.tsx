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

import { authService } from '@/services/auth/authService';
import { getApiErrorMessage } from '@/services/apiErrors';

const passwordSchema = z.object({
  old_password: z.string().min(6, "La contraseña actual es requerida"),
  new_password: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
  new_passwordRepeat: z.string().min(6, "Debes repetir la nueva contraseña"),
}).refine((data) => data.new_password === data.new_passwordRepeat, {
  message: "Las nuevas contraseñas no coinciden",
  path: ["new_passwordRepeat"],
});

type PasswordFormInputs = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_passwordRepeat: '',
    },
  });

  const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await authService.changePassword(data);
      setFeedback({ type: 'success', message: '¡Contraseña cambiada con éxito!' });
      reset();
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFeedback({ type: 'error', message });
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Cambiar Contraseña
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
        {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
        <Controller
          name="old_password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Contraseña Actual"
              type="password"
              fullWidth
              margin="normal"
              required
              error={!!errors.old_password}
              helperText={errors.old_password?.message}
            />
          )}
        />
        <Controller
          name="new_password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nueva Contraseña"
              type="password"
              fullWidth
              margin="normal"
              required
              error={!!errors.new_password}
              helperText={errors.new_password?.message}
            />
          )}
        />
        <Controller
          name="new_passwordRepeat"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Repetir Nueva Contraseña"
              type="password"
              fullWidth
              margin="normal"
              required
              error={!!errors.new_passwordRepeat}
              helperText={errors.new_passwordRepeat?.message}
            />
          )}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Cambiando...' : 'Cambiar Contraseña'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
