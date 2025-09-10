'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

/**
 * HomePage Component
 *
 * @component
 * @returns {React.ReactElement} The main landing page of the application.
 *
 * @description This component serves as the public-facing homepage for unauthenticated users.
 * It uses Material-UI components for layout and styling and `react-i18next` for internationalization.
 * The page presents a clear value proposition with a title, subtitle, and description, along with
 * prominent call-to-action buttons for registration and login.
 */
export default function HomePage() {
  // Hook to get the translation function `t` from the i18next instance.
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4, // Vertical margin (top and bottom)
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh', // Ensures the content takes up a significant portion of the viewport height.
        }}
      >
        {/* Main heading of the page */}
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('homePage.title')}
        </Typography>

        {/* Subtitle to provide more context */}
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('homePage.subtitle')}
        </Typography>

        {/* Descriptive text explaining the application's purpose */}
        <Typography variant="body1" paragraph>
          {t('homePage.description')}
        </Typography>

        {/* Container for the primary call-to-action buttons */}
        <Box sx={{ mt: 4 }}>
          {/* Registration Button - styled as the primary action */}
          <Link href="/auth/registro" passHref>
            <Button variant="contained" color="primary" size="large" sx={{ mr: 2 }}>
              {t('homePage.ctaRegister')}
            </Button>
          </Link>

          {/* Login Button - styled as the secondary action */}
          <Link href="/auth/login" passHref>
            <Button variant="outlined" color="primary" size="large">
              {t('homePage.ctaLogin')}
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
