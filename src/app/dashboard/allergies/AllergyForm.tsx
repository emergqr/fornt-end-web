'use client';

/**
 * @file A reusable form component for creating and editing allergies.
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

import { AllergyCreateFromCode, AllergyUpdate } from '@/interfaces/client/allergy.interface';
import { medicalCodeService, MedicalCodeSearchResult } from '@/services/client/medicalCodeService';
import { useDebounce } from '@/hooks/useDebounce';

const getAllergySchema = (t: (key: string) => string) => z.object({
  allergen: z.custom<MedicalCodeSearchResult>(v => v !== null && typeof v === 'object' && 'code' in v, {
    message: t('validation.allergenRequired'),
  }),
  reaction_type: z.string().optional(),
  severity: z.string().optional(),
});

type AllergyFormInputs = z.infer<ReturnType<typeof getAllergySchema>>;

interface AllergyFormProps {
  onSubmit: (data: AllergyCreateFromCode | AllergyUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
  isEditMode?: boolean;
}

export default function AllergyForm({ onSubmit, onCancel, initialData, isEditMode = false }: AllergyFormProps) {
  const { t } = useTranslation();
  const formSchema = getAllergySchema(t);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AllergyFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { allergen: null, reaction_type: '', severity: '' },
  });

  React.useEffect(() => {
    reset(initialData || { allergen: null, reaction_type: '', severity: '' });
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

  const handleFormSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="allergen"
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
            disabled={isEditMode} // Disable changing the allergen when editing
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dashboard_allergies.form.searchLabel')}
                margin="normal"
                required
                autoFocus
                error={!!errors.allergen}
                helperText={errors.allergen?.message || (isEditMode ? 'Cannot change the allergen' : t('dashboard_allergies.form.searchHelperText'))}
                InputProps={{ ...params.InputProps, endAdornment: <>{searchLoading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</> }}
              />
            )}
          />
        )}
      />
      <Controller name="reaction_type" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.reactionLabel')} fullWidth margin="normal" />} />
      <Controller name="severity" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.severityLabel')} fullWidth margin="normal" />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
