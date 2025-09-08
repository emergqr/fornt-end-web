'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Alert,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

import { useAuthStore } from '@/store/auth/auth.store';
import { profileService } from '@/services/profileService';
import { ClientUpdate } from '@/interfaces/client/client-update.interface';
import EmergencyContacts from './EmergencyContacts';
import ProfileAvatar from './ProfileAvatar';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
});

type ProfileFormInputs = z.infer<typeof profileSchema>;

export default function PerfilPage() {
  const { user, setUser } = useAuthStore();
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      phone: '',
      birth_date: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
      });
    }
  }, [user, reset]);

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data: ClientUpdate) => {
    setFeedback(null);
    try {
      const updatedUser = await profileService.updateProfile(data);
      setUser(updatedUser);
      setFeedback({ type: 'success', message: '¡Perfil actualizado con éxito!' });
    } catch (error: unknown) {
      let errorMessage = 'No se pudo actualizar el perfil.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setFeedback({ type: 'error', message: errorMessage });
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Mi Perfil
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Grid container spacing={4}>
          {/* --- Avatar Column --- */}
          <Grid component="div" item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProfileAvatar />
            <Typography variant="h5" sx={{ mt: 2 }}>{user.name}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Grid>

          {/* --- Form Column --- */}
          <Grid component="div" item xs={12} md={8}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              {feedback && (
                <Alert severity={feedback.type} sx={{ mb: 2 }}>
                  {feedback.message}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid component="div" item xs={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth required id="name" label="Nombre Completo" error={!!errors.name} helperText={errors.name?.message} />
                    )}
                  />
                </Grid>
                <Grid component="div" item xs={12}>
                  <TextField fullWidth disabled id="email" label="Correo Electrónico" value={user.email} />
                </Grid>
                <Grid component="div" item xs={12} sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth id="phone" label="Teléfono" error={!!errors.phone} helperText={errors.phone?.message} />
                    )}
                  />
                </Grid>
                <Grid component="div" item xs={12} sm={6}>
                  <Controller
                    name="birth_date"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} fullWidth id="birth_date" label="Fecha de Nacimiento" type="date" InputLabelProps={{ shrink: true }} error={!!errors.birth_date} helperText={errors.birth_date?.message} />
                    )}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <EmergencyContacts />

    </Container>
  );
}
