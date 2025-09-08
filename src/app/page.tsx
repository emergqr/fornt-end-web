'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '60vh', // Make it take a good portion of the viewport height
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {t('homePage.title')}
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('homePage.subtitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('homePage.description')}
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Link href="/auth/registro" passHref>
            <Button variant="contained" color="primary" size="large" sx={{ mr: 2 }}>
              {t('homePage.ctaRegister')}
            </Button>
          </Link>
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
