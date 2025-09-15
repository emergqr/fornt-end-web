'use client';

/**
 * @file This file implements the Medications management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useMedicationStore } from '@/store/medication/medication.store';
import { MedicationScheduleCreate } from '@/interfaces/client/medication.interface';
import MedicationForm from './MedicationForm'; // Import the new reusable form

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MedicationsPage() {
  const { t } = useTranslation();
  const { schedules, loading, error, fetchSchedules, addSchedule, deleteSchedule } = useMedicationStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  const handleFormSubmit = async (data: MedicationScheduleCreate) => {
    setFeedback(null);
    try {
      await addSchedule(data);
      setFeedback({ type: 'success', message: t('dashboard_medications.feedback.addSuccess') });
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_medications.feedback.addError') });
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_medications.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>{t('dashboard_medications.form.title')}</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && schedules.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_medications.list.noSchedules')}</Typography>}
      
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

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dashboard_medications.form.title')}</DialogTitle>
        <DialogContent>
          <MedicationForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
