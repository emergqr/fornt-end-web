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

// Import stores and interfaces
import { useMedicationStore } from '@/store/medication/medication.store';
import { MedicationScheduleCreate } from '@/interfaces/client/medication.interface';

/**
 * Zod schema for medication form validation.
 * Ensures all required fields are filled correctly.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema for the medication form.
 */
const getMedicationSchema = (t: (key: string) => string) => z.object({
  medication_name: z.string().min(2, { message: t('validation.medicationNameRequired') }),
  dosage: z.string().min(1, { message: t('validation.dosageRequired') }),
  frequency_type: z.string().min(1, { message: t('validation.frequencyRequired') }),
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  end_date: z.string().optional(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type MedicationFormInputs = z.infer<ReturnType<typeof getMedicationSchema>>;

/**
 * Renders the medications management page.
 * This component allows users to add, view, and delete their medication schedules.
 */
export default function MedicationsPage() {
  const { t } = useTranslation();
  const {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
  } = useMedicationStore();

  // State for user feedback messages (e.g., success, error).
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize the form validation schema with the translation function.
  const medicationSchema = getMedicationSchema(t);

  // React Hook Form setup for form state management and validation.
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

  // Fetch user's medication schedules when the component mounts.
  React.useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Form submission handler for adding a new medication schedule.
  const onAddSchedule: SubmitHandler<MedicationFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await addSchedule(data as MedicationScheduleCreate);
      setFeedback({ type: 'success', message: t('dashboard_medications.feedback.addSuccess') });
      reset(); // Clear the form after successful submission.
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_medications.feedback.addError') });
    }
  };

  // Handler to delete a medication schedule with a confirmation dialog.
  const onDeleteSchedule = async (uuid: string) => {
    if (window.confirm(t('dashboard_medications.feedback.deleteConfirm'))) {
      try {
        await deleteSchedule(uuid);
        setFeedback({ type: 'success', message: t('dashboard_medications.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_medications.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard_medications.title')}
      </Typography>
      
      {/* Add New Medication Plan Form */}
      <Box component="form" onSubmit={handleSubmit(onAddSchedule)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">{t('dashboard_medications.form.title')}</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        
        <Controller
          name="medication_name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('dashboard_medications.form.medicationNameLabel')}
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
              label={t('dashboard_medications.form.dosageLabel')}
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
              label={t('dashboard_medications.form.frequencyLabel')}
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
              label={t('dashboard_medications.form.startDateLabel')}
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
              label={t('dashboard_medications.form.endDateLabel')}
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="normal"
            />
          )}
        />
        
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
          {isSubmitting ? t('dashboard_medications.form.submittingButton') : t('dashboard_medications.form.submitButton')}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* List of Registered Medication Plans */}
      <Typography variant="h6">{t('dashboard_medications.list.title')}</Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && schedules.length === 0 && (
        <Typography sx={{ mt: 2 }}>{t('dashboard_medications.list.noSchedules')}</Typography>
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
              secondary={`${t('dashboard_medications.list.frequencyLabel')}: ${schedule.frequency_type} | ${t('dashboard_medications.list.startsLabel')}: ${new Date(schedule.start_date).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
