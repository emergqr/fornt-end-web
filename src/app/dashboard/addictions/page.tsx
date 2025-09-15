'use client';

/**
 * @file This file implements the Addictions management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAddictionStore } from '@/store/addiction/addiction.store';
import { AddictionRead, AddictionCreate, AddictionUpdate } from '@/interfaces/client/addiction.interface';
import AddictionForm from './AddictionForm'; // Import the new reusable form

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

export default function AddictionsPage() {
  const { t } = useTranslation();
  const { addictions, loading, error, fetchAddictions, addAddiction, deleteAddiction, updateAddiction } = useAddictionStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddiction, setEditingAddiction] = React.useState<AddictionRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchAddictions(); }, [fetchAddictions]);

  const handleOpenModal = (addiction: AddictionRead | null = null) => {
    setEditingAddiction(addiction);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAddiction(null);
  };

  const handleFormSubmit = async (data: AddictionCreate | AddictionUpdate) => {
    setFeedback(null);
    try {
      if (editingAddiction) {
        await updateAddiction(editingAddiction.uuid, data as AddictionUpdate);
        setFeedback({ type: 'success', message: t('dashboard_addictions.feedback.addSuccess') }); // Re-using success message
      } else {
        await addAddiction(data as AddictionCreate);
        setFeedback({ type: 'success', message: t('dashboard_addictions.feedback.addSuccess') });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_addictions.feedback.addError') });
    }
  };

  const onDeleteAddiction = async (uuid: string) => {
    if (window.confirm(t('dashboard_addictions.feedback.deleteConfirm'))) {
      try {
        await deleteAddiction(uuid);
        setFeedback({ type: 'success', message: t('dashboard_addictions.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_addictions.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_addictions.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}> {t('dashboard_addictions.addButton')} </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && addictions.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_addictions.list.noAddictions')}</Typography>}
      
      <List>
        {addictions.map((addiction) => (
          <ListItem key={addiction.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(addiction)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAddiction(addiction.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText primary={addiction.name} secondary={`${t('dashboard_addictions.list.startedLabel')}: ${new Date(addiction.start_date).toLocaleDateString()} - ${t('dashboard_addictions.list.statusLabel')}: ${addiction.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddiction ? 'Edit Addiction' : t('dashboard_addictions.form.title')}</DialogTitle>
        <DialogContent>
          <AddictionForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingAddiction}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
