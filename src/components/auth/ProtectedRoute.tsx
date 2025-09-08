'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/auth.store';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * A client-side component that checks for authentication and protects a route.
 * If the user is not authenticated, it redirects them to the login page.
 * It shows a loading spinner while checking the authentication status.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Asumimos que el store tiene un estado `isAuthenticated` y un estado `isChecking` 
  // para saber si todavía está validando el token inicial.
  const { isAuthenticated, isChecking } = useAuthStore();

  useEffect(() => {
    // Si no está comprobando y el usuario no está autenticado, redirigir.
    if (!isChecking && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isChecking, router]);

  // Mientras se comprueba el estado de autenticación, mostrar un spinner
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

  // Si está autenticado, mostrar el contenido de la página protegida
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Si no está autenticado y ya no está cargando, no renderiza nada 
  // porque el useEffect ya habrá iniciado la redirección.
  return null;
}
