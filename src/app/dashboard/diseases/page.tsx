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
import Autocomplete from '@mui/material/Autocomplete';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';

import { useDiseaseStore } from '@/store/disease/disease.store';
import { PatientDiseaseCreate, PatientDiseaseRead, PatientDiseaseUpdate, DiseaseRead } from '@/interfaces/client/disease.interface';

// Schema for the form's data structure
const diseaseFormSchema = z.object({
  disease: z.custom<DiseaseRead>(v => v !== null && typeof v === 'object' && 'uuid' in v, {
    message: 'Debe seleccionar una enfermedad de la lista.',
  }),
  diagnosis_date: z.string().min(1, { message: 'La fecha de diagnóstico es requerida.' }),
  severity: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

type DiseaseFormInputs = z.infer<typeof diseaseFormSchema>;

export default function DiseasesPage() {
  const {
    diseases,
    loading,
    error,
    masterList,
    masterListLoading,
    fetchMyDiseases,
    addDisease,
    editDisease,
    removeDisease,
    fetchMasterList,
  } = useDiseaseStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingDisease, setEditingDisease] = React.useState<PatientDiseaseRead | null>(null);

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
    fetchMasterList();
  }, [fetchMyDiseases, fetchMasterList]);

  const handleAddNewClick = () => {
    setEditingDisease(null);
    reset({ disease: null, diagnosis_date: '', severity: '', notes: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (disease: PatientDiseaseRead) => {
    setEditingDisease(disease);
    reset({
      disease: disease.disease,
      diagnosis_date: disease.diagnosis_date.split('T')[0], // Format date for input
      severity: disease.severity,
      notes: disease.notes,
    });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingDisease(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<DiseaseFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingDisease) {
        const updatePayload: PatientDiseaseUpdate = { ...data };
        await editDisease(editingDisease.uuid, updatePayload);
        setFeedback({ type: 'success', message: '¡Condición actualizada con éxito!' });
      } else {
        const createPayload: PatientDiseaseCreate = {
          disease_uuid: data.disease.uuid,
          diagnosis_date: data.diagnosis_date,
          severity: data.severity,
          notes: data.notes,
        };
        await addDisease(createPayload);
        setFeedback({ type: 'success', message: '¡Condición añadida con éxito!' });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || (editingDisease ? 'No se pudo actualizar la condición.' : 'No se pudo añadir la condición.') });
    }
  };

  const onDeleteDisease = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta condición?')) {
      try {
        await removeDisease(uuid);
        setFeedback({ type: 'success', message: 'Condición eliminada.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar la condición.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Mis Condiciones Médicas
        </Typography>
        <Button
          variant="contained"
          startIcon={isFormVisible ? undefined : <AddIcon />}
          onClick={isFormVisible ? handleCancel : handleAddNewClick}
          color={isFormVisible ? 'secondary' : 'primary'}
        >
          {isFormVisible ? 'Cancelar' : 'Añadir Condición'}
        </Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingDisease ? 'Editar Condición' : 'Añadir Nueva Condición'}</Typography>
            
            <Controller
              name="disease"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={masterList}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
                  loading={masterListLoading}
                  onChange={(_, data) => field.onChange(data)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar Enfermedad"
                      margin="normal"
                      required
                      error={!!errors.disease}
                      helperText={errors.disease?.message || 'Empieza a escribir para buscar...'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {masterListLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            />

            <Controller
              name="diagnosis_date"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Fecha de Diagnóstico" type="date" InputLabelProps={{ shrink: true }} fullWidth margin="normal" required error={!!errors.diagnosis_date} helperText={errors.diagnosis_date?.message} />
              )}
            />
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label="Severidad (Opcional)" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label="Notas (Opcional)" fullWidth margin="normal" multiline rows={2} />
              )}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
              {isSubmitting ? 'Guardando...' : (editingDisease ? 'Guardar Cambios' : 'Añadir Condición')}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Condiciones Registradas</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && diseases.length === 0 && (
        <Typography sx={{ mt: 2 }}>No tienes condiciones médicas registradas.</Typography>
      )}
      <List>
        {diseases.map((patientDisease) => (
          <ListItem 
            key={patientDisease.uuid} 
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(patientDisease)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteDisease(patientDisease.uuid)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText 
              primary={patientDisease.disease.name}
              secondary={`Diagnosticado: ${new Date(patientDisease.diagnosis_date).toLocaleDateString()} - Severidad: ${patientDisease.severity || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
