'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, createTheme, PaletteOptions, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';

import { useThemeStore } from '@/store/theme/theme.store';
import { colors } from '@/constants/color';
import { ThemeColors } from '@/interfaces/ThemeColors.interface';

/**
 * @file This file defines the ThemeRegistry component, which is responsible for
 * providing the Material-UI theme to the entire application. It dynamically
 * creates the theme based on the user-selected mode and ensures that the main
 * UI is rendered only on the client-side.
 */

// Extend the Material-UI Palette interfaces to include custom theme colors.
// This provides TypeScript autocompletion and type-checking for custom colors.
declare module '@mui/material/styles' {
  interface Palette extends ThemeColors {}
  interface PaletteOptions extends Partial<ThemeColors> {}
}

// Dynamically import the main UI shell (ClientOnlyUI) to disable Server-Side Rendering (SSR).
// This is crucial for preventing hydration mismatches when using client-side state for theming.
const ClientOnlyUI = dynamic(() => import('@/components/theme/ClientOnlyUI'), {
  ssr: false,
  // Display a loading spinner while the UI component is being loaded.
  loading: () => (
    <Box>
      <AppBar position="sticky" color="primary">
        <Toolbar />
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    </Box>
  ),
});

/**
 * Manages and provides the Material-UI theme for the application.
 * It listens to theme mode changes from the global store and updates the theme accordingly.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the theme provider.
 * @returns {React.ReactElement} The ThemeProvider wrapping the application.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Retrieve the current theme mode (e.g., 'light', 'dark') from the Zustand store.
  const { mode } = useThemeStore();

  // Memoize the theme creation to avoid recalculating on every render.
  // The theme is only recreated when the `mode` changes.
  const theme = React.useMemo(() => {
    const currentColors = colors[mode];
    
    // Determine the base MUI mode ('light' or 'dark') from our custom theme modes.
    const muiMode: PaletteMode = (mode === 'dark' || mode === 'winter') ? 'dark' : 'light';

    // Construct the explicit palette object for Material-UI.
    const palette: PaletteOptions = {
      mode: muiMode,
      primary: { main: currentColors.primary, contrastText: currentColors.primaryText },
      secondary: { main: currentColors.secondary },
      success: { main: currentColors.success },
      error: { main: currentColors.alert },
      background: { default: currentColors.background, paper: currentColors.card },
      text: { primary: currentColors.text, secondary: currentColors.secondaryText, disabled: currentColors.disabled },
      divider: currentColors.border,
      // Pass the rest of the custom colors to the theme.
      surface: currentColors.surface,
      alertSoft: currentColors.alertSoft,
      inputBackground: currentColors.inputBackground,
      placeholder: currentColors.placeholder,
      neutral: currentColors.neutral,
      tabIconDefault: currentColors.tabIconDefault,
      tabIconSelected: currentColors.tabIconSelected,
      onSurfaceVariant: currentColors.onSurfaceVariant,
    };

    return createTheme({ palette });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {/* The main UI is wrapped here, ensuring it's only rendered on the client. */}
      <ClientOnlyUI>{children}</ClientOnlyUI>
    </ThemeProvider>
  );
}
