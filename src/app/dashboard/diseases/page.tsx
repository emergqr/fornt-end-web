'use client';

/**
 * @file This file implements the Medical Conditions (diseases) management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDiseaseStore } from '@/store/disease/disease.store';
import { PatientDiseaseRead, PatientDiseaseUpdate, DiseaseCreateFromCode } from '@/interfaces/client/disease.interface';
import DiseaseForm from './DiseaseForm'; // Import the new reusable form

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

export default function DiseasesPage() {
  const { t } = useTranslation();
  const { diseases, loading, error, fetchMyDiseases, addDiseaseFromCode, editDisease, removeDisease } = useDiseaseStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingDisease, setEditingDisease] = React.useState<PatientDiseaseRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchMyDiseases(); }, [fetchMyDiseases]);

  const handleOpenModal = (disease: PatientDiseaseRead | null = null) => {
    setEditingDisease(disease);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDisease(null);
  };

  const handleFormSubmit = async (data: any) => {
    setFeedback(null);
    try {
      if (editingDisease) {
        const updatePayload: PatientDiseaseUpdate = { diagnosis_date: data.diagnosis_date, severity: data.severity, notes: data.notes };
        await editDisease(editingDisease.uuid, updatePayload);
        setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.updateSuccess') });
      } else {
        const createPayload: DiseaseCreateFromCode = {
          code: data.disease.code,
          name: data.disease.name,
          source: 'snomed',
          diagnosis_date: data.diagnosis_date,
          severity: data.severity,
          notes: data.notes,
        };
        await addDiseaseFromCode(createPayload);
        setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.addSuccess') });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_diseases.feedback.addError') });
    }
  };

  const onDeleteDisease = async (uuid: string) => {
    if (window.confirm(t('dashboard_diseases.feedback.deleteConfirm'))) {
      try {
        await removeDisease(uuid);
        setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_diseases.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_diseases.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>{t('dashboard_diseases.addButton')}</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && diseases.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_diseases.list.noConditions')}</Typography>}
      
      <List>
        {diseases.map((patientDisease) => (
          <ListItem key={patientDisease.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(patientDisease)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteDisease(patientDisease.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText primary={patientDisease.disease.name} secondary={`${t('dashboard_diseases.list.diagnosedLabel')}: ${new Date(patientDisease.diagnosis_date).toLocaleDateString()} - ${t('dashboard_diseases.list.severityLabel')}: ${patientDisease.severity || 'N/A'}`} />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDisease ? t('dashboard_diseases.feedback.editNotAvailable') : t('dashboard_diseases.form.title')}</DialogTitle>
        <DialogContent>
          <DiseaseForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingDisease ? { ...editingDisease, disease: editingDisease.disease } : null}
            isEditMode={!!editingDisease}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
