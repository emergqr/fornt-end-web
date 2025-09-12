'use client';

import * as React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter, usePathname } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

// --- i18n Imports ---
import '@/services/i18n';
import { useTranslation } from 'react-i18next';
import { a_languages } from '@/constants/languages';

// --- Icons, Stores, and Types ---
import PaletteIcon from '@mui/icons-material/Palette';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import ArticleIcon from '@mui/icons-material/Article';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import BugReportIcon from '@mui/icons-material/BugReport';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import WarningIcon from '@mui/icons-material/Warning';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ParkIcon from '@mui/icons-material/Park';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import { useThemeStore, ThemeMode } from '@/store/theme/theme.store';
import { useAuthStore } from '@/store/auth/auth.store';
import { usePanicStore } from '@/store/panic/panic.store';
import { useSnackbar } from '@/hooks/useSnackbar';
import { Client } from '@/interfaces/client/client.interface';
import { profileService } from '@/services/profileService';

const drawerWidth = 240;

function DashboardNav({ user }: { user: Client | null }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { key: 'dashboard_summary', path: '/dashboard', icon: <DashboardIcon sx={{ color: '#1976d2' }} /> },
    { key: 'dashboard_timeline', path: '/dashboard/timeline', icon: <TimelineIcon sx={{ color: '#ff9800' }} /> },
    { key: 'dashboard_qr', path: '/dashboard/qr-code', icon: <QrCode2Icon sx={{ color: '#6a1b9a' }} /> },
    { key: 'dashboard_profile', path: '/dashboard/perfil', icon: <AccountCircleIcon sx={{ color: '#00796b' }} /> },
    { key: 'dashboard_allergies', path: '/dashboard/allergies', icon: <MedicalInformationIcon sx={{ color: '#d32f2f' }} /> },
    { key: 'dashboard_diseases', path: '/dashboard/diseases', icon: <HealthAndSafetyIcon sx={{ color: '#f57c00' }} /> },
    { key: 'dashboard_vitals', path: '/dashboard/vital-signs', icon: <MonitorHeartIcon sx={{ color: '#c2185b' }} /> },
    { key: 'dashboard_medications', path: '/dashboard/medications', icon: <VaccinesIcon sx={{ color: '#512da8' }} /> },
    { key: 'dashboard_history', path: '/dashboard/medical-history', icon: <ArticleIcon sx={{ color: '#757575' }} /> },
    // --- Phase 4 Modules ---
    { key: 'dashboard_addictions', path: '/dashboard/addictions', icon: <SmokeFreeIcon sx={{ color: '#f44336' }} /> },
    { key: 'dashboard_infectious_diseases', path: '/dashboard/infectious-diseases', icon: <BugReportIcon sx={{ color: '#8BC34A' }} /> },
    { key: 'dashboard_psychiatric', path: '/dashboard/psychiatric', icon: <PsychologyIcon sx={{ color: '#9C27B0' }} /> },
    { key: 'dashboard_menstrual_cycle', path: '/dashboard/menstrual-cycle', icon: <WaterDropIcon sx={{ color: '#E91E63' }} />, gender: 'female' },
    { key: 'dashboard_pregnancy', path: '/dashboard/pregnancy', icon: <PregnantWomanIcon sx={{ color: '#F48FB1' }} />, gender: 'female' },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.gender) return true; // Always show items without a gender property
    return user?.sex?.toLowerCase() === item.gender;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', position: 'relative' },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {filteredNavItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <Link href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton selected={pathname === item.path} disabled={(item as any).disabled}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={t(`navigation.${item.key}`)} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default function ClientOnlyUI({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { mode, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const { isLoading: isPanicLoading, triggerPanic } = usePanicStore();
  const { showSnackbar } = useSnackbar();

  const [langMenuAnchor, setLangMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [isPanicDialogOpen, setPanicDialogOpen] = React.useState(false);

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => setLangMenuAnchor(event.currentTarget);
  
  const handleLanguageClose = async (langCode?: string) => {
    setLangMenuAnchor(null);
    if (langCode && i18n.language !== langCode) {
      // Optimistically change the UI language first for a responsive feel.
      i18n.changeLanguage(langCode);

      // If the user is authenticated, save the preference to the backend.
      if (isAuthenticated) {
        try {
          const updatedUser = await profileService.updateLanguagePreference(langCode);
          setUser(updatedUser); // Update the user state with the new profile data.
          showSnackbar('Language preference saved!', 'success');
        } catch (error) {
          console.error('Failed to save language preference:', error);
          showSnackbar('Could not save language preference.', 'error');
        }
      }
    }
  };

  const handleThemeMenu = (event: React.MouseEvent<HTMLElement>) => setThemeMenuAnchor(event.currentTarget);
  const handleThemeClose = (themeMode?: ThemeMode) => {
    setThemeMenuAnchor(null);
    if (themeMode) {
      setTheme(themeMode);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handlePanicConfirm = async () => {
    try {
      await triggerPanic();
      showSnackbar(t('panic_button.successMessage'), 'success');
    } catch (error: any) {
      showSnackbar(error.message || t('panic_button.errorMessage'), 'error');
    } finally {
      setPanicDialogOpen(false);
    }
  };

  const currentLanguage = a_languages.find(lang => lang.code === i18n.language) || a_languages[0];

  const themes: { name: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { name: 'light', label: t('themes.light'), icon: <Brightness7Icon fontSize="small" /> },
    { name: 'dark', label: t('themes.dark'), icon: <Brightness4Icon fontSize="small" /> },
    { name: 'spring', label: t('themes.spring'), icon: <LocalFloristIcon fontSize="small" /> },
    { name: 'summer', label: t('themes.summer'), icon: <WbSunnyIcon fontSize="small" /> },
    { name: 'autumn', label: t('themes.autumn'), icon: <ParkIcon fontSize="small" /> },
    { name: 'winter', label: t('themes.winter'), icon: <AcUnitIcon fontSize="small" /> },
  ];

  const publicButtons = (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Link href="/quienes-somos" passHref><Button color="inherit">{t('navigation.aboutUs')}</Button></Link>
        <Link href="/servicios" passHref><Button color="inherit">{t('navigation.services')}</Button></Link>
      </Box>
      <Link href="/auth/login" passHref><Button color="inherit" variant="outlined" sx={{ ml: 1 }}>{t('login.title')}</Button></Link>
    </>
  );

  const authenticatedButtons = (
    <>
      <Typography variant="subtitle1" sx={{ mr: 2 }}>
        {t('dashboard.loggedInAs', { name: user?.name || t('dashboard.defaultUser') })}
      </Typography>
      <Button color="inherit" variant="outlined" onClick={handleLogout}>{t('dashboard.logout')}</Button>
    </>
  );

  return (
    <Box>
      <AppBar position="sticky" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link href={isAuthenticated ? "/dashboard" : "/"} passHref>
              <Image
                src={mode === 'dark' || mode === 'winter' ? '/assets/images/short/logo_bluegreenT.png' : '/assets/images/short/logo_white.png'}
                alt={t('navigation.logoAlt')}
                width={120}
                height={40}
                priority
              />
            </Link>
          </Box>
          
          <>{isAuthenticated ? authenticatedButtons : publicButtons}</>

          <IconButton onClick={handleLanguageMenu} color="inherit" sx={{ p: 0, mx: 1.5 }}>
            <Image src={currentLanguage.flag} alt={t(`languages.${currentLanguage.code}`)} width={24} height={24} />
          </IconButton>
          <Menu anchorEl={langMenuAnchor} open={Boolean(langMenuAnchor)} onClose={() => handleLanguageClose()}>
            {a_languages.map((lang) => (
              <MenuItem key={lang.code} onClick={() => handleLanguageClose(lang.code)}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Image src={lang.flag} alt={t(`languages.${lang.code}`)} width={20} height={20} style={{ marginRight: '8px' }} />
                  {t(`languages.${lang.code}`)}
                </Box>
              </MenuItem>
            ))}
          </Menu>

          <IconButton onClick={handleThemeMenu} sx={{ color: '#FFD700' }}>
            <PaletteIcon />
          </IconButton>
          <Menu anchorEl={themeMenuAnchor} open={Boolean(themeMenuAnchor)} onClose={() => handleThemeClose()}>
            {themes.map((themeItem) => (
              <MenuItem key={themeItem.name} onClick={() => handleThemeClose(themeItem.name)} selected={mode === themeItem.name}>
                <ListItemIcon>{themeItem.icon}</ListItemIcon>
                <ListItemText>{themeItem.label}</ListItemText>
              </MenuItem>
            ))}
          </Menu>

        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: 'flex' }}>
        {isAuthenticated && <DashboardNav user={user} />}

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>

      {/* Panic Button - only visible when authenticated */}
      {isAuthenticated && (
        <Tooltip title={t('panic_button.tooltip')}>
            <Fab 
                color="error" 
                sx={{ position: 'fixed', bottom: 24, right: 24 }} 
                onClick={() => setPanicDialogOpen(true)}
                disabled={isPanicLoading}
            >
                {isPanicLoading ? <CircularProgress size={24} color="inherit" /> : <WarningIcon />}
            </Fab>
        </Tooltip>
      )}

      {/* Panic Button Confirmation Dialog */}
      <Dialog
        open={isPanicDialogOpen}
        onClose={() => setPanicDialogOpen(false)}
      >
        <DialogTitle>{t('panic_button.dialogTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('panic_button.dialogContent')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPanicDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handlePanicConfirm} color="error" autoFocus disabled={isPanicLoading}>
            {isPanicLoading ? t('panic_button.activatingButton') : t('panic_button.confirmButton')}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
