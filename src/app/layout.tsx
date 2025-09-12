import * as React from 'react';
import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import ThemeRegistry from '@/components/theme/ThemeRegistry';
import { SnackbarProvider } from '@/contexts/SnackbarContext';

import "./globals.css";

/**
 * @constant metadata
 * @description Defines the application's metadata for SEO and browser integration.
 * This includes the page title, a brief description, and the favicon path.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: 'EmergQR | Your Medical Profile',
  description: 'Manage your critical and emergency medical information securely and accessibly.',
  icons: {
    icon: '/assets/images/short/logo_bluegreenR.png', // Path to the application's favicon
  },
};

/**
 * RootLayout component for the entire application.
 *
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} The root layout structure of the application.
 *
 * @description This is the root layout, a pure Server Component.
 * Its primary responsibility is to set up the HTML shell, including language attributes.
 * It wraps the application content with essential providers:
 * - `AppRouterCacheProvider`: Optimizes the Next.js App Router caching for Material-UI.
 * - `SnackbarProvider`: Provides a global context for displaying snackbar notifications.
 * - `ThemeRegistry`: A client-side component that manages the application's theme and provides it to all child components.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Sets the language of the document. This could be made dynamic for full i18n of the HTML shell.
    <html lang="es">
      <body>
        {/* AppRouterCacheProvider is part of the Material-UI Next.js integration to improve performance. */}
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SnackbarProvider>
            {/* ThemeRegistry handles the theme providing logic, including dynamic theme switching. */}
            <ThemeRegistry>
              {children}
            </ThemeRegistry>
          </SnackbarProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
