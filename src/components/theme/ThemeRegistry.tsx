'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider, createTheme, PaletteOptions } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CircularProgress from '@mui/material/CircularProgress';

import { useThemeStore } from '@/store/theme/theme.store';
import { colors } from '@/constants/color';
import { ThemeColors } from '@/interfaces/ThemeColors.interface';

declare module '@mui/material/styles' {
  interface Palette extends ThemeColors {}
  interface PaletteOptions extends Partial<ThemeColors> {}
}

// Dynamically import the UI component that depends on client-side state.
// This prevents it from being rendered on the server, thus avoiding hydration mismatches.
const ClientOnlyUI = dynamic(() => import('@/components/theme/ClientOnlyUI'), {
  ssr: false,
  // Optional: Render a loading skeleton on the server and initial client render.
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

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeStore();

  // The theme is created based on the mode from the store.
  // It will be applied on the client-side correctly.
  const theme = React.useMemo(() => {
    const currentColors = colors[mode];
    const { primary, primaryText, secondary, success, alert, background, card, text, secondaryText, disabled, border, ...customColors } = currentColors;

    const palette: PaletteOptions = {
      mode,
      primary: { main: primary, contrastText: primaryText },
      secondary: { main: secondary },
      success: { main: success },
      error: { main: alert },
      background: { default: background, paper: card },
      text: { primary: text, secondary: secondaryText, disabled: disabled },
      divider: border,
      ...customColors,
    };

    return createTheme({ palette });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ClientOnlyUI>{children}</ClientOnlyUI>
    </ThemeProvider>
  );
}
