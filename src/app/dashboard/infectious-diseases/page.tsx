'use client';

/**
 * @file This file implements the Infectious Diseases management page for the user dashboard.
 * It allows users to add, view, and delete their infectious disease records.
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
import { useInfectiousDiseaseStore } from '@/store/infectious-disease/infectious-disease.store';
import { InfectiousDiseaseRead, InfectiousDiseaseCreate } from '@/interfaces/client/infectious-disease.interface';

/**
 * Zod schema for infectious disease form validation.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema for the infectious disease form.
 */
const getInfectiousDiseaseSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.infectiousDiseaseNameRequired') }),
  diagnosis_date: z.string().min(1, { message: t('validation.infectiousDiseaseDiagnosisDateRequired') }),
  status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type InfectiousDiseaseFormInputs = z.infer<ReturnType<typeof getInfectiousDiseaseSchema>>;

export default function InfectiousDiseasesPage() {
  const { t } = useTranslation();
  const {
    infectiousDiseases,
    loading,
    error,
    fetchInfectiousDiseases,
    addInfectiousDisease,
    removeInfectiousDisease,
  } = useInfectiousDiseaseStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingDisease, setEditingDisease] = React.useState<InfectiousDiseaseRead | null>(null);

  const infectiousDiseaseSchema = getInfectiousDiseaseSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InfectiousDiseaseFormInputs>({
    resolver: zodResolver(infectiousDiseaseSchema),
    defaultValues: {
      name: '',
      diagnosis_date: '',
      status: '',
      notes: '',
    },
  });

  // Fetch user's infectious diseases when the component mounts.
  React.useEffect(() => {
    fetchInfectiousDiseases();
  }, [fetchInfectiousDiseases]);

  // Handler to show the form for adding a new record.
  const handleAddNewClick = () => {
    setEditingDisease(null);
    reset({ name: '', diagnosis_date: '', status: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  // Handler to hide the form and reset its state.
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingDisease(null);
    reset();
    setFeedback(null);
  };

  // Form submission handler.
  const onSubmit: SubmitHandler<InfectiousDiseaseFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingDisease) {
        // Update logic would be implemented here in the future.
      } else {
        await addInfectiousDisease(data as InfectiousDiseaseCreate);
        setFeedback({ type: 'success', message: t('dashboard_infectious_diseases.feedback.addSuccess') });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_infectious_diseases.feedback.addError') });
    }
  };

  // Handler to delete a record with a confirmation dialog.
  const onDelete = async (uuid: string) => {
    if (window.confirm(t('dashboard_infectious_diseases.feedback.deleteConfirm'))) {
      try {
        await removeInfectiousDisease(uuid);
        setFeedback({ type: 'success', message: t('dashboard_infectious_diseases.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_infectious_diseases.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_infectious_diseases.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_infectious_diseases.addButton')}</Button>
      </Box>

      {/* Add/Edit Form (Collapsible) */}
      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingDisease ? 'Edit Disease' : t('dashboard_infectious_diseases.form.title')}</Typography>
            
            <Controller name="name" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_infectious_diseases.form.nameLabel')} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} />)} />
            <Controller name="diagnosis_date" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_infectious_diseases.form.diagnosisDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />)} />
            <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_infectious_diseases.form.statusLabel')} fullWidth margin="normal" />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_infectious_diseases.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />)} />
            
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_infectious_diseases.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      {/* List of Registered Infectious Diseases */}
      <Typography variant="h6">{t('dashboard_infectious_diseases.list.title')}</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && infectiousDiseases.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_infectious_diseases.list.noDiseases')}</Typography>}
      <List>
        {infectiousDiseases.map((disease) => (
          <ListItem key={disease.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(disease.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={disease.name} secondary={`${t('dashboard_infectious_diseases.list.diagnosedLabel')}: ${new Date(disease.diagnosis_date).toLocaleDateString()} - ${t('dashboard_infectious_diseases.list.statusLabel')}: ${disease.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
