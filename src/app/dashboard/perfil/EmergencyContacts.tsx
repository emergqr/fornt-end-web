'use client';

import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import { useContactStore } from '@/store/contacts/contact.store';
import { ContactCreate } from '@/interfaces/client/contact.interface';

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Debe ser un email válido'),
  phone: z.string().min(7, 'El teléfono es requerido'),
  relationship_type: z.string().min(3, 'La relación es requerida'),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export default function EmergencyContacts() {
  const {
    contacts,
    isLoading,
    error,
    fetchContacts, // CORRECTED: Use the correct function name from the store
    addContact,
    removeContact: deleteContact, // Keep using deleteContact in the component for clarity if you wish
  } = useContactStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
  });

  // Cargar los contactos al montar el componente
  React.useEffect(() => {
    fetchContacts(); // CORRECTED: Call the correct function
  }, [fetchContacts]);

  const onAddContact: SubmitHandler<ContactFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await addContact(data as ContactCreate);
      setFeedback({ type: 'success', message: '¡Contacto añadido con éxito!' });
      reset(); // Limpia el formulario
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo añadir el contacto.' });
    }
  };

  const onDeleteContact = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      try {
        await deleteContact(uuid);
        setFeedback({ type: 'success', message: 'Contacto eliminado.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar el contacto.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Contactos de Emergencia
      </Typography>
      
      {/* Formulario para añadir contacto */}
      <Box component="form" onSubmit={handleSubmit(onAddContact)} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">Añadir Nuevo Contacto</Typography>
        {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
        <TextField {...register('name')} label="Nombre Completo" fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} />
        <TextField {...register('email')} label="Correo Electrónico" fullWidth margin="normal" required error={!!errors.email} helperText={errors.email?.message} />
        <TextField {...register('phone')} label="Teléfono" fullWidth margin="normal" required error={!!errors.phone} helperText={errors.phone?.message} />
        <TextField {...register('relationship_type')} label="Relación (Ej: Padre, Médico)" fullWidth margin="normal" required error={!!errors.relationship_type} helperText={errors.relationship_type?.message} />
        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
          {isSubmitting ? 'Añadiendo...' : 'Añadir Contacto'}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Lista de contactos existentes */}
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
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteContact(contact.uuid)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText 
              primary={contact.name}
              secondary={`${contact.relationship_type} - ${contact.phone}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
