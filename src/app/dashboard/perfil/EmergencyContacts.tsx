'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useContactStore } from '@/store/contacts/contact.store';
import { Contact, ContactCreate, ContactUpdate } from '@/interfaces/client/contact.interface';
import { getApiErrorMessage } from '@/services/apiErrors';

export default function EmergencyContacts() {
  const { t } = useTranslation();

  const contactSchema = z.object({
    name: z.string().min(2, t('validation.nameRequired')),
    email: z.string().email({ message: t('validation.emailInvalid') }),
    phone: z.string().min(7, t('validation.phoneRequired')),
    relationship_type: z.string().min(3, t('validation.relationshipRequired')),
    is_emergency_contact: z.boolean(),
  });

  type ContactFormInputs = z.infer<typeof contactSchema>;

  const {
    contacts,
    isLoading,
    error,
    fetchContacts,
    addContact,
    editContact,
    removeContact: deleteContact,
  } = useContactStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingContact, setEditingContact] = React.useState<Contact | null>(null);

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      relationship_type: '',
      is_emergency_contact: true,
    },
  });

  React.useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  React.useEffect(() => {
    if (editingContact) {
      reset({
        name: editingContact.name || '',
        email: editingContact.email || '',
        phone: editingContact.phone || '',
        relationship_type: editingContact.relationship_type || '',
        is_emergency_contact: !!editingContact.is_emergency_contact,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        relationship_type: '',
        is_emergency_contact: true,
      });
    }
  }, [editingContact, reset]);

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingContact) {
        const updateData: ContactUpdate = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            relationship_type: data.relationship_type,
            is_emergency_contact: data.is_emergency_contact,
        };
        await editContact(editingContact.uuid, updateData);
        setFeedback({ type: 'success', message: t('contacts.feedback.updateSuccess') });
      } else {
        await addContact(data as ContactCreate);
        setFeedback({ type: 'success', message: t('contacts.feedback.addSuccess') });
      }
      setEditingContact(null);
    } catch (err) {
        const message = getApiErrorMessage(err);
        setFeedback({ type: 'error', message });
    }
  };

  const onDeleteContact = async (uuid: string) => {
    if (window.confirm(t('contacts.feedback.deleteConfirm'))) {
      try {
        await deleteContact(uuid);
        setFeedback({ type: 'success', message: t('contacts.feedback.deleteSuccess') });
      } catch (err) {
        const message = getApiErrorMessage(err);
        setFeedback({ type: 'error', message });
      }
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {t('contacts.title')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">{editingContact ? t('contacts.editTitle') : t('contacts.addTitle')}</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('contacts.form.nameLabel')}
              fullWidth
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('contacts.form.emailLabel')}
              fullWidth
              margin="normal"
              required
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('contacts.form.phoneLabel')}
              fullWidth
              margin="normal"
              required
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="relationship_type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('contacts.form.relationshipLabel')}
              fullWidth
              margin="normal"
              required
              error={!!errors.relationship_type}
              helperText={errors.relationship_type?.message}
            />
          )}
        />

        <Controller
          name="is_emergency_contact"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              }
              label={t('contacts.form.isEmergencyContactLabel')}
            />
          )}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? t('common.saving') : editingContact ? t('common.saveChanges') : t('contacts.form.addButton')}
          </Button>
          {editingContact && (
            <Button variant="outlined" onClick={handleCancelEdit}>
              {t('common.cancel')}
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">{t('contacts.myContactsTitle')}</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !isLoading && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error && contacts.length === 0 && (
        <Typography sx={{ mt: 2 }}>{t('contacts.noContacts')}</Typography>
      )}
      <List>
        {contacts.map((contact) => (
          <ListItem
            key={contact.uuid}
            secondaryAction={
              <>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(contact)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteContact(contact.uuid)}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={contact.name}
              secondary={`${contact.relationship_type} - ${contact.phone} | ${contact.is_emergency_contact ? t('contacts.isEmergencyContact') : t('contacts.isGeneralContact')}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
