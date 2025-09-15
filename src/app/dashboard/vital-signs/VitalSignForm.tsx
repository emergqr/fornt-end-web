'use client';

/**
 * @file A reusable form component for creating and editing vital signs.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { VitalSignCreate } from '@/interfaces/client/vital-sign.interface';

const getVitalSignSchema = (t: (key: string) => string) => z.object({
  type: z.string().min(1, { message: t('validation.vitalTypeRequired') }),
  value_numeric: z.coerce.number().optional(),
  value_secondary: z.coerce.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

type VitalSignFormInputs = z.infer<ReturnType<typeof getVitalSignSchema>>;

interface VitalSignFormProps {
  onSubmit: (data: VitalSignCreate) => Promise<void>;
  onCancel: () => void;
  types: string[];
  initialData?: VitalSignFormInputs | null;
}

export default function VitalSignForm({ onSubmit, onCancel, types, initialData }: VitalSignFormProps) {
  const { t } = useTranslation();
  const formSchema = getVitalSignSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VitalSignFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { type: '', value_numeric: undefined, value_secondary: undefined, unit: '', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { type: '', value_numeric: undefined, value_secondary: undefined, unit: '', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<VitalSignFormInputs> = async (data) => {
    await onSubmit(data as VitalSignCreate);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" required error={!!errors.type}>
            <InputLabel id="type-label">{t('dashboard_vitals.form.typeLabel')}</InputLabel>
            <Select {...field} labelId="type-label" label={t('dashboard_vitals.form.typeLabel')}>
              {types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </Select>
          </FormControl>
        )}
      />
      <Controller name="value_numeric" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.primaryValueLabel')} type="number" fullWidth margin="normal" />} />
      <Controller name="value_secondary" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.secondaryValueLabel')} type="number" fullWidth margin="normal" />} />
      <Controller name="unit" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.unitLabel')} fullWidth margin="normal" />} />
      <Controller name="notes" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
