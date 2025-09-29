'use client';

/**
 * @file A reusable form component for creating and editing medical conditions (diseases).
 * It allows selecting a category and then searching for a disease from a master list.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';

import { PatientDiseaseCreate, PatientDiseaseUpdate, DiseaseRead } from '@/interfaces/client/disease.interface';
import { useDiseaseStore } from '@/store/disease/disease.store';

const getDiseaseFormSchema = (t: (key: string) => string) => z.object({
  category: z.string({ required_error: t('validation.categoryRequired') }).min(1, t('validation.categoryRequired')),
  disease: z.custom<DiseaseRead>(v => v !== null && typeof v === 'object' && 'uuid' in v, {
    message: t('validation.diseaseRequired'),
  }),
  diagnosis_date: z.string().min(1, { message: t('validation.diagnosisDateRequired') }),
  severity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type DiseaseFormInputs = z.infer<ReturnType<typeof getDiseaseFormSchema>>;

interface DiseaseFormProps {
  onSubmit: (data: PatientDiseaseCreate | PatientDiseaseUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
  isEditMode?: boolean;
}

export default function DiseaseForm({ onSubmit, onCancel, initialData, isEditMode = false }: DiseaseFormProps) {
  const { t } = useTranslation();
  const formSchema = getDiseaseFormSchema(t);

  const {
    categories,
    categoriesLoading,
    fetchCategories,
    masterList,
    masterListLoading,
    fetchMasterList,
  } = useDiseaseStore();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DiseaseFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { category: '', disease: null, diagnosis_date: '', severity: '', notes: '' },
  });

  const selectedCategory = watch('category');

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    if (selectedCategory) {
      fetchMasterList(selectedCategory);
    }
  }, [selectedCategory, fetchMasterList]);

  React.useEffect(() => {
    reset(initialData || { category: '', disease: null, diagnosis_date: '', severity: '', notes: '' });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<DiseaseFormInputs> = async (data) => {
    const submissionData: PatientDiseaseCreate = {
      disease_uuid: data.disease.uuid,
      diagnosis_date: data.diagnosis_date,
      severity: data.severity,
      notes: data.notes,
    };
    await onSubmit(submissionData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <FormControl fullWidth margin="normal" required error={!!errors.category}>
            <InputLabel>{t('dashboard_diseases.form.categoryLabel')}</InputLabel>
            <Select {...field} label={t('dashboard_diseases.form.categoryLabel')} disabled={isEditMode || categoriesLoading}>
              {Object.keys(categories).map((catKey) => (
                <MenuItem key={catKey} value={catKey}>
                  {t(`dashboard_diseases.diseases_categories.${catKey}`, catKey)}
                </MenuItem>
              ))}
            </Select>
            {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <Controller
        name="disease"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={masterList}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
            loading={masterListLoading}
            onChange={(_, data) => field.onChange(data)}
            disabled={isEditMode || !selectedCategory || masterListLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dashboard_diseases.form.searchLabel')}
                margin="normal"
                required
                error={!!errors.disease}
                helperText={errors.disease?.message || (isEditMode ? 'Cannot change the disease' : t('dashboard_diseases.form.searchHelperText'))}
                InputProps={{ ...params.InputProps, endAdornment: <>{masterListLoading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</> }}
              />
            )}
          />
        )}
      />
      <Controller name="diagnosis_date" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_diseases.form.diagnosisDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />} />
      <Controller name="severity" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_diseases.form.severityLabel')} fullWidth margin="normal" />} />
      <Controller name="notes" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_diseases.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
