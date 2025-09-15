'use client';

/**
 * @file This file implements the Vital Signs management page using a modal-based form.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store';
import { VitalSignCreate, VitalSignRead } from '@/interfaces/client/vital-sign.interface';
import VitalSignForm from './VitalSignForm'; // Import the new reusable form
import VitalSignsChart from './VitalSignsChart';

import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function VitalSignsPage() {
  const { t } = useTranslation();
  const { vitalSigns, types, loading, error, fetchMyVitalSigns, fetchVitalSignTypes, addVitalSign, removeVitalSign } = useVitalSignStore();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handleFormSubmit = async (data: VitalSignCreate) => {
    setFeedback(null);
    try {
      await addVitalSign(data);
      setFeedback({ type: 'success', message: t('dashboard_vitals.feedback.addSuccess') });
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || t('dashboard_vitals.feedback.addError') });
    }
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">{t('dashboard_vitals.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>{t('dashboard_vitals.addButton')}</Button>
      </Box>

      {feedback && <Alert severity={feedback.type} sx={{ my: 2 }}>{feedback.message}</Alert>}
      
      <VitalSignsChart data={vitalSigns} />

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && Object.keys(groupedSigns).length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>{t('dashboard_vitals.list.noVitals')}</Typography>
      )}

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

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('dashboard_vitals.form.title')}</DialogTitle>
        <DialogContent>
          <VitalSignForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
            types={types}
          />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}
