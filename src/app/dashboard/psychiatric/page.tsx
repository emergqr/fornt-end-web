'use client';

/**
 * @file This file implements the Psychiatric Conditions management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { usePsychiatricConditionStore } from '@/store/psychiatric-condition/psychiatric-condition.store';
import { PsychiatricConditionRead, PsychiatricConditionCreate, PsychiatricConditionUpdate } from '@/interfaces/client/psychiatric-condition.interface';
import PsychiatricConditionForm from './PsychiatricConditionForm'; // Import the new reusable form

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

export default function PsychiatricConditionsPage() {
  const { t } = useTranslation();
  const { conditions, loading, error, fetchConditions, addCondition, deleteCondition, updateCondition } = usePsychiatricConditionStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCondition, setEditingCondition] = React.useState<PsychiatricConditionRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchConditions(); }, [fetchConditions]);

  const handleOpenModal = (condition: PsychiatricConditionRead | null = null) => {
    setEditingCondition(condition);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCondition(null);
  };

  const handleFormSubmit = async (data: PsychiatricConditionCreate | PsychiatricConditionUpdate) => {
    setFeedback(null);
    try {
      if (editingCondition) {
        await updateCondition(editingCondition.uuid, data as PsychiatricConditionUpdate);
        setFeedback({ type: 'success', message: 'Condition updated successfully' });
      } else {
        await addCondition(data as PsychiatricConditionCreate);
        setFeedback({ type: 'success', message: 'Condition added successfully' });
      }
      handleCloseModal();
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Condition</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && conditions.length === 0 && <Typography sx={{ mt: 2 }}>No conditions registered.</Typography>}
      
      <List>
        {conditions.map((condition) => (
          <ListItem key={condition.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(condition)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(condition.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText primary={condition.name} secondary={`Diagnosed: ${new Date(condition.diagnosis_date).toLocaleDateString()} - Status: ${condition.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCondition ? 'Edit Condition' : 'Add New Condition'}</DialogTitle>
        <DialogContent>
          <PsychiatricConditionForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingCondition}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
