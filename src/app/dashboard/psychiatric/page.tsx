'use client';

/**
 * @file This file implements the Psychiatric Conditions management page for the user dashboard.
 * It allows users to add, view, edit, and delete their psychiatric condition records.
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

import { usePsychiatricConditionStore } from '@/store/psychiatric-condition/psychiatric-condition.store';
import { PsychiatricConditionRead, PsychiatricConditionCreate, PsychiatricConditionUpdate } from '@/interfaces/client/psychiatric-condition.interface';

const getPsychiatricConditionSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.nameRequired') }),
  diagnosis_date: z.string().min(1, { message: t('validation.diagnosisDateRequired') }),
  status: z.string().optional().nullable(),
  medication: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type PsychiatricConditionFormInputs = z.infer<ReturnType<typeof getPsychiatricConditionSchema>>;

export default function PsychiatricConditionsPage() {
  const { t } = useTranslation();
  const {
    conditions,
    loading,
    error,
    fetchConditions,
    addCondition,
    deleteCondition,
    updateCondition,
  } = usePsychiatricConditionStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingCondition, setEditingCondition] = React.useState<PsychiatricConditionRead | null>(null);

  const formSchema = getPsychiatricConditionSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PsychiatricConditionFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', diagnosis_date: '', status: '', medication: '', notes: '' },
  });

  React.useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  const handleAddNewClick = () => {
    setEditingCondition(null);
    reset({ name: '', diagnosis_date: '', status: '', medication: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (condition: PsychiatricConditionRead) => {
    setEditingCondition(condition);
    reset({
      name: condition.name,
      diagnosis_date: condition.diagnosis_date,
      status: condition.status || '',
      medication: condition.medication || '',
      notes: condition.notes || '',
    });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingCondition(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<PsychiatricConditionFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingCondition) {
        await updateCondition(editingCondition.uuid, data as PsychiatricConditionUpdate);
        setFeedback({ type: 'success', message: 'Condition updated successfully' });
      } else {
        await addCondition(data as PsychiatricConditionCreate);
        setFeedback({ type: 'success', message: 'Condition added successfully' });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred' });
    }
  };

  const onDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this condition?')) {
      try {
        await deleteCondition(uuid);
        setFeedback({ type: 'success', message: 'Condition deleted successfully' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'An error occurred' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Psychiatric Conditions</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>Add Condition</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingCondition ? 'Edit Condition' : 'Add New Condition'}</Typography>
            <Controller name="name" control={control} render={({ field }) => (<TextField {...field} label="Condition Name" fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} />)} />
            <Controller name="diagnosis_date" control={control} render={({ field }) => (<TextField {...field} label="Diagnosis Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />)} />
            <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Status" fullWidth margin="normal" />)} />
            <Controller name="medication" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Medication" fullWidth margin="normal" />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Notes" fullWidth margin="normal" multiline rows={2} />)} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? 'Saving...' : 'Save Condition'}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Registered Conditions</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && conditions.length === 0 && <Typography sx={{ mt: 2 }}>No conditions registered.</Typography>}
      <List>
        {conditions.map((condition) => (
          <ListItem key={condition.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(condition)}><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(condition.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={condition.name} secondary={`Diagnosed: ${new Date(condition.diagnosis_date).toLocaleDateString()} - Status: ${condition.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
