'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/auth.store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * @file This file defines the ProtectedRoute component, which acts as a client-side guard 
 * for routes that require user authentication.
 */

/**
 * A client-side component that ensures a user is authenticated before rendering its children.
 * - While checking the authentication status, it displays a full-page loading spinner.
 * - If the user is not authenticated, it redirects them to the '/auth/login' page.
 * - If the user is authenticated, it renders the child components.
 * 
 * This approach prevents content flashing and ensures a smooth user experience.
 * 
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered if the user is authenticated.
 * @returns {React.ReactElement | null} The child components, a loading spinner, or null during redirection.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Next.js hook for programmatic navigation.
  const router = useRouter();
  
  // Zustand store hook to get authentication state.
  // `isChecking` is true while the store is validating the initial token.
  // `isAuthenticated` is true if the user has a valid session.
  const { isAuthenticated, isChecking } = useAuthStore();

  useEffect(() => {
    // This effect triggers whenever the authentication status changes.
    // If the initial check is complete and the user is not authenticated, redirect to login.
    if (!isChecking && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isChecking, router]);

  // While the authentication state is being determined, render a loading indicator.
  // This prevents a flash of the login page or protected content.
  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If the check is complete and the user is authenticated, render the protected content.
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If the check is complete and the user is not authenticated, render nothing.
  // The `useEffect` hook has already initiated the redirection, so this prevents
  // any content from flashing before the redirect is complete.
  return null;
}
