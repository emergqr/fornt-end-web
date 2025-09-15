'use client';

/**
 * @file This file implements the Infectious Diseases management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useInfectiousDiseaseStore } from '@/store/infectious-disease/infectious-disease.store';
import { InfectiousDiseaseRead, InfectiousDiseaseCreate, InfectiousDiseaseUpdate } from '@/interfaces/client/infectious-disease.interface';
import InfectiousDiseaseForm from './InfectiousDiseaseForm'; // Import the new reusable form

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

export default function InfectiousDiseasesPage() {
  const { t } = useTranslation();
  const { diseases, loading, error, fetchDiseases, addDisease, deleteDisease, updateDisease } = useInfectiousDiseaseStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDisease, setEditingDisease] = React.useState<InfectiousDiseaseRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchDiseases(); }, [fetchDiseases]);

  const handleOpenModal = (disease: InfectiousDiseaseRead | null = null) => {
    setEditingDisease(disease);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDisease(null);
  };

  const handleFormSubmit = async (data: InfectiousDiseaseCreate | InfectiousDiseaseUpdate) => {
    setFeedback(null);
    try {
      if (editingDisease) {
        await updateDisease(editingDisease.uuid, data as InfectiousDiseaseUpdate);
        setFeedback({ type: 'success', message: t('dashboard_infectious_diseases.feedback.addSuccess') }); // Re-using
      } else {
        await addDisease(data as InfectiousDiseaseCreate);
        setFeedback({ type: 'success', message: t('dashboard_infectious_diseases.feedback.addSuccess') });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_infectious_diseases.feedback.addError') });
    }
  };

  const onDelete = async (uuid: string) => {
    if (window.confirm(t('dashboard_infectious_diseases.feedback.deleteConfirm'))) {
      try {
        await deleteDisease(uuid);
        setFeedback({ type: 'success', message: t('dashboard_infectious_diseases.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_infectious_diseases.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_infectious_diseases.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>{t('dashboard_infectious_diseases.addButton')}</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && diseases.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_infectious_diseases.list.noDiseases')}</Typography>}
      
      <List>
        {diseases.map((disease) => (
          <ListItem key={disease.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(disease)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDelete(disease.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText primary={disease.name} secondary={`${t('dashboard_infectious_diseases.list.diagnosedLabel')}: ${new Date(disease.diagnosis_date).toLocaleDateString()} - ${t('dashboard_infectious_diseases.list.statusLabel')}: ${disease.status || 'N/A'}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDisease ? 'Edit Disease' : t('dashboard_infectious_diseases.form.title')}</DialogTitle>
        <DialogContent>
          <InfectiousDiseaseForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingDisease}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
