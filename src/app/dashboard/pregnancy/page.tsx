'use client';

/**
 * @file This file implements the Pregnancy Tracking management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePregnancyStore } from '@/store/pregnancy/pregnancy.store';
import { PregnancyRead, PregnancyCreate, PregnancyUpdate } from '@/interfaces/client/pregnancy.interface';
import PregnancyForm from './PregnancyForm'; // Import the new reusable form

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
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

export default function PregnancyPage() {
  const { t } = useTranslation();
  const { records, loading, error, fetchRecords, addRecord, deleteRecord, updateRecord } = usePregnancyStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<PregnancyRead | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleOpenModal = (record: PregnancyRead | null = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleFormSubmit = async (data: PregnancyCreate | PregnancyUpdate) => {
    setFeedback(null);
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.uuid, data as PregnancyUpdate);
        setFeedback({ type: 'success', message: 'Record updated successfully' });
      } else {
        await addRecord(data as PregnancyCreate);
        setFeedback({ type: 'success', message: 'Record added successfully' });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred' });
    }
  };

  const onDelete = async (e: React.MouseEvent, uuid: string) => {
    e.stopPropagation(); // Prevent navigation when clicking the delete button
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
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add Record</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && records.length === 0 && <Typography sx={{ mt: 2 }}>No records registered.</Typography>}
      
      <List>
        {records.map((record) => (
          <ListItem
            key={record.uuid}
            disablePadding
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={(e) => { e.stopPropagation(); handleOpenModal(record); }}><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={(e) => onDelete(e, record.uuid)}><DeleteIcon /></IconButton>
              </Box>
            }
          >
            <ListItemButton component={Link} href={`/dashboard/pregnancy/${record.uuid}`}>
              <ListItemText
                primary={`Pregnancy started ${new Date(record.start_date).toLocaleDateString()}`}
                secondary={`Week: ${record.current_week || 'N/A'} - Status: ${record.status}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRecord ? 'Edit Record' : 'Add New Record'}</DialogTitle>
        <DialogContent>
          <PregnancyForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingRecord}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
