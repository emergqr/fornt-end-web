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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from '@mui/material/Link';

import { useMedicalHistoryStore } from '@/store/medical-history/medical-history.store';
import { MedicalEventCreate } from '@/interfaces/client/medical-history.interface';

// Schema for the medical event form validation
const eventSchema = z.object({
  title: z.string().min(3, { message: 'El título es requerido' }),
  event_type: z.string().min(3, { message: 'El tipo de evento es requerido' }),
  event_date: z.string().min(1, { message: 'La fecha es requerida' }),
  description: z.string().optional(),
  location: z.string().optional(),
  doctor_name: z.string().optional(),
  files: z.custom<FileList>().optional(), // For file uploads
});

type EventFormInputs = z.infer<typeof eventSchema>;

export default function MedicalHistoryPage() {
  const {
    events,
    loading,
    error,
    fetchMedicalHistory,
    addMedicalEvent,
    removeMedicalEvent,
  } = useMedicalHistoryStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInputs>({
    resolver: zodResolver(eventSchema),
  });

  React.useEffect(() => {
    fetchMedicalHistory();
  }, [fetchMedicalHistory]);

  const onAddEvent: SubmitHandler<EventFormInputs> = async (data) => {
    setFeedback(null);
    const { files, ...eventData } = data;
    const fileList = files ? Array.from(files) : [];

    try {
      await addMedicalEvent(eventData as MedicalEventCreate, fileList);
      setFeedback({ type: 'success', message: '¡Evento médico añadido con éxito!' });
      reset();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo añadir el evento.' });
    }
  };

  const onDeleteEvent = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await removeMedicalEvent(uuid);
        setFeedback({ type: 'success', message: 'Evento eliminado.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar el evento.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Historial Médico
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onAddEvent)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">Añadir Nuevo Evento</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        <TextField {...register('title')} label="Título del Evento (ej. Cirugía de rodilla)" fullWidth margin="normal" required error={!!errors.title} helperText={errors.title?.message} />
        <TextField {...register('event_type')} label="Tipo de Evento (ej. Cirugía, Cita, Estudio)" fullWidth margin="normal" required error={!!errors.event_type} helperText={errors.event_type?.message} />
        <TextField {...register('event_date')} label="Fecha del Evento" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.event_date} helperText={errors.event_date?.message} />
        <TextField {...register('description')} label="Descripción (Opcional)" fullWidth margin="normal" multiline rows={2} />
        
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
          Adjuntar Documentos
          <input type="file" {...register('files')} multiple hidden />
        </Button>

        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2, ml: 2 }}>
          {isSubmitting ? 'Añadiendo...' : 'Añadir Evento'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Eventos Registrados</Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && events.length === 0 && (
        <Typography sx={{ mt: 2 }}>No tienes eventos en tu historial médico.</Typography>
      )}
      <List>
        {events.map((event) => (
          <ListItem key={event.uuid} alignItems="flex-start" sx={{ flexDirection: 'column' }}>
            <ListItemText 
              primary={`${event.title} (${event.event_type})`}
              secondary={`Fecha: ${new Date(event.event_date).toLocaleDateString()}`}
            />
            {event.description && <Typography variant="body2" color="text.secondary">{event.description}</Typography>}
            {event.documents && event.documents.length > 0 && (
              <Box mt={1}>
                <Typography variant="subtitle2">Documentos:</Typography>
                {event.documents.map(doc => (
                  <Link href={doc.url} target="_blank" rel="noopener noreferrer" key={doc.uuid} sx={{ display: 'block' }}>
                    {doc.file_name}
                  </Link>
                ))}
              </Box>
            )}
             <IconButton edge="end" aria-label="delete" onClick={() => onDeleteEvent(event.uuid)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
