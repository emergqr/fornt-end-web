'use client';

/**
 * @file This file implements the detail page for a specific pregnancy record,
 * allowing users to view and manage its associated clinical log entries.
 */

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { usePregnancyStore } from '@/store/pregnancy/pregnancy.store';
import { PregnancyLogCreate } from '@/interfaces/client/pregnancy.interface';

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { format, parseISO } from 'date-fns';

const getLogSchema = (t: (key: string) => string) => z.object({
  log_date: z.string().min(1, { message: 'Log date is required' }),
  weight_kg: z.string().optional(),
  notes: z.string().optional(),
});

type LogFormInputs = z.infer<ReturnType<typeof getLogSchema>>;

export default function PregnancyDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const uuid = params.uuid as string;

  const {
    selectedRecord,
    recordLogs,
    loading,
    logsLoading,
    error,
    logsError,
    fetchRecordById,
    fetchLogsForRecord,
    addLogToRecord,
  } = usePregnancyStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const logSchema = getLogSchema(t);
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LogFormInputs>({
    resolver: zodResolver(logSchema),
    defaultValues: { log_date: '', weight_kg: '', notes: '' },
  });

  React.useEffect(() => {
    if (uuid) {
      fetchRecordById(uuid);
      fetchLogsForRecord(uuid);
    }
  }, [uuid, fetchRecordById, fetchLogsForRecord]);

  const onAddLog: SubmitHandler<LogFormInputs> = async (data) => {
    setFeedback(null);
    try {
      const payload: PregnancyLogCreate = {
        ...data,
        weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : undefined,
      };
      await addLogToRecord(uuid, payload);
      setFeedback({ type: 'success', message: 'Log entry added successfully!' });
      reset();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add log entry' });
    }
  };

  if (loading || !selectedRecord) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pregnancy Details
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}><Typography><strong>Status:</strong> {selectedRecord.status}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Start Date:</strong> {format(parseISO(selectedRecord.start_date), 'PPP')}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Due Date:</strong> {selectedRecord.due_date ? format(parseISO(selectedRecord.due_date), 'PPP') : 'N/A'}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography><strong>Current Week:</strong> {selectedRecord.current_week || 'N/A'}</Typography></Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />

      <Box component="form" onSubmit={handleSubmit(onAddLog)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">Add New Log Entry</Typography>
        <Controller name="log_date" control={control} render={({ field }) => <TextField {...field} label="Log Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.log_date} helperText={errors.log_date?.message} />} />
        <Controller name="weight_kg" control={control} render={({ field }) => <TextField {...field} label="Weight (kg)" type="number" fullWidth margin="normal" error={!!errors.weight_kg} helperText={errors.weight_kg?.message} />} />
        <Controller name="notes" control={control} render={({ field }) => <TextField {...field} label="Notes & Symptoms" fullWidth margin="normal" multiline rows={3} error={!!errors.notes} helperText={errors.notes?.message} />} />
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? 'Saving...' : 'Save Log Entry'}</Button>
      </Box>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Log History</Typography>
      {logsLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {logsError && <Alert severity="error">{logsError}</Alert>}
      {!logsLoading && !logsError && recordLogs.length === 0 && <Typography sx={{ mt: 2 }}>No log entries yet.</Typography>}
      <List>
        {recordLogs.map(log => (
          <ListItem key={log.uuid} sx={{ borderBottom: '1px solid #eee' }}>
            <ListItemText
              primary={`Log for ${format(parseISO(log.log_date), 'PPP')}`}
              secondary={`Weight: ${log.weight_kg || 'N/A'} kg - Notes: ${log.notes || 'None'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
