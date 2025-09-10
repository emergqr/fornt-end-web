'use client';

/**
 * @file This file implements the Menstrual Cycle management page for the user dashboard.
 * It allows users to add, view, edit, and delete their menstrual cycle logs.
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

import { useMenstrualCycleStore } from '@/store/menstrual-cycle/menstrual-cycle.store';
import { MenstrualLogRead, MenstrualLogCreate, MenstrualLogUpdate } from '@/interfaces/client/menstrual-cycle.interface';

const getMenstrualLogSchema = (t: (key: string) => string) => z.object({
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  end_date: z.string().optional().nullable(),
  flow_level: z.string().optional().nullable(),
  symptoms: z.array(z.string()).optional().nullable(), // Assuming symptoms are managed elsewhere or as a simple string for now
  notes: z.string().optional().nullable(),
});

type MenstrualLogFormInputs = z.infer<ReturnType<typeof getMenstrualLogSchema>>;

export default function MenstrualCyclePage() {
  const { t } = useTranslation();
  const {
    logs,
    loading,
    error,
    fetchLogs,
    addLog,
    deleteLog,
    updateLog,
  } = useMenstrualCycleStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingLog, setEditingLog] = React.useState<MenstrualLogRead | null>(null);

  const formSchema = getMenstrualLogSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenstrualLogFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: { start_date: '', end_date: '', flow_level: '', notes: '' },
  });

  React.useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleAddNewClick = () => {
    setEditingLog(null);
    reset({ start_date: '', end_date: '', flow_level: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (log: MenstrualLogRead) => {
    setEditingLog(log);
    reset({
      start_date: log.start_date,
      end_date: log.end_date || '',
      flow_level: log.flow_level || '',
      notes: log.notes || '',
    });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingLog(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<MenstrualLogFormInputs> = async (data) => {
    setFeedback(null);
    try {
      const payload = { ...data, symptoms: [] }; // Temp fix for symptoms
      if (editingLog) {
        await updateLog(editingLog.uuid, payload as MenstrualLogUpdate);
        setFeedback({ type: 'success', message: 'Log updated successfully' });
      } else {
        await addLog(payload as MenstrualLogCreate);
        setFeedback({ type: 'success', message: 'Log added successfully' });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred' });
    }
  };

  const onDelete = async (uuid: string) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteLog(uuid);
        setFeedback({ type: 'success', message: 'Log deleted successfully' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'An error occurred' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Menstrual Cycle</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>Add Log</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingLog ? 'Edit Log' : 'Add New Log'}</Typography>
            <Controller name="start_date" control={control} render={({ field }) => (<TextField {...field} label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} />)} />
            <Controller name="end_date" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />)} />
            <Controller name="flow_level" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Flow Level (e.g., Light, Medium)" fullWidth margin="normal" />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Symptoms & Notes" fullWidth margin="normal" multiline rows={2} />)} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? 'Saving...' : 'Save Log'}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>Cancel</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Registered Logs</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && logs.length === 0 && <Typography sx={{ mt: 2 }}>No logs registered.</Typography>}
      <List>
        {logs.map((log) => (
          <ListItem key={log.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(log)}><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(log.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={`Period from ${new Date(log.start_date).toLocaleDateString()}`} secondary={`Flow: ${log.flow_level || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
