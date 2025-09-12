'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import Autocomplete from '@mui/material/Autocomplete';

// Import stores and services
import { useAllergyStore } from '@/store/allergy/allergy.store';
import { AllergyRead, AllergyUpdate, AllergyCreateFromCode } from '@/interfaces/client/allergy.interface';
import { medicalCodeService, MedicalCodeResult } from '@/services/client/medicalCodeService';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Zod schema for allergy form validation.
 * It uses a custom validator for the allergen field to ensure an object is selected from the autocomplete.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema.
 */
const getAllergySchema = (t: (key: string) => string) => z.object({
  allergen: z.custom<MedicalCodeResult>(v => v !== null && typeof v === 'object' && 'code' in v, {
    message: t('validation.allergenRequired'),
  }),
  reaction_type: z.string().optional(),
  severity: z.string().optional(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type AllergyFormInputs = z.infer<ReturnType<typeof getAllergySchema>>;

/**
 * Renders the allergies management page.
 * Allows users to add, view, and delete their allergies.
 * It features a smart search for allergens using an external medical code service.
 */
export default function AllergiesPage() {
  const { t } = useTranslation();
  const {
    allergies,
    loading,
    error,
    fetchMyAllergies,
    addAllergyFromCode,
    removeAllergy,
    editAllergy,
  } = useAllergyStore();

  // State for user feedback (e.g., success or error messages)
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // State to control the visibility of the add/edit form
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  // State to hold the allergy being edited
  const [editingAllergy, setEditingAllergy] = React.useState<AllergyRead | null>(null);

  // State for the smart search functionality
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Initialize the form validation schema
  const allergySchema = getAllergySchema(t);

  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AllergyFormInputs>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      allergen: null,
      reaction_type: '',
      severity: '',
    },
  });

  // Fetch user's allergies when the component mounts
  React.useEffect(() => {
    fetchMyAllergies();
  }, [fetchMyAllergies]);

  // Effect to trigger the medical code search when the debounced query changes
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
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
      setSearchLoading(false);
    };
    void search();
  }, [debouncedSearchQuery]);

  // Handler to show the form for adding a new allergy
  const handleAddNewClick = () => {
    setEditingAllergy(null);
    reset({ allergen: null, reaction_type: '', severity: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  // Handler for the edit button (currently shows an alert as the feature is pending)
  const handleEditClick = (allergy: AllergyRead) => {
    alert(t('dashboard_allergies.feedback.editNotAvailable'));
  };

  // Handler to hide the form and reset its state
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingAllergy(null);
    reset();
    setFeedback(null);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    setFeedback(null);
    if (!data.allergen) return; // Should not happen due to validation, but good practice

    if (editingAllergy) {
      // Logic for updating an existing allergy (simplified for now)
      const updatePayload: AllergyUpdate = { reaction_type: data.reaction_type, severity: data.severity };
      await editAllergy(editingAllergy.uuid, updatePayload);
      setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.updateSuccess') });
    } else {
      // Logic for creating a new allergy using data from the smart search
      try {
        const payload: AllergyCreateFromCode = {
          code: data.allergen.code,
          name: data.allergen.name,
          source: 'snomed',
          reaction_type: data.reaction_type,
          severity: data.severity,
        };
        await addAllergyFromCode(payload);
        setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.addSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_allergies.feedback.addError') });
      }
    }
    handleCancel();
  };

  // Handler to delete an allergy with a confirmation dialog
  const onDeleteAllergy = async (uuid: string) => {
    if (window.confirm(t('dashboard_allergies.feedback.deleteConfirm'))) {
      try {
        await removeAllergy(uuid);
        setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_allergies.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_allergies.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_allergies.addButton')}</Button>
      </Box>

      {/* Add/Edit Form (Collapsible) */}
      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_allergies.form.title')}</Typography>
            
            {/* Allergen Autocomplete Search Field */}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('dashboard_allergies.form.searchLabel')}
                      margin="normal"
                      required
                      error={!!errors.allergen}
                      helperText={errors.allergen?.message || t('dashboard_allergies.form.searchHelperText')}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />
            <Controller name="reaction_type" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.reactionLabel')} fullWidth margin="normal" />)} />
            <Controller name="severity" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.severityLabel')} fullWidth margin="normal" />)} />
            
            {/* Form Action Buttons */}
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_allergies.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Feedback Alert */}
      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      {/* List of Registered Allergies */}
      <Typography variant="h6">{t('dashboard_allergies.list.title')}</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_allergies.list.noAllergies')}</Typography>}
      <List>
        {allergies.map((allergy) => (
          <ListItem key={allergy.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(allergy)} disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAllergy(allergy.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={allergy.allergen} secondary={`${t('dashboard_allergies.list.reactionLabel')}: ${allergy.reaction_type || t('dashboard_allergies.list.notAvailable')} - ${t('dashboard_allergies.list.severityLabel')}: ${allergy.severity || t('dashboard_allergies.list.notAvailable')}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
