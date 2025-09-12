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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddReactionForm from './AddReactionForm';

import { useAllergyStore } from '@/store/allergy/allergy.store';
import { AllergyRead, AllergyUpdate, AllergyCreateFromCode, ReactionHistoryCreate } from '@/interfaces/client/allergy.interface';
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

export default function AllergiesPage() {
  const { t } = useTranslation();
  const { allergies, loading, error, fetchMyAllergies, addAllergyFromCode, removeAllergy, editAllergy, addNewReaction } = useAllergyStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingAllergy, setEditingAllergy] = React.useState<AllergyRead | null>(null);
  const [reactionFormOpen, setReactionFormOpen] = React.useState(false);
  const [selectedAllergyForReaction, setSelectedAllergyForReaction] = React.useState<string | null>(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<MedicalCodeSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const allergySchema = getAllergySchema(t);

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<AllergyFormInputs>({
    resolver: zodResolver(allergySchema),
    defaultValues: { allergen: null, reaction_type: '', severity: '' },
  });

  React.useEffect(() => { fetchMyAllergies(); }, [fetchMyAllergies]);

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

  const handleAddNewClick = () => {
    setEditingAllergy(null);
    reset({ allergen: null, reaction_type: '', severity: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (allergy: AllergyRead) => { alert(t('dashboard_allergies.feedback.editNotAvailable')); };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingAllergy(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    setFeedback(null);
    if (!data.allergen) return;

    try {
      const payload: AllergyCreateFromCode = { code: data.allergen.code, name: data.allergen.name, source: 'snomed', reaction_type: data.reaction_type, severity: data.severity };
      await addAllergyFromCode(payload);
      setFeedback({ type: 'success', message: t('dashboard_allergies.feedback.addSuccess') });
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_allergies.feedback.addError') });
    }
  };

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

  const handleOpenReactionForm = (allergyUuid: string) => {
    setSelectedAllergyForReaction(allergyUuid);
    setReactionFormOpen(true);
  };

  const handleCloseReactionForm = () => {
    setReactionFormOpen(false);
    setSelectedAllergyForReaction(null);
  };

  const handleAddReaction = async (data: ReactionHistoryCreate) => {
    if (!selectedAllergyForReaction) return;
    try {
      await addNewReaction(selectedAllergyForReaction, data);
      setFeedback({ type: 'success', message: 'Reaction added successfully!' });
      handleCloseReactionForm();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add reaction' });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_allergies.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>{t('dashboard_allergies.addButton')}</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_allergies.form.title')}</Typography>
            <Controller name="allergen" control={control} render={({ field }) => <Autocomplete {...field} options={searchResults} getOptionLabel={(option) => option.name || ''} isOptionEqualToValue={(option, value) => option.code === value.code} loading={searchLoading} onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)} onChange={(_, data) => field.onChange(data)} renderInput={(params) => <TextField {...params} label={t('dashboard_allergies.form.searchLabel')} margin="normal" required error={!!errors.allergen} helperText={errors.allergen?.message || t('dashboard_allergies.form.searchHelperText')} InputProps={{ ...params.InputProps, endAdornment: <>{searchLoading ? <CircularProgress color="inherit" size={20} /> : null}{params.InputProps.endAdornment}</> }} />} />} />
            <Controller name="reaction_type" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.reactionLabel')} fullWidth margin="normal" />} />
            <Controller name="severity" control={control} render={({ field }) => <TextField {...field} value={field.value || ''} label={t('dashboard_allergies.form.severityLabel')} fullWidth margin="normal" />} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? t('common.saving') : t('dashboard_allergies.form.submitButton')}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>{t('common.cancel')}</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">{t('dashboard_allergies.list.title')}</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && <Typography sx={{ mt: 2 }}>{t('dashboard_allergies.list.noAllergies')}</Typography>}
      <List>
        {allergies.map((allergy) => (
          <ListItem key={allergy.uuid} sx={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary={allergy.allergen} secondary={`${t('dashboard_allergies.list.reactionLabel')}: ${allergy.reaction_type || 'N/A'} - ${t('dashboard_allergies.list.severityLabel')}: ${allergy.severity || 'N/A'}`} />
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(allergy)} disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAllergy(allergy.uuid)}><DeleteIcon /></IconButton>
              </Box>
            </Box>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="subtitle2">Reaction History</Typography>
              {allergy.reaction_history && allergy.reaction_history.length > 0 ? (
                <List dense disablePadding>
                  {allergy.reaction_history.map(reaction => (
                    <ListItem key={reaction.uuid} sx={{ pl: 2 }}>
                      <ListItemText primary={reaction.symptoms} secondary={`Date: ${new Date(reaction.reaction_date).toLocaleDateString()}`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>No reactions recorded.</Typography>
              )}
              <Button size="small" startIcon={<AddIcon />} onClick={() => handleOpenReactionForm(allergy.uuid)} sx={{ mt: 1, ml: 1 }}>Add Reaction</Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={reactionFormOpen} onClose={handleCloseReactionForm}>
        <DialogTitle>Add New Reaction</DialogTitle>
        <DialogContent>
          <AddReactionForm onSubmit={handleAddReaction} onCancel={handleCloseReactionForm} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
