'use client';

/**
 * @file Implements the Contacts management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useContactStore } from '@/store/contacts/contact.store';
import { useSnackbar } from '@/hooks/useSnackbar';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star'; // Import the Star icon

export default function ContactsPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { showSnackbar } = useSnackbar();
  const { contacts, isLoading, error, fetchContacts, addContact, editContact, removeContact } = useContactStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);

  React.useEffect(() => { fetchContacts(); }, [fetchContacts]);

  React.useEffect(() => {
    if (error) {
      showSnackbar(error, 'error');
    }
  }, [error, showSnackbar]);

  const handleOpenModal = (contact: Contact | null = null) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  const handleFormSubmit = async (data: ContactCreate | ContactUpdate) => {
    try {
      if (editingContact) {
        await editContact(editingContact.uuid, data as ContactUpdate);
        showSnackbar(t('contacts.feedback.updateSuccess'), 'success');
      } else {
        await addContact(data as ContactCreate);
        showSnackbar(t('contacts.feedback.addSuccess'), 'success');
      }
      handleCloseModal();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || t('common.unknownError');
      showSnackbar(errorMessage, 'error');
    }
  };

  const onDeleteContact = async (uuid: string) => {
    if (window.confirm(t('contacts.feedback.deleteConfirm'))) {
      try {
        await removeContact(uuid);
        showSnackbar(t('contacts.feedback.deleteSuccess'), 'success');
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || err.message || t('common.unknownError');
        showSnackbar(errorMessage, 'error');
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

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
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
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {contact.is_emergency_contact && (
                    <StarIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                  )}
                  {contact.name}
                </Box>
              }
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
