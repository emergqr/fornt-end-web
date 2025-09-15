'use client';

/**
 * @file This file implements the Allergies management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAllergyStore } from '@/store/allergy/allergy.store';
import { AllergyRead, AllergyUpdate, AllergyCreateFromCode, ReactionHistoryCreate } from '@/interfaces/client/allergy.interface';
import AllergyForm from './AllergyForm'; // Import the new reusable form
import AddReactionForm from './AddReactionForm';

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

export default function AllergiesPage() {
  const { t } = useTranslation();
  const { allergies, loading, error, fetchMyAllergies, addAllergyFromCode, removeAllergy, editAllergy, addNewReaction } = useAllergyStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAllergy, setEditingAllergy] = React.useState<AllergyRead | null>(null);
  const [reactionFormOpen, setReactionFormOpen] = React.useState(false);
  const [selectedAllergyForReaction, setSelectedAllergyForReaction] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchMyAllergies(); }, [fetchMyAllergies]);

  const handleOpenModal = (allergy: AllergyRead | null = null) => {
    setEditingAllergy(allergy);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAllergy(null);
  };

  const handleFormSubmit = async (data: any) => {
    setFeedback(null);
    try {
      if (editingAllergy) {
        const updatePayload: AllergyUpdate = { reaction_type: data.reaction_type, severity: data.severity };
        await editAllergy(editingAllergy.uuid, updatePayload);
        setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.updateSuccess') });
      } else {
        const createPayload: AllergyCreateFromCode = { code: data.allergen.code, name: data.allergen.name, source: 'snomed', reaction_type: data.reaction_type, severity: data.severity };
        await addAllergyFromCode(createPayload);
        setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.addSuccess') });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_allergies.feedback.addError') });
    }
  };

  const onDeleteAllergy = async (uuid: string) => {
    if (window.confirm(t('dashboard_allergies.feedback.deleteConfirm'))) {
      try {
        await removeAllergy(uuid);
        setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_allergies.feedback.deleteError') });
      }
    }
  };

  const handleOpenReactionForm = (allergyUuid: string) => {
    setSelectedAllergyForReaction(allergyUuid);
    setReactionFormOpen(true);
  };

  const handleCloseReactionForm = () => {
    setReactionFormOpen(false);
    setSelectedAllergyForReaction(null);
  };

  const handleAddReaction = async (data: ReactionHistoryCreate) => {
    if (!selectedAllergyForReaction) return;
    try {
      await addNewReaction(selectedAllergyForReaction, data);
      setFeedback({ type: 'success', message: 'Reaction added successfully!' });
      handleCloseReactionForm();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add reaction' });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_allergies.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>{t('dashboard_allergies.addButton')}</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_allergies.list.noAllergies')}</Typography>}
      
      <List>
        {allergies.map((allergy) => (
          <ListItem key={allergy.uuid} sx={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary={allergy.allergen} secondary={`${t('dashboard_allergies.list.reactionLabel')}: ${allergy.reaction_type || 'N/A'} - ${t('dashboard_allergies.list.severityLabel')}: ${allergy.severity || 'N/A'}`} />
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(allergy)}><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAllergy(allergy.uuid)}><DeleteIcon /></IconButton>
              </Box>
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="subtitle2">Reaction History</Typography>
              {allergy.reaction_history && allergy.reaction_history.length > 0 ? (
                <List dense disablePadding>
                  {allergy.reaction_history.map(reaction => (
                    <ListItem key={reaction.uuid} sx={{ pl: 2 }}>
                      <ListItemText primary={reaction.symptoms} secondary={`Date: ${new Date(reaction.reaction_date).toLocaleDateString()}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>No reactions recorded.</Typography>
              )}
              <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenReactionForm(allergy.uuid)} sx={{ mt: 1, ml: 1 }}>Add Reaction</Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAllergy ? t('dashboard_allergies.feedback.editNotAvailable') : t('dashboard_allergies.form.title')}</DialogTitle>
        <DialogContent>
          <AllergyForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingAllergy ? { allergen: { code: editingAllergy.source_code, name: editingAllergy.allergen }, reaction_type: editingAllergy.reaction_type, severity: editingAllergy.severity } : null}
            isEditMode={!!editingAllergy}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={reactionFormOpen} onClose={handleCloseReactionForm}>
        <DialogTitle>Add New Reaction</DialogTitle>
        <DialogContent>
          <AddReactionForm onSubmit={handleAddReaction} onCancel={handleCloseReactionForm} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
