'use client';

/**
 * @file This file implements the Menstrual Cycle management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useMenstrualCycleStore } from '@/store/menstrual-cycle/menstrual-cycle.store';
import { MenstrualLogRead, MenstrualLogCreate, MenstrualLogUpdate } from '@/interfaces/client/menstrual-cycle.interface';
import MenstrualCycleForm from './MenstrualCycleForm'; // Import the new reusable form
import PredictionWidget from './PredictionWidget';

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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MenstrualCyclePage() {
  const { t } = useTranslation();
  const { logs, loading, error, fetchLogs, addLog, deleteLog, updateLog } = useMenstrualCycleStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingLog, setEditingLog] = React.useState<MenstrualLogRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleOpenModal = (log: MenstrualLogRead | null = null) => {
    setEditingLog(log);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLog(null);
  };

  const handleFormSubmit = async (data: MenstrualLogCreate | MenstrualLogUpdate) => {
    setFeedback(null);
    try {
      if (editingLog) {
        await updateLog(editingLog.uuid, data as MenstrualLogUpdate);
        setFeedback({ type: 'success', message: 'Log updated successfully' });
      } else {
        await addLog(data as MenstrualLogCreate);
        setFeedback({ type: 'success', message: 'Log added successfully' });
      }
      handleCloseModal();
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Log</Button>
      </Box>

      <PredictionWidget />

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      <Typography variant="h6">Registered Logs</Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && logs.length === 0 && <Typography sx={{ mt: 2 }}>No logs registered.</Typography>}
      
      <List>
        {logs.map((log) => (
          <ListItem key={log.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(log)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(log.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText primary={`Period from ${new Date(log.start_date).toLocaleDateString()}`} secondary={`Flow: ${log.flow_level || 'N/A'}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLog ? 'Edit Log' : 'Add New Log'}</DialogTitle>
        <DialogContent>
          <MenstrualCycleForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingLog}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
