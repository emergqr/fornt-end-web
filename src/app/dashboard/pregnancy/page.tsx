'use client';

/**
 * @file This file implements the Pregnancy Tracking management page for the user dashboard.
 * It allows users to add, view, edit, and delete their pregnancy records.
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

import { usePregnancyStore } from '@/store/pregnancy/pregnancy.store';
import { PregnancyRead, PregnancyCreate, PregnancyUpdate } from '@/interfaces/client/pregnancy.interface';

const getPregnancySchema = (t: (key: string) => string) => z.object({
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  due_date: z.string().optional().nullable(),
  status: z.string().min(1, { message: t('validation.statusRequired') }),
  notes: z.string().optional().nullable(),
});

type PregnancyFormInputs = z.infer<ReturnType<typeof getPregnancySchema>>;

export default function PregnancyPage() {
  const { t } = useTranslation();
  const {
    records,
    loading,
    error,
    fetchRecords,
    addRecord,
    deleteRecord,
    updateRecord,
  } = usePregnancyStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<PregnancyRead | null>(null);

  const formSchema = getPregnancySchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PregnancyFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: { start_date: '', due_date: '', status: '', notes: '' },
  });

  React.useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleAddNewClick = () => {
    setEditingRecord(null);
    reset({ start_date: '', due_date: '', status: 'Active', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (record: PregnancyRead) => {
    setEditingRecord(record);
    reset({
      start_date: record.start_date,
      due_date: record.due_date || '',
      status: record.status,
      notes: record.notes || '',
    });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingRecord(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<PregnancyFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.uuid, data as PregnancyUpdate);
        setFeedback({ type: 'success', message: 'Record updated successfully' });
      } else {
        await addRecord(data as PregnancyCreate);
        setFeedback({ type: 'success', message: 'Record added successfully' });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred' });
    }
  };

  const onDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(uuid);
        setFeedback({ type: 'success', message: 'Record deleted successfully' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'An error occurred' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Pregnancy Tracking</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>Add Record</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingRecord ? 'Edit Record' : 'Add New Record'}</Typography>
            <Controller name="start_date" control={control} render={({ field }) => (<TextField {...field} label="Last Menstrual Period" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} />)} />
            <Controller name="due_date" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Due Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />)} />
            <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Status (e.g., Active, Completed)" fullWidth margin="normal" required error={!!errors.status} helperText={errors.status?.message} />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Notes" fullWidth margin="normal" multiline rows={2} />)} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? 'Saving...' : 'Save Record'}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Registered Records</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && records.length === 0 && <Typography sx={{ mt: 2 }}>No records registered.</Typography>}
      <List>
        {records.map((record) => (
          <ListItem key={record.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(record)}><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(record.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={`Pregnancy started ${new Date(record.start_date).toLocaleDateString()}`} secondary={`Week: ${record.current_week || 'N/A'} - Status: ${record.status}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
