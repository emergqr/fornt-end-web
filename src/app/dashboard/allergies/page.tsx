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

import { useAllergyStore } from '@/store/allergy/allergy.store';
import { AllergyCreate, AllergyRead, AllergyUpdate } from '@/interfaces/client/allergy.interface';

const allergySchema = z.object({
  allergen: z.string().min(2, { message: 'El nombre del alérgeno es requerido' }),
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
    addAllergy,
    removeAllergy,
    editAllergy,
  } = useAllergyStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [editingAllergy, setEditingAllergy] = React.useState<AllergyRead | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AllergyFormInputs>({
    resolver: zodResolver(allergySchema),
    defaultValues: {
      allergen: '',
      reaction_type: '',
      severity: '',
    },
  });

  React.useEffect(() => {
    fetchMyAllergies();
  }, [fetchMyAllergies]);

  const handleAddNewClick = () => {
    setEditingAllergy(null);
    reset({ allergen: '', reaction_type: '', severity: '' });
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleEditClick = (allergy: AllergyRead) => {
    setEditingAllergy(allergy);
    reset(allergy);
    setIsFormVisible(true);
    setFeedback(null);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingAllergy(null);
    reset();
    setFeedback(null);
  };

  const onSubmit: SubmitHandler<AllergyFormInputs> = async (data) => {
    setFeedback(null);
    try {
      if (editingAllergy) {
        await editAllergy(editingAllergy.uuid, data as AllergyUpdate);
        setFeedback({ type: 'success', message: '¡Alergia actualizada con éxito!' });
      } else {
        await addAllergy(data as AllergyCreate);
        setFeedback({ type: 'success', message: '¡Alergia añadida con éxito!' });
      }
      handleCancel();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || (editingAllergy ? 'No se pudo actualizar la alergia.' : 'No se pudo añadir la alergia.') });
    }
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
        <Typography variant="h4" component="h1">
          Mis Alergias
        </Typography>
        <Button
          variant="contained"
          startIcon={isFormVisible ? undefined : <AddIcon />}
          onClick={isFormVisible ? handleCancel : handleAddNewClick}
          color={isFormVisible ? 'secondary' : 'primary'}
        >
          {isFormVisible ? 'Cancelar' : 'Añadir Alergia'}
        </Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h6" gutterBottom>{editingAllergy ? 'Editar Alergia' : 'Añadir Nueva Alergia'}</Typography>
            <Controller
              name="allergen"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre del Alérgeno" fullWidth margin="normal" required error={!!errors.allergen} helperText={errors.allergen?.message} />
              )}
            />
            <Controller
              name="reaction_type"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Tipo de Reacción (Opcional)" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Severidad (Opcional)" fullWidth margin="normal" />
              )}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
              {isSubmitting ? 'Guardando...' : (editingAllergy ? 'Guardar Cambios' : 'Guardar Alergia')}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Alergias Registradas</Typography>
      {loading && !isSubmitting && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && allergies.length === 0 && (
        <Typography sx={{ mt: 2 }}>No tienes alergias registradas.</Typography>
      )}
      <List>
        {allergies.map((allergy) => (
          <ListItem
            key={allergy.uuid}
            secondaryAction={
              <Box>
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(allergy)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteAllergy(allergy.uuid)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={allergy.allergen}
              secondary={`Reacción: ${allergy.reaction_type || 'N/A'} - Severidad: ${allergy.severity || 'N/A'}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
