'use client';

/**
 * @file A reusable form component for creating and editing addictions.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AddictionCreate, AddictionUpdate } from '@/interfaces/client/addiction.interface';

// Zod schema for addiction form validation
const getAddictionSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.addictionNameRequired') }),
  start_date: z.string().min(1, { message: t('validation.addictionStartDateRequired') }),
  status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type AddictionFormInputs = z.infer<ReturnType<typeof getAddictionSchema>>;

interface AddictionFormProps {
  onSubmit: (data: AddictionCreate | AddictionUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: AddictionFormInputs | null;
}

export default function AddictionForm({ onSubmit, onCancel, initialData }: AddictionFormProps) {
  const { t } = useTranslation();
  const addictionSchema = getAddictionSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddictionFormInputs>({
    resolver: zodResolver(addictionSchema),
    defaultValues: initialData || { name: '', start_date: '', status: '', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { name: '', start_date: '', status: '', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<AddictionFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller name="name" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_addictions.form.nameLabel')} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} autoFocus />} />
      <Controller name="start_date" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_addictions.form.startDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} />} />
      <Controller name="status" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_addictions.form.statusLabel')} fullWidth margin="normal" />} />
      <Controller name="notes" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_addictions.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
