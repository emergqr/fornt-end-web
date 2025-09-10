'use client';

/**
 * @file This file implements the main page for the User Administration Panel.
 * It is a protected route, accessible only to users with administrative privileges.
 * It displays a list of all users in the system and provides controls for management.
 * NOTE: This component currently uses a mock service and store.
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute';
import { useAdminStore } from '@/store/admin/admin.store';

function AdminDashboard() {
  const { t } = useTranslation();
  const { users, loading, error, fetchAllUsers } = useAdminStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Fetch users when the component mounts.
  React.useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard_admin.title')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField 
          fullWidth 
          label={t('dashboard_admin.searchPlaceholder')} 
          variant="outlined" 
        />
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper variant="outlined">
          <TableContainer>
            <Table>
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t('dashboard_admin.noUsers')}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.uuid}>
                      <TableCell>{user.name}</TableCell>
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
                          label={user.is_admin ? t('dashboard_admin.roleAdmin') : t('dashboard_admin.roleUser')} 
                          color={user.is_admin ? 'primary' : 'secondary'} 
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {/* Action buttons will be implemented here once the API is ready */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </Paper>
  );
}

// Wrap the entire page with the AdminProtectedRoute to secure it.
export default function AdminPage() {
  return (
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  );
}
