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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import { useMedicationStore } from '@/store/medication/medication.store';
import { MedicationScheduleCreate } from '@/interfaces/client/medication.interface';

// Schema for the medication form validation
const medicationSchema = z.object({
  medication_name: z.string().min(2, { message: 'El nombre del medicamento es requerido' }),
  dosage: z.string().min(1, { message: 'La dosis es requerida' }),
  frequency_type: z.string().min(1, { message: 'La frecuencia es requerida' }),
  start_date: z.string().min(1, { message: 'La fecha de inicio es requerida' }),
  end_date: z.string().optional(),
});

type MedicationFormInputs = z.infer<typeof medicationSchema>;

export default function MedicationsPage() {
  const {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
  } = useMedicationStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormInputs>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      medication_name: '',
      dosage: '',
      frequency_type: '',
      start_date: '',
      end_date: '',
    },
  });

  // Fetch schedules when the component mounts
  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const onAddSchedule: SubmitHandler<MedicationFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await addSchedule(data as MedicationScheduleCreate);
      setFeedback({ type: 'success', message: '¡Plan de medicación añadido con éxito!' });
      reset(); // Clear the form
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo añadir el plan.' });
    }
  };

  const onDeleteSchedule = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan de medicación?')) {
      try {
        await deleteSchedule(uuid);
        setFeedback({ type: 'success', message: 'Plan de medicación eliminado.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar el plan.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mis Medicamentos
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onAddSchedule)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">Añadir Nuevo Plan de Medicación</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        
        <Controller
          name="medication_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre del Medicamento"
              fullWidth
              margin="normal"
              required
              error={!!errors.medication_name}
              helperText={errors.medication_name?.message}
            />
          )}
        />

        <Controller
          name="dosage"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Dosis (ej. 1 pastilla, 10mg)"
              fullWidth
              margin="normal"
              required
              error={!!errors.dosage}
              helperText={errors.dosage?.message}
            />
          )}
        />

        <Controller
          name="frequency_type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Frecuencia (ej. Diario, Cada 8 horas)"
              fullWidth
              margin="normal"
              required
              error={!!errors.frequency_type}
              helperText={errors.frequency_type?.message}
            />
          )}
        />

        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de Inicio"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
              required
              error={!!errors.start_date}
              helperText={errors.start_date?.message}
            />
          )}
        />

        <Controller
          name="end_date"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha de Fin (Opcional)"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
          {isSubmitting ? 'Añadiendo...' : 'Añadir Plan'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Planes Registrados</Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && schedules.length === 0 && (
        <Typography sx={{ mt: 2 }}>No tienes planes de medicación registrados.</Typography>
      )}
      <List>
        {schedules.map((schedule) => (
          <ListItem 
            key={schedule.uuid} 
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteSchedule(schedule.uuid)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={`${schedule.medication_name} - ${schedule.dosage}`}
              secondary={`Frecuencia: ${schedule.frequency_type} | Inicia: ${new Date(schedule.start_date).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
