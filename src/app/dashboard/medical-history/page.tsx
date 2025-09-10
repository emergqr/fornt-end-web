'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

import { useMedicalHistoryStore } from '@/store/medical-history/medical-history.store';
import { MedicalEventCreate } from '@/interfaces/client/medical-history.interface';
import { getMedicalEventTypes } from '@/services/client/medicalHistoryService';

const getEventSchema = (t: (key: string) => string) => z.object({
  title: z.string().min(3, { message: t('validation.titleRequired') }),
  event_type: z.string().min(1, { message: t('validation.eventTypeRequired') }),
  event_date: z.string().min(1, { message: t('validation.eventDateRequired') }),
  description: z.string().optional(),
  location: z.string().optional(),
  doctor_name: z.string().optional(),
  files: z.custom<FileList>().optional(),
});

type EventFormInputs = z.infer<ReturnType<typeof getEventSchema>>;

export default function MedicalHistoryPage() {
  const { t } = useTranslation();
  const {
    events,
    loading,
    error,
    fetchMedicalHistory,
    addMedicalEvent,
    removeMedicalEvent,
  } = useMedicalHistoryStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [eventTypes, setEventTypes] = React.useState<string[]>([]);
  const [eventTypesLoading, setEventTypesLoading] = React.useState(true);

  const eventSchema = getEventSchema(t);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInputs>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      event_type: '',
      event_date: '',
      description: '',
      location: '',
      doctor_name: '',
    },
  });

  React.useEffect(() => {
    fetchMedicalHistory();
  }, [fetchMedicalHistory]);

  React.useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setEventTypesLoading(true);
        const types = await getMedicalEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error("Failed to fetch event types", error);
        setFeedback({ type: 'error', message: t('dashboard_history.feedback.fetchTypesError') });
      } finally {
        setEventTypesLoading(false);
      }
    };

    fetchEventTypes();
  }, [t]);

  const onAddEvent: SubmitHandler<EventFormInputs> = async (data) => {
    setFeedback(null);
    const { files, ...eventData } = data;
    const fileList = files ? Array.from(files) : [];

    try {
      await addMedicalEvent(eventData as MedicalEventCreate, fileList);
      setFeedback({ type: 'success', message: t('dashboard_history.feedback.addSuccess') });
      reset();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_history.feedback.addError') });
    }
  };

  const onDeleteEvent = async (uuid: string) => {
    if (window.confirm(t('dashboard_history.feedback.deleteConfirm'))) {
      try {
        await removeMedicalEvent(uuid);
        setFeedback({ type: 'success', message: t('dashboard_history.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_history.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard_history.title')}
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit(onAddEvent)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">{t('dashboard_history.form.title')}</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField {...field} label={t('dashboard_history.form.titleLabel')} fullWidth margin="normal" required error={!!errors.title} helperText={errors.title?.message} />
          )}
        />

        <Controller
          name="event_type"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" required error={!!errors.event_type}>
              <InputLabel id="event-type-select-label">{t('dashboard_history.form.typeLabel')}</InputLabel>
              <Select
                {...field}
                labelId="event-type-select-label"
                label={t('dashboard_history.form.typeLabel')}
                disabled={eventTypesLoading}
              >
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              {errors.event_type && <FormHelperText error>{errors.event_type.message}</FormHelperText>}
            </FormControl>
          )}
        />

        <Controller
          name="event_date"
          control={control}
          render={({ field }) => (
            <TextField {...field} label={t('dashboard_history.form.dateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.event_date} helperText={errors.event_date?.message} />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField {...field} label={t('dashboard_history.form.descriptionLabel')} fullWidth margin="normal" multiline rows={2} />
          )}
        />
        
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
          {t('dashboard_history.form.attachButton')}
          <input type="file" {...register('files')} multiple hidden />
        </Button>

        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2, ml: 2 }}>
          {isSubmitting ? t('dashboard_history.form.submittingButton') : t('dashboard_history.form.submitButton')}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">{t('dashboard_history.list.title')}</Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && events.length === 0 && (
        <Typography sx={{ mt: 2 }}>{t('dashboard_history.list.noEvents')}</Typography>
      )}
      <List>
        {events.map((event) => (
          <ListItem key={event.uuid} alignItems="flex-start" sx={{ flexDirection: 'column' }}>
            <ListItemText 
              primary={`${event.title} (${event.event_type})`}
              secondary={`${t('dashboard_history.list.dateLabel')} ${new Date(event.event_date).toLocaleDateString()}`}
            />
            {event.description && <Typography variant="body2" color="text.secondary">{event.description}</Typography>}
            {event.documents && event.documents.length > 0 && (
              <Box mt={1}>
                <Typography variant="subtitle2">{t('dashboard_history.list.documentsLabel')}</Typography>
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
