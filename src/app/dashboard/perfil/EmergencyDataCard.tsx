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
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import { useEmergencyDataStore } from '@/store/emergencyData/emergencyData.store';
import { EmergencyDataUpdate } from '@/interfaces/client/emergency-data.interface';

const emergencyDataSchema = z.object({
  blood_type: z.string().optional(),
  social_security_health_system: z.string().optional(),
});

type EmergencyDataFormInputs = z.infer<typeof emergencyDataSchema>;

export default function EmergencyDataCard() {
  const {
    data,
    loading,
    error,
    fetchEmergencyData,
    updateEmergencyData,
  } = useEmergencyDataStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyDataFormInputs>({
    resolver: zodResolver(emergencyDataSchema),
    defaultValues: {
      blood_type: '',
      social_security_health_system: '',
    },
  });

  React.useEffect(() => {
    fetchEmergencyData();
  }, [fetchEmergencyData]);

  React.useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<EmergencyDataFormInputs> = async (formData) => {
    setFeedback(null);
    try {
      await updateEmergencyData(formData as EmergencyDataUpdate);
      setFeedback({ type: 'success', message: '¡Datos de emergencia actualizados con éxito!' });
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo guardar los datos.' });
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Datos de Emergencia
        </Typography>
        {!isEditing && (
          <IconButton onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isEditing ? (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
          <Controller name="blood_type" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label="Grupo Sanguíneo (ej. A+)" fullWidth margin="normal" error={!!errors.blood_type} helperText={errors.blood_type?.message} />} />
          <Controller name="social_security_health_system" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label="Sistema de Salud / Nº Póliza" fullWidth margin="normal" error={!!errors.social_security_health_system} helperText={errors.social_security_health_system?.message} />} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Datos'}</Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography><strong>Grupo Sanguíneo:</strong> {data?.blood_type || 'No especificado'}</Typography>
          <Typography><strong>Sistema de Salud:</strong> {data?.social_security_health_system || 'No especificado'}</Typography>
        </Box>
      )}
    </Paper>
  );
}
