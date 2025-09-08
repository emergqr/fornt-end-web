'use client';

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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

import { useAllergyStore } from '@/store/allergy/allergy.store';
import { AllergyRead, AllergyUpdate } from '@/interfaces/client/allergy.interface';
import { medicalCodeService, MedicalCodeSearchResult } from '@/services/client/medicalCodeService';
import { useDebounce } from '@/hooks/useDebounce';

// Esquema actualizado para el buscador inteligente
const allergySchema = z.object({
  allergen: z.custom<MedicalCodeSearchResult>(v => v !== null && typeof v === 'object' && 'code' in v, {
    message: 'Debe seleccionar una alergia de la lista.',
  }),
  reaction_type: z.string().optional(),
  severity: z.string().optional(),
});

type AllergyFormInputs = z.infer<typeof allergySchema>;

export default function AllergiesPage() {
  const {
    allergies,
    loading,
    error,
    fetchMyAllergies,
    addAllergyFromCode, // Usar la nueva acción
    removeAllergy,
    editAllergy,
  } = useAllergyStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingAllergy, setEditingAllergy] = React.useState<AllergyRead | null>(null);

  // Estado para la búsqueda
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
    resolver: zodResolver(allergySchema),
    defaultValues: {
      allergen: null,
      reaction_type: '',
      severity: '',
    },
  });

  React.useEffect(() => {
    fetchMyAllergies();
  }, [fetchMyAllergies]);

  // Efecto para la búsqueda
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
    setEditingAllergy(null);
    reset({ allergen: null, reaction_type: '', severity: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (allergy: AllergyRead) => {
    alert("La edición de una alergia existente se realizará en una futura versión.");
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingAllergy(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    setFeedback(null);
    if (editingAllergy) {
      // Lógica de edición (simplificada)
      const updatePayload: AllergyUpdate = { reaction_type: data.reaction_type, severity: data.severity };
      await editAllergy(editingAllergy.uuid, updatePayload);
      setFeedback({ type: 'success', message: '¡Alergia actualizada con éxito!' });
    } else {
      // Lógica de creación con búsqueda inteligente
      try {
        await addAllergyFromCode({
          code: data.allergen.code,
          name: data.allergen.name,
          source: 'snomed',
          reaction_type: data.reaction_type,
          severity: data.severity,
        });
        setFeedback({ type: 'success', message: '¡Alergia añadida con éxito!' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo añadir la alergia.' });
      }
    }
    handleCancel();
  };

  const onDeleteAllergy = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta alergia?')) {
      try {
        await removeAllergy(uuid);
        setFeedback({ type: 'success', message: 'Alergia eliminada.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar la alergia.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Mis Alergias</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNewClick}>Añadir Alergia</Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>Añadir Nueva Alergia</Typography>
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
                      label="Buscar Alérgeno (ej. Penicilina)"
                      margin="normal"
                      required
                      error={!!errors.allergen}
                      helperText={errors.allergen?.message || 'Empieza a escribir para buscar en la base de datos médica.'}
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
            <Controller name="reaction_type" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Tipo de Reacción (Opcional)" fullWidth margin="normal" />)} />
            <Controller name="severity" control={control} render={({ field }) => (<TextField {...field} value={field.value || ''} label="Severidad (Opcional)" fullWidth margin="normal" />)} />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>{isSubmitting ? 'Guardando...' : 'Añadir Alergia'}</Button>
            <Button variant="outlined" onClick={handleCancel} sx={{ mt: 2, ml: 2 }}>Cancelar</Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Alergias Registradas</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && <Typography sx={{ mt: 2 }}>No tienes alergias registradas.</Typography>}
      <List>
        {allergies.map((allergy) => (
          <ListItem key={allergy.uuid} secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(allergy)} disabled><EditIcon /></IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAllergy(allergy.uuid)}><DeleteIcon /></IconButton>
              </Box>}
          >
            <ListItemText primary={allergy.allergen} secondary={`Reacción: ${allergy.reaction_type || 'N/A'} - Severidad: ${allergy.severity || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
