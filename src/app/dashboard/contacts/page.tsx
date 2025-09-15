'use client';

/**
 * @file Implements the Contacts management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useContactStore } from '@/store/contacts/contact.store';
import { Contact, ContactCreate, ContactUpdate } from '@/interfaces/client/contact.interface';
import ContactForm from './ContactForm'; // Import the reusable form

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

export default function ContactsPage() {
  const { t } = useTranslation();
  const { contacts, isLoading, error, fetchContacts, addContact, editContact, removeContact } = useContactStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleOpenModal = (contact: Contact | null = null) => {
    setEditingContact(contact);
    setIsModalOpen(true);
    setFeedback(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleFormSubmit = async (data: ContactCreate | ContactUpdate) => {
    setFeedback(null);
    try {
      if (editingContact) {
        await editContact(editingContact.uuid, data as ContactUpdate);
        setFeedback({ type: 'success', message: t('contacts.feedback.updateSuccess') });
      } else {
        await addContact(data as ContactCreate);
        setFeedback({ type: 'success', message: t('contacts.feedback.addSuccess') });
      }
      handleCloseModal();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred' });
    }
  };

  const onDeleteContact = async (uuid: string) => {
    if (window.confirm(t('contacts.feedback.deleteConfirm'))) {
      try {
        await removeContact(uuid);
        setFeedback({ type: 'success', message: t('contacts.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('contacts.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}> {t('contacts.addTitle')} </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error && contacts.length === 0 && <Typography sx={{ mt: 2 }}>{t('contacts.noContacts')}</Typography>}
      
      <List>
        {contacts.map((contact) => (
          <ListItem key={contact.uuid} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" onClick={() => handleOpenModal(contact)}><EditIcon /></IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteContact(contact.uuid)}><DeleteIcon /></IconButton>
            </Box>
          }>
            <ListItemText
              primary={contact.name}
              secondary={`${contact.relationship_type} - ${contact.email} - ${contact.phone}`}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingContact ? t('contacts.editTitle') : t('contacts.addTitle')}</DialogTitle>
        <DialogContent>
          <ContactForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingContact}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
