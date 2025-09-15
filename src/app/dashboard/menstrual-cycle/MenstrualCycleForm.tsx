'use client';

/**
 * @file A reusable form component for creating and editing menstrual cycle logs.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MenstrualLogCreate, MenstrualLogUpdate } from '@/interfaces/client/menstrual-cycle.interface';

const getMenstrualLogSchema = (t: (key: string) => string) => z.object({
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  end_date: z.string().optional().nullable(),
  flow_level: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type MenstrualLogFormInputs = z.infer<ReturnType<typeof getMenstrualLogSchema>>;

interface MenstrualCycleFormProps {
  onSubmit: (data: MenstrualLogCreate | MenstrualLogUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: MenstrualLogFormInputs | null;
}

export default function MenstrualCycleForm({ onSubmit, onCancel, initialData }: MenstrualCycleFormProps) {
  const { t } = useTranslation();
  const formSchema = getMenstrualLogSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenstrualLogFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { start_date: '', end_date: '', flow_level: '', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { start_date: '', end_date: '', flow_level: '', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<MenstrualLogFormInputs> = async (data) => {
    // The API expects symptoms to be an array, but we are not collecting it in this simplified form.
    const payload = { ...data, symptoms: [] };
    await onSubmit(payload);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller name="start_date" control={control} render={({ field }) => <TextField {...field} label="Start Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} autoFocus />} />
      <Controller name="end_date" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label="End Date" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />} />
      <Controller name="flow_level" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label="Flow Level (e.g., Light, Medium)" fullWidth margin="normal" />} />
      <Controller name="notes" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label="Symptoms & Notes" fullWidth margin="normal" multiline rows={2} />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
