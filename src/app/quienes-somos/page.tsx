'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';

export default function QuienesSomosPage() {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('aboutUsPage.title')}
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('aboutUsPage.missionTitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('aboutUsPage.missionText')}
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph sx={{ mt: 4 }}>
          {t('aboutUsPage.visionTitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('aboutUsPage.visionText')}
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph sx={{ mt: 4 }}>
          {t('aboutUsPage.valuesTitle')}
        </Typography>
        {/* For text with markdown-like bolding, we can split and map or use a library, 
            but for simplicity, we'll just render the string which might contain markdown. */}
        <Typography variant="body1" paragraph whiteSpace="pre-line">
          {t('aboutUsPage.valuesText')}
        </Typography>
      </Box>
    </Container>
  );
}
