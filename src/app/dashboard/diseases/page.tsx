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

import { useDiseaseStore } from '@/store/disease/disease.store';
import { PatientDiseaseRead, PatientDiseaseUpdate } from '@/interfaces/client/disease.interface';
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

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingDisease, setEditingDisease] = React.useState<PatientDiseaseRead | null>(null);
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const diseaseFormSchema = getDiseaseFormSchema(t);

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

  React.useEffect(() => {
    fetchMyDiseases();
  }, [fetchMyDiseases]);

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

  const handleAddNewClick = () => {
    setEditingDisease(null);
    reset({ disease: null, diagnosis_date: '', severity: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (disease: PatientDiseaseRead) => {
    alert(t('dashboard_diseases.feedback.editNotAvailable'));
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingDisease(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<DiseaseFormInputs> = async (data) => {
    setFeedback(null);
    if (editingDisease) {
      const updatePayload: PatientDiseaseUpdate = { 
        diagnosis_date: data.diagnosis_date,
        severity: data.severity,
        notes: data.notes,
       };
      await editDisease(editingDisease.uuid, updatePayload);
      setFeedback({ type: 'success', message: t('dashboard_diseases.feedback.updateSuccess') });
    } else {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_diseases.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_diseases.addButton')}</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_diseases.form.title')}</Typography>
            
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
            
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_diseases.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

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
