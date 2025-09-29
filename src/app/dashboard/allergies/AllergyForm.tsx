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

// Import AllergyRead to replace `any`
import { AllergyCreate, AllergyUpdate, AllergyRead } from '@/interfaces/client/allergy.interface';
import { useAllergyStore } from '@/store/allergy/allergy.store';

// Zod schema for form validation.
// The form field is now `allergen` to match the data interfaces.
const getAllergySchema = (t: (key: string) => string) => z.object({
  allergen: z.string({ required_error: t('validation.allergenRequired') }).min(1, t('validation.allergenRequired')),
  reaction_type: z.string().optional(),
  severity: z.string().optional(),
});

type AllergyFormInputs = z.infer<ReturnType<typeof getAllergySchema>>;

interface AllergyFormProps {
  onSubmit: (data: AllergyCreate | AllergyUpdate) => Promise<void>;
  onCancel: () => void;
  // Use the correct type `AllergyRead` for initialData.
  initialData?: AllergyRead | null;
  isEditMode?: boolean;
}

export default function AllergyForm({ onSubmit, onCancel, initialData, isEditMode = false }: AllergyFormProps) {
  const { t } = useTranslation();
  const formSchema = getAllergySchema(t);

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
    // Default values now correctly reference `initialData.allergen`.
    defaultValues: {
      allergen: initialData?.allergen || '',
      reaction_type: initialData?.reaction_type || '',
      severity: initialData?.severity || '',
    },
  });

  const categoryNames = React.useMemo(() => categories.map(cat => cat.name), [categories]);

  React.useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  React.useEffect(() => {
    // Reset form with initialData, using the allergen string for the category field.
    reset({
      allergen: initialData?.allergen || '',
      reaction_type: initialData?.reaction_type || '',
      severity: initialData?.severity || '',
    });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    // The form data now perfectly matches the shape of AllergyCreate/Update.
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="allergen" // The form field is now `allergen`
        control={control}
        render={({ field }) => (
          <Autocomplete
            value={field.value || null}
            options={categoryNames}
            getOptionLabel={(option) => t(`allergy_categories.${option}`, { defaultValue: option })}
            loading={isFetchingCategories}
            onChange={(_, data) => field.onChange(data)}
            onBlur={field.onBlur}
            disabled={isEditMode}
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={field.ref}
                label={t('dashboard_allergies.form.categoryLabel')}
                margin="normal"
                required
                autoFocus
                error={!!errors.allergen}
                helperText={errors.allergen?.message || (isEditMode ? 'Cannot change the allergen' : t('dashboard_allergies.form.categoryHelperText'))}
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
