'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email({ message: 'Debe ser un email válido' }),
  phone: z.string().min(7, 'El teléfono es requerido'),
  relationship_type: z.string().min(3, 'La relación es requerida'),
  is_emergency_contact: z.boolean(),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function EmergencyContacts() {
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

  // Corregido: Usar reset() para actualizar todo el formulario de una vez.
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
      // Al cancelar, volvemos a los valores por defecto.
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
        setFeedback({ type: 'success', message: '¡Contacto actualizado con éxito!' });
      } else {
        await addContact(data as ContactCreate);
        setFeedback({ type: 'success', message: '¡Contacto añadido con éxito!' });
      }
      setEditingContact(null);
    } catch (err) {
        const message = getApiErrorMessage(err);
        setFeedback({ type: 'error', message });
    }
  };

  const onDeleteContact = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      try {
        await deleteContact(uuid);
        setFeedback({ type: 'success', message: 'Contacto eliminado.' });
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
        Contactos de Emergencia
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">{editingContact ? 'Editar Contacto' : 'Añadir Nuevo Contacto'}</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nombre Completo"
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
              label="Correo Electrónico"
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
              label="Teléfono"
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
              label="Relación (Ej: Padre, Médico)"
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
              label="Marcar como Contacto de Emergencia"
            />
          )}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : editingContact ? 'Guardar Cambios' : 'Añadir Contacto'}
          </Button>
          {editingContact && (
            <Button variant="outlined" onClick={handleCancelEdit}>
              Cancelar
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Mis Contactos</Typography>
      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !isLoading && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error && contacts.length === 0 && (
        <Typography sx={{ mt: 2 }}>No tienes contactos de emergencia añadidos.</Typography>
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
              secondary={`${contact.relationship_type} - ${contact.phone} | ${contact.is_emergency_contact ? 'Contacto de Emergencia' : 'Contacto General'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
