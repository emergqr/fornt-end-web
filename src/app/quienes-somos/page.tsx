'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';

/**
 * QuienesSomosPage (About Us) Component
 *
 * @component
 * @returns {React.ReactElement} The static "About Us" page.
 *
 * @description This component renders the "About Us" page, which provides information
 * about the company's mission, vision, and values. It is a client component that uses
 * Material-UI for layout and `react-i18next` to fetch and display translated content.
 */
export default function QuienesSomosPage() {
  // Hook to get the translation function `t` for internationalization.
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Main title of the page */}
        <Typography variant="h3" component="h1" gutterBottom>
          {t('aboutUsPage.title')}
        </Typography>

        {/* Mission Section */}
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('aboutUsPage.missionTitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('aboutUsPage.missionText')}
        </Typography>

        {/* Vision Section */}
        <Typography variant="h5" component="h2" color="text.secondary" paragraph sx={{ mt: 4 }}>
          {t('aboutUsPage.visionTitle')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('aboutUsPage.visionText')}
        </Typography>

        {/* Values Section */}
        <Typography variant="h5" component="h2" color="text.secondary" paragraph sx={{ mt: 4 }}>
          {t('aboutUsPage.valuesTitle')}
        </Typography>
        {/* 
          The `whiteSpace: 'pre-line'` style is used here to respect newline characters (\n)
          in the translated string. This allows for simple formatting in the JSON files
          without needing complex rendering logic or a markdown parser.
        */}
        <Typography variant="body1" paragraph whiteSpace="pre-line">
          {t('aboutUsPage.valuesText')}
        </Typography>
      </Box>
    </Container>
  );
}
