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

declare module '@mui/material/styles' {
  interface Palette extends ThemeColors {}
  interface PaletteOptions extends Partial<ThemeColors> {}
}

const ClientOnlyUI = dynamic(() => import('@/components/theme/ClientOnlyUI'), {
  ssr: false,
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

  const theme = React.useMemo(() => {
    const currentColors = colors[mode];
    
    // Determinar el modo base que MUI entiende ('light' o 'dark')
    const muiMode: PaletteMode = (mode === 'dark' || mode === 'winter') ? 'dark' : 'light';

    // CORRECCIÓN: Construir la paleta explícitamente para evitar conflictos
    const palette: PaletteOptions = {
      mode: muiMode,
      primary: { main: currentColors.primary, contrastText: currentColors.primaryText },
      secondary: { main: currentColors.secondary },
      success: { main: currentColors.success },
      error: { main: currentColors.alert },
      background: { default: currentColors.background, paper: currentColors.card },
      text: { primary: currentColors.text, secondary: currentColors.secondaryText, disabled: currentColors.disabled },
      divider: currentColors.border,
      // Pasar el resto de colores personalizados
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
      <CssBaseline />
      <ClientOnlyUI>{children}</ClientOnlyUI>
    </ThemeProvider>
  );
}
