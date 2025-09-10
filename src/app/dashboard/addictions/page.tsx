'use client';

/**
 * @file This file implements the Addictions management page for the user dashboard.
 * It allows users to add, view, and delete their addiction records.
 * The component is built using Material-UI, react-hook-form for form management,
 * Zod for validation, and Zustand for state management.
 */

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
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';

// Import the specific store and interfaces for this module.
import { useAddictionStore } from '@/store/addiction/addiction.store';
import { AddictionRead, AddictionCreate, AddictionUpdate } from '@/interfaces/client/addiction.interface';

/**
 * Zod schema for addiction form validation.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema for the addiction form.
 */
const getAddictionSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.addictionNameRequired') }),
  start_date: z.string().min(1, { message: t('validation.addictionStartDateRequired') }),
  status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type AddictionFormInputs = z.infer<ReturnType<typeof getAddictionSchema>>;

export default function AddictionsPage() {
  const { t } = useTranslation();
  const {
    addictions,
    loading,
    error,
    fetchAddictions,
    addAddiction,
    removeAddiction,
    updateAddiction,
  } = useAddictionStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingAddiction, setEditingAddiction] = React.useState<AddictionRead | null>(null);

  const addictionSchema = getAddictionSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddictionFormInputs>({
    resolver: zodResolver(addictionSchema),
    defaultValues: {
      name: '',
      start_date: '',
      status: '',
      notes: '',
    },
  });

  // Fetch user's addictions when the component mounts.
  React.useEffect(() => {
    fetchAddictions();
  }, [fetchAddictions]);

  // Handler to show the form for adding a new addiction.
  const handleAddNewClick = () => {
    setEditingAddiction(null);
    reset({ name: '', start_date: '', status: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  // Handler to hide the form and reset its state.
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingAddiction(null);
    reset();
    setFeedback(null);
  };

  // Form submission handler for both creating and updating addictions.
  const onSubmit: SubmitHandler<AddictionFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingAddiction) {
        // Update logic would be here
      } else {
        await addAddiction(data as AddictionCreate);
        setFeedback({ type: 'success', message: t('dashboard_addictions.feedback.addSuccess') });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_addictions.feedback.addError') });
    }
  };

  // Handler to delete an addiction with a confirmation dialog.
  const onDeleteAddiction = async (uuid: string) => {
    if (window.confirm(t('dashboard_addictions.feedback.deleteConfirm'))) {
      try {
        await removeAddiction(uuid);
        setFeedback({ type: 'success', message: t('dashboard_addictions.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_addictions.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_addictions.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_addictions.addButton')}</Button>
      </Box>

      {/* Add/Edit Form (Collapsible) */}
      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_addictions.form.title')}</Typography>
            
            <Controller name="name" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_addictions.form.nameLabel')} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} />)} />
            <Controller name="start_date" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_addictions.form.startDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} />)} />
            <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_addictions.form.statusLabel')} fullWidth margin="normal" />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_addictions.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />)} />
            
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_addictions.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      {/* List of Registered Addictions */}
      <Typography variant="h6">{t('dashboard_addictions.list.title')}</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && addictions.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_addictions.list.noAddictions')}</Typography>}
      <List>
        {addictions.map((addiction) => (
          <ListItem key={addiction.uuid} secondaryAction={
              <Box>
                {/* The edit functionality can be implemented in the future */}
                <IconButton edge="end" aria-label="edit" disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAddiction(addiction.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={addiction.name} secondary={`${t('dashboard_addictions.list.startedLabel')}: ${new Date(addiction.start_date).toLocaleDateString()} - ${t('dashboard_addictions.list.statusLabel')}: ${addiction.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
