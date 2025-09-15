'use client';

/**
 * @file A reusable form component for creating and editing infectious diseases.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { InfectiousDiseaseCreate, InfectiousDiseaseUpdate } from '@/interfaces/client/infectious-disease.interface';

// Zod schema for form validation
const getInfectiousDiseaseSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.infectiousDiseaseNameRequired') }),
  diagnosis_date: z.string().min(1, { message: t('validation.infectiousDiseaseDiagnosisDateRequired') }),
  status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type InfectiousDiseaseFormInputs = z.infer<ReturnType<typeof getInfectiousDiseaseSchema>>;

interface InfectiousDiseaseFormProps {
  onSubmit: (data: InfectiousDiseaseCreate | InfectiousDiseaseUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: InfectiousDiseaseFormInputs | null;
}

export default function InfectiousDiseaseForm({ onSubmit, onCancel, initialData }: InfectiousDiseaseFormProps) {
  const { t } = useTranslation();
  const formSchema = getInfectiousDiseaseSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InfectiousDiseaseFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: '', diagnosis_date: '', status: '', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { name: '', diagnosis_date: '', status: '', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<InfectiousDiseaseFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <Controller name="name" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_infectious_diseases.form.nameLabel')} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} autoFocus />)} />
        <Controller name="diagnosis_date" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_infectious_diseases.form.diagnosisDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />)} />
        <Controller name="status" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_infectious_diseases.form.statusLabel')} fullWidth margin="normal" />)} />
        <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_infectious_diseases.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />)} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
