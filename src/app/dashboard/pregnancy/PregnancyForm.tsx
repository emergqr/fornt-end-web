'use client';

/**
 * @file A reusable form component for creating and editing pregnancy records.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { PregnancyCreate, PregnancyUpdate } from '@/interfaces/client/pregnancy.interface';

const getPregnancySchema = (t: (key: string) => string) => z.object({
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  due_date: z.string().optional().nullable(),
  status: z.string().min(1, { message: t('validation.statusRequired') }),
  notes: z.string().optional().nullable(),
});

type PregnancyFormInputs = z.infer<ReturnType<typeof getPregnancySchema>>;

interface PregnancyFormProps {
  onSubmit: (data: PregnancyCreate | PregnancyUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: PregnancyFormInputs | null;
}

export default function PregnancyForm({ onSubmit, onCancel, initialData }: PregnancyFormProps) {
  const { t } = useTranslation();
  const formSchema = getPregnancySchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PregnancyFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { start_date: '', due_date: '', status: 'Active', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { start_date: '', due_date: '', status: 'Active', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<PregnancyFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller name="start_date" control={control} render={({ field }) => (<TextField {...field} label="Last Menstrual Period" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} autoFocus />)} />
      <Controller name="due_date" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Due Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />)} />
      <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Status (e.g., Active, Completed)" fullWidth margin="normal" required error={!!errors.status} helperText={errors.status?.message} />)} />
      <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Notes" fullWidth margin="normal" multiline rows={2} />)} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
