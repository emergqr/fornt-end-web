'use client';

/**
 * @file Implements the User Administration Panel for admin users.
 * It allows admins to view, search, and manage all users in the system.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '@/store/admin/admin.store';
import { useDebounce } from '@/hooks/useDebounce';
import { useSnackbar } from '@/hooks/useSnackbar';

import {
  Box,
  Typography,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminPage() {
  const { t } = useTranslation();
  const { users, loading, error, fetchUsers, deleteUser } = useAdminStore();
  const { showSnackbar } = useSnackbar();

  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (uuid: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the user ${name}? This action cannot be undone.`)) {
      try {
        await deleteUser(uuid);
        showSnackbar('User deleted successfully', 'success');
      } catch (err: any) {
        showSnackbar(err.message || 'Failed to delete user', 'error');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ p: 3, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard_admin.title')}
      </Typography>

      <TextField
        fullWidth
        label={t('dashboard_admin.searchPlaceholder')}
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t('dashboard_admin.table.name')}</TableCell>
                <TableCell>{t('dashboard_admin.table.email')}</TableCell>
                <TableCell>{t('dashboard_admin.table.status')}</TableCell>
                <TableCell>{t('dashboard_admin.table.role')}</TableCell>
                <TableCell align="right">{t('dashboard_admin.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.uuid} hover>
                    <TableCell>{user.name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_active ? t('dashboard_admin.statusActive') : t('dashboard_admin.statusInactive')}
                        color={user.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={user.is_admin ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                        label={user.is_admin ? t('dashboard_admin.roleAdmin') : t('dashboard_admin.roleUser')}
                        variant="outlined"
                        color={user.is_admin ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete User">
                        <IconButton onClick={() => handleDelete(user.uuid, user.name || user.email)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('dashboard_admin.noUsers')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
