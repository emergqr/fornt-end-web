'use client';

/**
 * @file A reusable form component for creating and editing allergies.
 * It allows selecting an allergy from a predefined category list.
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

import { AllergyCategory, AllergyCreate, AllergyUpdate } from '@/interfaces/client/allergy.interface';
import { useAllergyStore } from '@/store/allergy/allergy.store';

// Zod schema for form validation.
const getAllergySchema = (t: (key: string) => string) => z.object({
  // The user must select a valid category object from the list.
  category: z.custom<AllergyCategory>(v => v !== null && typeof v === 'object' && 'uuid' in v, {
    message: t('validation.allergenRequired'),
  }),
  reaction_type: z.string().optional(),
  severity: z.string().optional(),
});

type AllergyFormInputs = z.infer<ReturnType<typeof getAllergySchema>>;

interface AllergyFormProps {
  onSubmit: (data: AllergyCreate | AllergyUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: any | null;
  isEditMode?: boolean;
}

export default function AllergyForm({ onSubmit, onCancel, initialData, isEditMode = false }: AllergyFormProps) {
  const { t } = useTranslation();
  const formSchema = getAllergySchema(t);

  // Get categories and the fetch action from the Zustand store.
  const {
    categories,
    isFetchingCategories,
    fetchCategories
  } = useAllergyStore((state) => state);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AllergyFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { category: null, reaction_type: '', severity: '' },
  });

  // Fetch categories when the component mounts.
  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    reset(initialData || { category: null, reaction_type: '', severity: '' });
  }, [initialData, reset]);

  // The submission handler now transforms the form data to match the API.
  const handleFormSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    const submissionData: AllergyCreate = {
      category_uuid: data.category.uuid,
      reaction_type: data.reaction_type,
      severity: data.severity,
    };
    await onSubmit(submissionData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={categories}
            getOptionLabel={(option) => option.name || ''}
            isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
            loading={isFetchingCategories}
            onChange={(_, data) => field.onChange(data)}
            disabled={isEditMode} // Disable changing the category when editing
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('dashboard_allergies.form.categoryLabel')}
                margin="normal"
                required
                autoFocus
                error={!!errors.category}
                helperText={errors.category?.message || (isEditMode ? 'Cannot change the allergen' : t('dashboard_allergies.form.categoryHelperText'))}
                InputProps={{ ...params.InputProps, endAdornment: <>{isFetchingCategories ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</> }}
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
