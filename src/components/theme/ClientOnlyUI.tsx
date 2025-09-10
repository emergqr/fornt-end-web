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
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ParkIcon from '@mui/icons-material/Park';
import AcUnitIcon from '@mui/icons-material/AcUnit';

import { useThemeStore, ThemeMode } from '@/store/theme/theme.store';
import { useAuthStore } from '@/store/auth/auth.store';

/**
 * Defines the width of the dashboard navigation drawer.
 */
const drawerWidth = 240;

/**
 * Renders the permanent navigation drawer for the dashboard layout.
 * It displays a list of navigation items with icons and text.
 * @returns {React.ReactElement} The rendered dashboard navigation component.
 */
function DashboardNav() {
  // Hook to get the current URL path, used to highlight the active navigation item.
  const pathname = usePathname();
  // Hook to access the translation function.
  const { t } = useTranslation();

  // Array of navigation items to be displayed in the drawer.
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
  ];

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
          {navItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <Link href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemButton selected={pathname === item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {/* The text is translated using the item's key. */}
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

/**
 * This component renders the main UI shell, including the AppBar and Drawer.
 * It's loaded only on the client-side to prevent SSR issues with UI libraries.
 * It handles the display of different UI elements based on the authentication state.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The main content to be rendered within the layout.
 * @returns {React.ReactElement} The main UI layout.
 */
export default function ClientOnlyUI({ children }: { children: React.ReactNode }) {
  // Hooks for navigation, state management, and internationalization.
  const router = useRouter();
  const { mode, setTheme } = useThemeStore();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  // State for managing the anchor elements of the language and theme menus.
  const [langMenuAnchor, setLangMenuAnchor] = React.useState<null | HTMLElement>(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = React.useState<null | HTMLElement>(null);

  /**
   * Opens the language selection menu.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event that triggered the handler.
   */
  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => setLangMenuAnchor(event.currentTarget);

  /**
   * Closes the language menu and changes the language if a new one is selected.
   * @param {string} [langCode] - The code of the selected language (e.g., 'en', 'es').
   */
  const handleLanguageClose = (langCode?: string) => {
    setLangMenuAnchor(null);
    if (langCode && i18n.language !== langCode) {
      i18n.changeLanguage(langCode);
    }
  };

  /**
   * Opens the theme selection menu.
   * @param {React.MouseEvent<HTMLElement>} event - The mouse event that triggered the handler.
   */
  const handleThemeMenu = (event: React.MouseEvent<HTMLElement>) => setThemeMenuAnchor(event.currentTarget);

  /**
   * Closes the theme menu and applies the new theme if one is selected.
   * @param {ThemeMode} [themeMode] - The name of the selected theme.
   */
  const handleThemeClose = (themeMode?: ThemeMode) => {
    setThemeMenuAnchor(null);
    if (themeMode) {
      setTheme(themeMode);
    }
  };

  /**
   * Handles the user logout process.
   */
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Finds the current language object from the constants to display its flag.
  const currentLanguage = a_languages.find(lang => lang.code === i18n.language) || a_languages[0];

  // Defines the available themes with their labels and icons.
  const themes: { name: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { name: 'light', label: t('themes.light'), icon: <Brightness7Icon fontSize="small" /> },
    { name: 'dark', label: t('themes.dark'), icon: <Brightness4Icon fontSize="small" /> },
    { name: 'spring', label: t('themes.spring'), icon: <LocalFloristIcon fontSize="small" /> },
    { name: 'summer', label: t('themes.summer'), icon: <WbSunnyIcon fontSize="small" /> },
    { name: 'autumn', label: t('themes.autumn'), icon: <ParkIcon fontSize="small" /> },
    { name: 'winter', label: t('themes.winter'), icon: <AcUnitIcon fontSize="small" /> },
  ];

  // Renders the buttons for public (unauthenticated) users.
  const publicButtons = (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <Link href="/quienes-somos" passHref><Button color="inherit">{t('navigation.aboutUs')}</Button></Link>
        <Link href="/servicios" passHref><Button color="inherit">{t('navigation.services')}</Button></Link>
      </Box>
      <Link href="/auth/login" passHref><Button color="inherit" variant="outlined" sx={{ ml: 1 }}>{t('login.title')}</Button></Link>
    </>
  );

  // Renders the buttons and user info for authenticated users.
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
          {/* Logo */}
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
          
          {/* Conditional rendering of buttons based on auth state */}
          <>{isAuthenticated ? authenticatedButtons : publicButtons}</>

          {/* Language Selector */}
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

          {/* Theme Selector */}
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
        {/* The dashboard navigation is only shown to authenticated users. */}
        {isAuthenticated && <DashboardNav />}

        {/* Main content area */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
