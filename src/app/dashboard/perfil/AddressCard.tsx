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
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

import { useAddressStore } from '@/store/address/address.store';
import { AddressCreate, AddressUpdate } from '@/interfaces/client/address.interface';

const addressSchema = z.object({
  street: z.string().min(3, "La calle es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El estado o provincia es requerido"),
  postal_code: z.string().min(3, "El código postal es requerido"),
  country: z.string().min(2, "El país es requerido"),
});

type AddressFormInputs = z.infer<typeof addressSchema>;

export default function AddressCard() {
  const {
    address,
    loading,
    error,
    fetchAddress,
    addAddress,
    updateAddress,
  } = useAddressStore();

  const [isEditing, setIsEditing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormInputs>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });

  React.useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  React.useEffect(() => {
    if (address) {
      reset(address);
      setIsEditing(false);
    } else {
      setIsEditing(true); // Si no hay dirección, mostrar el formulario por defecto
    }
  }, [address, reset]);

  const onSubmit: SubmitHandler<AddressFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (address) {
        await updateAddress(address.uuid, data as AddressUpdate);
        setFeedback({ type: 'success', message: '¡Dirección actualizada con éxito!' });
      } else {
        await addAddress(data as AddressCreate);
        setFeedback({ type: 'success', message: '¡Dirección guardada con éxito!' });
      }
      setIsEditing(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo guardar la dirección.' });
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Mi Dirección
        </Typography>
        {address && !isEditing && (
          <IconButton onClick={() => setIsEditing(true)}>
            <EditIcon />
          </IconButton>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {isEditing ? (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
          {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
          <Controller name="street" control={control} render={({ field }) => <TextField {...field} label="Calle y Número" fullWidth margin="normal" required error={!!errors.street} helperText={errors.street?.message} />} />
          <Controller name="city" control={control} render={({ field }) => <TextField {...field} label="Ciudad" fullWidth margin="normal" required error={!!errors.city} helperText={errors.city?.message} />} />
          <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="Estado / Provincia" fullWidth margin="normal" required error={!!errors.state} helperText={errors.state?.message} />} />
          <Controller name="postal_code" control={control} render={({ field }) => <TextField {...field} label="Código Postal" fullWidth margin="normal" required error={!!errors.postal_code} helperText={errors.postal_code?.message} />} />
          <Controller name="country" control={control} render={({ field }) => <TextField {...field} label="País" fullWidth margin="normal" required error={!!errors.country} helperText={errors.country?.message} />} />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {address && <Button variant="outlined" onClick={() => setIsEditing(false)}>Cancelar</Button>}
            <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Dirección'}</Button>
          </Box>
        </Box>
      ) : address ? (
        <Box sx={{ mt: 2 }}>
          <Typography>{address.street}</Typography>
          <Typography>{`${address.city}, ${address.state} ${address.postal_code}`}</Typography>
          <Typography>{address.country}</Typography>
        </Box>
      ) : (
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          No has añadido una dirección todavía. Haz clic en el botón de editar para añadir una.
        </Typography>
      )}
    </Paper>
  );
}
