'use client';

/**
 * @file This file defines the AdminProtectedRoute component, which acts as a client-side guard
 * for routes that should only be accessible to users with administrative privileges.
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/auth.store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';

/**
 * A client-side component that ensures a user is an authenticated administrator before rendering its children.
 * - It first checks for a valid, authenticated session using the logic from ProtectedRoute.
 * - If authenticated, it then checks for the `is_admin` flag on the user object.
 * - If the user is not an admin, it displays an 'Access Denied' message.
 * - If the session is still being checked, it displays a loading spinner.
 * 
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered if the user is an authenticated admin.
 * @returns {React.ReactElement | null} The admin content, a loading spinner, an error message, or null.
 */
export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isChecking, user } = useAuthStore();

  useEffect(() => {
    // Redirect to login if the session check is complete and the user is not authenticated.
    if (!isChecking && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isChecking, router]);

  // While the initial authentication status is being determined, show a full-page loader.
  if (isChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If the user is authenticated and is an administrator, render the protected content.
  if (isAuthenticated && user?.is_admin) {
    return <>{children}</>;
  }

  // If the user is authenticated but is NOT an administrator, show an access denied message.
  // This prevents non-admin users from seeing admin-only content.
  if (isAuthenticated && !user?.is_admin) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Alert severity="error">
          Access Denied. You do not have the necessary permissions to view this page.
        </Alert>
      </Container>
    );
  }

  // If not authenticated, render nothing while the redirect to the login page occurs.
  return null;
}
