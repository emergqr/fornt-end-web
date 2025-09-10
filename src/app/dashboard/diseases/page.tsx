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
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';

// Import stores and services
import { useDiseaseStore } from '@/store/disease/disease.store';
import { PatientDiseaseRead, PatientDiseaseUpdate } from '@/interfaces/client/disease.interface';
import { medicalCodeService, MedicalCodeSearchResult } from '@/services/client/medicalCodeService';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Zod schema for disease form validation.
 * It ensures that a disease is selected from the autocomplete and a diagnosis date is provided.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema for the disease form.
 */
const getDiseaseFormSchema = (t: (key: string) => string) => z.object({
  disease: z.custom<MedicalCodeSearchResult>(v => v !== null && typeof v === 'object' && 'code' in v, {
    message: t('validation.diseaseRequired'),
  }),
  diagnosis_date: z.string().min(1, { message: t('validation.diagnosisDateRequired') }),
  severity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type DiseaseFormInputs = z.infer<ReturnType<typeof getDiseaseFormSchema>>;

/**
 * Renders the medical conditions (diseases) management page.
 * This component allows users to add, view, and delete their diagnosed conditions.
 * It uses a smart search feature to find standardized medical terms.
 */
export default function DiseasesPage() {
  const { t } = useTranslation();
  const {
    diseases,
    loading,
    error,
    fetchMyDiseases,
    addDiseaseFromCode,
    editDisease,
    removeDisease,
  } = useDiseaseStore();

  // State for user feedback messages (e.g., success, error).
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // State to manage the visibility of the add/edit form.
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  // State to hold the disease currently being edited.
  const [editingDisease, setEditingDisease] = React.useState<PatientDiseaseRead | null>(null);
  
  // State for the smart search functionality.
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Initialize the form validation schema with the translation function.
  const diseaseFormSchema = getDiseaseFormSchema(t);

  // React Hook Form setup for form state management and validation.
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiseaseFormInputs>({
    resolver: zodResolver(diseaseFormSchema),
    defaultValues: {
      disease: null,
      diagnosis_date: '',
      severity: '',
      notes: '',
    },
  });

  // Fetch the user's diseases when the component mounts.
  React.useEffect(() => {
    fetchMyDiseases();
  }, [fetchMyDiseases]);

  // Effect to trigger the medical code search when the debounced query changes.
  React.useEffect(() => {
    if (debouncedSearchQuery.length < 3) {
      setSearchResults([]);
      return;
    }
    const search = async () => {
      setSearchLoading(true);
      try {
        const results = await medicalCodeService.search('snomed', debouncedSearchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
      setSearchLoading(false);
    };
    void search();
  }, [debouncedSearchQuery]);

  // Handler to show the form for adding a new disease.
  const handleAddNewClick = () => {
    setEditingDisease(null);
    reset({ disease: null, diagnosis_date: '', severity: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  // Handler for the edit button. Currently shows an alert as the feature is pending.
  const handleEditClick = (disease: PatientDiseaseRead) => {
    alert(t('dashboard_diseases.feedback.editNotAvailable'));
  };

  // Handler to hide the form and reset its state.
  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingDisease(null);
    reset();
    setFeedback(null);
  };

  // Form submission handler for both creating and updating diseases.
  const onSubmit: SubmitHandler<DiseaseFormInputs> = async (data) => {
    setFeedback(null);
    if (editingDisease) {
      // Logic for updating an existing disease (simplified for now).
      const updatePayload: PatientDiseaseUpdate = { 
        diagnosis_date: data.diagnosis_date,
        severity: data.severity,
        notes: data.notes,
       };
      await editDisease(editingDisease.uuid, updatePayload);
      setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.updateSuccess') });
    } else {
      // Logic for creating a new disease using data from the smart search.
      try {
        await addDiseaseFromCode({
          code: data.disease.code,
          name: data.disease.name,
          source: 'snomed',
          diagnosis_date: data.diagnosis_date,
          severity: data.severity,
          notes: data.notes,
        });
        setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.addSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_diseases.feedback.addError') });
      }
    }
    handleCancel();
  };

  // Handler to delete a disease with a confirmation dialog.
  const onDeleteDisease = async (uuid: string) => {
    if (window.confirm(t('dashboard_diseases.feedback.deleteConfirm'))) {
      try {
        await removeDisease(uuid);
        setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_diseases.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_diseases.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_diseases.addButton')}</Button>
      </Box>

      {/* Add/Edit Form (Collapsible) */}
      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_diseases.form.title')}</Typography>
            
            {/* Disease Autocomplete Search Field */}
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
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('dashboard_diseases.form.searchLabel')}
                      margin="normal"
                      required
                      error={!!errors.disease}
                      helperText={errors.disease?.message || t('dashboard_diseases.form.searchHelperText')}
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

            <Controller name="diagnosis_date" control={control} render={({ field }) => (<TextField {...field} label={t('dashboard_diseases.form.diagnosisDateLabel')} type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />)} />
            <Controller name="severity" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_diseases.form.severityLabel')} fullWidth margin="normal" />)} />
            <Controller name="notes" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label={t('dashboard_diseases.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />)} />
            
            {/* Form Action Buttons */}
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_diseases.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {/* Feedback Alert */}
      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      {/* List of Registered Diseases */}
      <Typography variant="h6">{t('dashboard_diseases.list.title')}</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && diseases.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_diseases.list.noConditions')}</Typography>}
      <List>
        {diseases.map((patientDisease) => (
          <ListItem key={patientDisease.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(patientDisease)} disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteDisease(patientDisease.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={patientDisease.disease.name} secondary={`${t('dashboard_diseases.list.diagnosedLabel')}: ${new Date(patientDisease.diagnosis_date).toLocaleDateString()} - ${t('dashboard_diseases.list.severityLabel')}: ${patientDisease.severity || t('dashboard_diseases.list.notAvailable')}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
