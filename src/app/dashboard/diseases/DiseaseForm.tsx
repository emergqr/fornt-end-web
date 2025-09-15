'use client';

/**
 * @file A reusable form component for creating and editing medical conditions (diseases).
 * It includes a smart search feature for finding standardized medical terms.
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

import { DiseaseCreateFromCode, PatientDiseaseUpdate } from '@/interfaces/client/disease.interface';
import { medicalCodeService, MedicalCodeSearchResult } from '@/services/client/medicalCodeService';
import { useDebounce } from '@/hooks/useDebounce';

const getDiseaseFormSchema = (t: (key: string) => string) => z.object({
  disease: z.custom<MedicalCodeSearchResult>(v => v !== null && typeof v === 'object' && 'code' in v, {
    message: t('validation.diseaseRequired'),
  }),
  diagnosis_date: z.string().min(1, { message: t('validation.diagnosisDateRequired') }),
  severity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type DiseaseFormInputs = z.infer<ReturnType<typeof getDiseaseFormSchema>>;

interface DiseaseFormProps {
  onSubmit: (data: DiseaseCreateFromCode | PatientDiseaseUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
  isEditMode?: boolean;
}

export default function DiseaseForm({ onSubmit, onCancel, initialData, isEditMode = false }: DiseaseFormProps) {
  const { t } = useTranslation();
  const formSchema = getDiseaseFormSchema(t);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiseaseFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { disease: null, diagnosis_date: '', severity: '', notes: '' },
  });

  React.useEffect(() => {
    reset(initialData || { disease: null, diagnosis_date: '', severity: '', notes: '' });
  }, [initialData, reset]);

  React.useEffect(() => {
    if (debouncedSearchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const search = async () => {
      setSearchLoading(true);
      try {
        const results = await medicalCodeService.searchMedicalTerm('snomed', debouncedSearchQuery);
        setSearchResults(results);
      } catch (error) { console.error("Search failed:", error); setSearchResults([]); }
      setSearchLoading(false);
    };
    void search();
  }, [debouncedSearchQuery]);

  const handleFormSubmit: SubmitHandler<DiseaseFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="disease"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={searchResults}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            loading={searchLoading}
            onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
            onChange={(_, data) => field.onChange(data)}
            disabled={isEditMode}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dashboard_diseases.form.searchLabel')}
                margin="normal"
                required
                autoFocus
                error={!!errors.disease}
                helperText={errors.disease?.message || (isEditMode ? 'Cannot change the disease' : t('dashboard_diseases.form.searchHelperText'))}
                InputProps={{ ...params.InputProps, endAdornment: <>{searchLoading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</> }}
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
