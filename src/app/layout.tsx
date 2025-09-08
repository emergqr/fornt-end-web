import * as React from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ThemeRegistry from '@/components/theme/ThemeRegistry';

import "./globals.css";

// --- METADATA ---
// This is how we set the application title and favicon.
export const metadata: Metadata = {
  title: 'EmergQR | Tu Perfil Médico',
  description: 'Gestiona tu información médica crítica y de emergencia de forma segura y accesible.',
  icons: {
    icon: '/assets/images/short/logo_bluegreenR.png', // Path to your favicon
  },
};

/**
 * This is the root layout, a pure Server Component.
 * Its only responsibility is to set up the HTML shell and render the ThemeRegistry,
 * which is a Client Component that handles all theme-related logic.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeRegistry>
            {children}
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
