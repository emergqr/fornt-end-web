'use client';

import * as React from 'react';
import { ThemeProvider, createTheme, PaletteOptions, PaletteMode } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { useThemeStore } from '@/store/theme/theme.store';
import { colors } from '@/constants/color';
import { ThemeColors } from '@/interfaces/ThemeColors.interface';

/**
 * @file This file defines the ThemeRegistry component, which is responsible for
 * providing the Material-UI theme to the entire application. It dynamically
 * creates the theme based on the user-selected mode.
 */

declare module '@mui/material/styles' {
  interface Palette extends ThemeColors {}
  interface PaletteOptions extends Partial<ThemeColors> {}
}

/**
 * Manages and provides the Material-UI theme for the application.
 */
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();

  const theme = React.useMemo(() => {
    const currentColors = colors[mode];
    const muiMode: PaletteMode = (mode === 'dark' || mode === 'winter') ? 'dark' : 'light';

    const palette: PaletteOptions = {
      mode: muiMode,
      primary: { main: currentColors.primary, contrastText: currentColors.primaryText },
      secondary: { main: currentColors.secondary },
      success: { main: currentColors.success },
      error: { main: currentColors.alert },
      background: { default: currentColors.background, paper: currentColors.card },
      text: { primary: currentColors.text, secondary: currentColors.secondaryText, disabled: currentColors.disabled },
      divider: currentColors.border,
      surface: currentColors.surface,
      alertSoft: currentColors.alertSoft,
      inputBackground: currentColors.inputBackground,
      placeholder: currentColors.placeholder,
      neutral: currentColors.neutral,
      tabIconDefault: currentColors.tabIconDefault,
      tabIconSelected: currentColors.tabIconSelected,
      onSurfaceVariant: currentColors.onSurfaceVariant,
    };

    return createTheme({
      palette,
      // Add the shape customization to apply a global border-radius
      shape: {
        borderRadius: 12, // A modern, rounded value
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
