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
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useAddressStore } from '@/store/address/address.store';
import { AddressCreate, AddressUpdate } from '@/interfaces/client/address.interface';

const getAddressSchema = (t: (key: string) => string) => z.object({
  street: z.string().min(3, t('validation.streetRequired')),
  city: z.string().min(2, t('validation.cityRequired')),
  state: z.string().min(2, t('validation.stateRequired')),
  postal_code: z.string().min(3, t('validation.postalCodeRequired')),
  country: z.string().min(2, t('validation.countryRequired')),
});

type AddressFormInputs = z.infer<ReturnType<typeof getAddressSchema>>;

export default function AddressCard() {
  const { t } = useTranslation();
  const {
    address,
    loading,
    error,
    fetchAddress,
    addAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const addressSchema = getAddressSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
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
    } else {
      reset({ street: '', city: '', state: '', postal_code: '', country: '' });
    }
  }, [address, reset]);

  const handleOpenModal = () => {
    setFeedback(null);
    if (address) {
      reset(address);
    } else {
      reset({ street: '', city: '', state: '', postal_code: '', country: '' });
    }
    setModalOpen(true);
  };

  const onSubmit: SubmitHandler<AddressFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (address) {
        await updateAddress(address.uuid, data as AddressUpdate);
        setFeedback({ type: 'success', message: t('dashboard_profile.address.updateSuccess') });
      } else {
        await addAddress(data as AddressCreate);
        setFeedback({ type: 'success', message: t('dashboard_profile.address.addSuccess') });
      }
      setModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_profile.address.updateError') });
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialogOpen(false);
    if (address) {
      try {
        await deleteAddress(address.uuid);
        setFeedback({ type: 'success', message: t('dashboard_profile.address.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_profile.address.deleteError') });
      }
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('dashboard_profile.address.title')}
        </Typography>
        <Box>
          {address ? (
            <>
              <IconButton onClick={handleOpenModal}><EditIcon /></IconButton>
              <IconButton onClick={() => setDeleteDialogOpen(true)}><DeleteIcon /></IconButton>
            </>
          ) : (
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleOpenModal}>
              {t('dashboard_profile.address.addButton')}
            </Button>
          )}
        </Box>
      </Box>

      {error && !isModalOpen && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {feedback && !isModalOpen && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}

      {address ? (
        <Box sx={{ mt: 2 }}>
          <Typography>{address.street}</Typography>
          <Typography>{`${address.city}, ${address.state} ${address.postal_code}`}</Typography>
          <Typography>{address.country}</Typography>
        </Box>
      ) : (
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          {t('dashboard_profile.address.noAddress')}
        </Typography>
      )}

      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{address ? t('dashboard_profile.address.editTitle') : t('dashboard_profile.address.addTitle')}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
            <Controller name="street" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.address.form.streetLabel')} fullWidth margin="normal" required error={!!errors.street} helperText={errors.street?.message} />} />
            <Controller name="city" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.address.form.cityLabel')} fullWidth margin="normal" required error={!!errors.city} helperText={errors.city?.message} />} />
            <Controller name="state" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.address.form.stateLabel')} fullWidth margin="normal" required error={!!errors.state} helperText={errors.state?.message} />} />
            <Controller name="postal_code" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.address.form.postalCodeLabel')} fullWidth margin="normal" required error={!!errors.postal_code} helperText={errors.postal_code?.message} />} />
            <Controller name="country" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.address.form.countryLabel')} fullWidth margin="normal" required error={!!errors.country} helperText={errors.country?.message} />} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting || !isDirty}>{isSubmitting ? t('common.saving') : t('dashboard_profile.address.form.saveButton')}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t('dashboard_profile.address.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('dashboard_profile.address.deleteConfirmText')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error">{t('common.delete')}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
