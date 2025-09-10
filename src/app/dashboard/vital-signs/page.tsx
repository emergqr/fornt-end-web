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

// Import stores, services, and interfaces
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store';
import { VitalSignCreate, VitalSignRead } from '@/interfaces/client/vital-sign.interface';
import VitalSignsChart from './VitalSignsChart';

/**
 * Zod schema for vital sign form validation.
 * Ensures that the 'type' field is selected.
 * @param t - The translation function from react-i18next.
 * @returns The Zod schema for the vital sign form.
 */
const getVitalSignSchema = (t: (key: string) => string) => z.object({
  type: z.string().min(1, { message: t('validation.vitalTypeRequired') }),
  value_numeric: z.coerce.number().optional(),
  value_secondary: z.coerce.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

// Type definition for the form inputs, inferred from the Zod schema.
type VitalSignFormInputs = z.infer<ReturnType<typeof getVitalSignSchema>>;

/**
 * Renders the vital signs management page.
 * This component allows users to add, view, and delete their vital sign records.
 * It also displays a chart visualizing the vital signs over time.
 */
export default function VitalSignsPage() {
  const { t } = useTranslation();
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

  // State for user feedback messages (e.g., success, error).
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  // State to manage the visibility of the add/edit form.
  const [isFormVisible, setIsFormVisible] = React.useState(false);

  // Initialize the form validation schema with the translation function.
  const vitalSignSchema = getVitalSignSchema(t);

  // React Hook Form setup for form state management and validation.
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

  // Fetch user's vital signs and available types when the component mounts.
  React.useEffect(() => {
    fetchMyVitalSigns();
    fetchVitalSignTypes();
  }, [fetchMyVitalSigns, fetchVitalSignTypes]);

  // Memoized computation to group vital signs by type for display.
  const groupedSigns = React.useMemo(() => {
    return vitalSigns.reduce((acc, sign) => {
      (acc[sign.type] = acc[sign.type] || []).push(sign);
      return acc;
    }, {} as Record<string, VitalSignRead[]>);
  }, [vitalSigns]);

  // Form submission handler for adding a new vital sign.
  const onAddVitalSign: SubmitHandler<VitalSignFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await addVitalSign(data as VitalSignCreate);
      setFeedback({ type: 'success', message: t('dashboard_vitals.feedback.addSuccess') });
      reset();
      setIsFormVisible(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_vitals.feedback.addError') });
    }
  };

  // Handler to delete a vital sign record with a confirmation dialog.
  const onDeleteVitalSign = async (uuid: string) => {
    if (window.confirm(t('dashboard_vitals.feedback.deleteConfirm'))) {
      try {
        await removeVitalSign(uuid);
        setFeedback({ type: 'success', message: t('dashboard_vitals.feedback.deleteSuccess') });
      } catch (err: any) {
        setFeedback({ type: 'error', message: err.message || t('dashboard_vitals.feedback.deleteError') });
      }
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Page Header with a toggle button for the form */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_vitals.title')}</Typography>
        <Button variant="contained" startIcon={isFormVisible ? undefined : <AddIcon />} onClick={() => setIsFormVisible(!isFormVisible)} color={isFormVisible ? 'secondary' : 'primary'}>
          {isFormVisible ? t('common.cancel') : t('dashboard_vitals.addButton')}
        </Button>
      </Box>

      {/* Add New Vital Sign Form (Collapsible) */}
      <Collapse in={isFormVisible}>
        <Paper variant="outlined" sx={{ p: 2, mb: 4, mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit(onAddVitalSign)} noValidate>
            <Typography variant="h6" gutterBottom>{t('dashboard_vitals.form.title')}</Typography>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" required error={!!errors.type}>
                  <InputLabel id="type-label">{t('dashboard_vitals.form.typeLabel')}</InputLabel>
                  <Select {...field} labelId="type-label" label={t('dashboard_vitals.form.typeLabel')}>
                    {types.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="value_numeric"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.primaryValueLabel')} type="number" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="value_secondary"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.secondaryValueLabel')} type="number" fullWidth margin="normal" />
              )}
            />
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.unitLabel')} fullWidth margin="normal" />
              )}
            />
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <TextField {...field} value={field.value || ''} label={t('dashboard_vitals.form.notesLabel')} fullWidth margin="normal" multiline rows={2} />
              )}
            />
            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
              {isSubmitting ? t('dashboard_vitals.form.submittingButton') : t('dashboard_vitals.form.submitButton')}
            </Button>
          </Box>
        </Paper>
      </Collapse>

      {/* User Feedback Alert */}
      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}
      
      {/* Chart for visualizing vital signs */}
      <VitalSignsChart data={vitalSigns} />

      {/* Loading and Error States for the list */}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && Object.keys(groupedSigns).length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>{t('dashboard_vitals.list.noVitals')}</Typography>
      )}

      {/* Display vital signs grouped by type in tables */}
      {Object.entries(groupedSigns).map(([type, signs]) => (
        <Box key={type} sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>{type}</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('dashboard_vitals.list.tableDate')}</TableCell>
                  <TableCell>{t('dashboard_vitals.list.tableValue')}</TableCell>
                  <TableCell>{t('dashboard_vitals.list.tableNotes')}</TableCell>
                  <TableCell align="right">{t('dashboard_vitals.list.tableActions')}</TableCell>
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
