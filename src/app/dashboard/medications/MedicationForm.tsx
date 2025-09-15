'use client';

/**
 * @file A reusable form component for creating and editing medication schedules.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MedicationScheduleCreate, MedicationScheduleUpdate } from '@/interfaces/client/medication.interface';

const getMedicationSchema = (t: (key: string) => string) => z.object({
  medication_name: z.string().min(2, { message: t('validation.medicationNameRequired') }),
  dosage: z.string().min(1, { message: t('validation.dosageRequired') }),
  frequency_type: z.string().min(1, { message: t('validation.frequencyRequired') }),
  start_date: z.string().min(1, { message: t('validation.startDateRequired') }),
  end_date: z.string().optional(),
});

type MedicationFormInputs = z.infer<ReturnType<typeof getMedicationSchema>>;

interface MedicationFormProps {
  onSubmit: (data: MedicationScheduleCreate | MedicationScheduleUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: MedicationFormInputs | null;
}

export default function MedicationForm({ onSubmit, onCancel, initialData }: MedicationFormProps) {
  const { t } = useTranslation();
  const medicationSchema = getMedicationSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormInputs>({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || { medication_name: '', dosage: '', frequency_type: '', start_date: '', end_date: '' },
  });

  React.useEffect(() => {
    reset(initialData || { medication_name: '', dosage: '', frequency_type: '', start_date: '', end_date: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<MedicationFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller name="medication_name" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_medications.form.medicationNameLabel')} fullWidth margin="normal" required error={!!errors.medication_name} helperText={errors.medication_name?.message} autoFocus />} />
      <Controller name="dosage" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_medications.form.dosageLabel')} fullWidth margin="normal" required error={!!errors.dosage} helperText={errors.dosage?.message} />} />
      <Controller name="frequency_type" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_medications.form.frequencyLabel')} fullWidth margin="normal" required error={!!errors.frequency_type} helperText={errors.frequency_type?.message} />} />
      <Controller name="start_date" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_medications.form.startDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.start_date} helperText={errors.start_date?.message} />} />
      <Controller name="end_date" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_medications.form.endDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
