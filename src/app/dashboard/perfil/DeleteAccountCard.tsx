'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useAuthStore } from '@/store/auth/auth.store';
import { getApiErrorMessage } from '@/services/apiErrors';

export default function DeleteAccountCard() {
  const { deleteAccount } = useAuthStore();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await deleteAccount();
      // La lógica de logout y redirección ya está en el store.
    } catch (err) {
      setError(getApiErrorMessage(err));
      setIsDeleting(false);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4, border: 1, borderColor: 'error.main' }}>
      <Typography variant="h5" component="h2" gutterBottom color="error">
        Zona de Peligro
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Esta acción es irreversible. Al eliminar tu cuenta, todos tus datos médicos, perfil y contactos serán eliminados permanentemente. No podrás recuperar tu cuenta.
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button variant="contained" color="error" onClick={handleClickOpen} disabled={isDeleting}>
        {isDeleting ? 'Eliminando...' : 'Eliminar Mi Cuenta'}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          ¿Estás absolutamente seguro?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta y todos los datos asociados. ¿Deseas continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Sí, eliminar mi cuenta
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
