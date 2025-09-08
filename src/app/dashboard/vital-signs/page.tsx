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
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import AddIcon from '@mui/icons-material/Add';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store';
import { VitalSignCreate, VitalSignRead } from '@/interfaces/client/vital-sign.interface';
import VitalSignsChart from './VitalSignsChart';

const vitalSignSchema = z.object({
  type: z.string().min(1, { message: 'El tipo es requerido' }),
  value_numeric: z.coerce.number().optional(),
  value_secondary: z.coerce.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

type VitalSignFormInputs = z.infer<typeof vitalSignSchema>;

export default function VitalSignsPage() {
  const {
    vitalSigns,
    types,
    loading,
    error,
    fetchMyVitalSigns,
    fetchVitalSignTypes,
    addVitalSign,
    removeVitalSign,
  } = useVitalSignStore();

  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VitalSignFormInputs>({
    resolver: zodResolver(vitalSignSchema),
    defaultValues: {
      type: '',
      value_numeric: '',
      value_secondary: '',
      unit: '',
      notes: '',
    },
  });

  React.useEffect(() => {
    fetchMyVitalSigns();
    fetchVitalSignTypes();
  }, [fetchMyVitalSigns, fetchVitalSignTypes]);

  const groupedSigns = React.useMemo(() => {
    return vitalSigns.reduce((acc, sign) => {
      (acc[sign.type] = acc[sign.type] || []).push(sign);
      return acc;
    }, {} as Record<string, VitalSignRead[]>);
  }, [vitalSigns]);

  const onAddVitalSign: SubmitHandler<VitalSignFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await addVitalSign(data as VitalSignCreate);
      setFeedback({ type: 'success', message: '¡Signo vital añadido con éxito!' });
      reset();
      setIsFormVisible(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'No se pudo añadir el signo vital.' });
    }
  };

  const onDeleteVitalSign = async (uuid: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await removeVitalSign(uuid);
        setFeedback({ type: 'success', message: 'Registro eliminado.' });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || 'No se pudo eliminar el registro.' });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">Mis Signos Vitales</Typography>
        <Button variant="contained" startIcon={isFormVisible ? undefined : <AddIcon />} onClick={() => setIsFormVisible(!isFormVisible)} color={isFormVisible ? 'secondary' : 'primary'}>
          {isFormVisible ? 'Cancelar' : 'Añadir Registro'}
        </Button>
      </Box>

      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onAddVitalSign)} noValidate>
            <Typography variant="h6" gutterBottom>Añadir Nuevo Registro</Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" required error={!!errors.type}>
                  <InputLabel id="type-label">Tipo de Signo Vital</InputLabel>
                  <Select {...field} labelId="type-label" label="Tipo de Signo Vital">
                    {types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="value_numeric"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label="Valor Principal" type="number" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="value_secondary"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label="Valor Secundario (ej. Diastólica)" type="number" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label="Unidad (ej. mmHg, kg, °C)" fullWidth margin="normal" />
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
              {isSubmitting ? 'Añadiendo...' : 'Guardar Registro'}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}
      
      <VitalSignsChart data={vitalSigns} />

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && Object.keys(groupedSigns).length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>No tienes signos vitales registrados.</Typography>
      )}

      {Object.entries(groupedSigns).map(([type, signs]) => (
        <Box key={type} sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>{type}</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Valor</TableCell>
                  <TableCell>Notas</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {signs.map((sign) => (
                  <TableRow key={sign.uuid}>
                    <TableCell>{new Date(sign.measured_at).toLocaleString()}</TableCell>
                    <TableCell>{`${sign.value_numeric || ''}${sign.value_secondary ? ` / ${sign.value_secondary}` : ''} ${sign.unit || ''}`}</TableCell>
                    <TableCell>{sign.notes || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={() => onDeleteVitalSign(sign.uuid)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Paper>
  );
}
