'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from 'react-i18next';

/**
 * ServiciosPage (Services) Component
 *
 * @component
 * @returns {React.ReactElement} The static "Services" page.
 *
 * @description This component displays a list of services offered by the application.
 * It is a client component that uses `react-i18next` to dynamically build the list of services
 * from the translation files, making the content fully internationalized.
 * Material-UI components are used for a clean and structured layout.
 */
export default function ServiciosPage() {
  // Hook to get the translation function `t`.
  const { t } = useTranslation();

  // The list of services is constructed dynamically using translated strings.
  // This approach allows for easy addition or modification of services directly in the translation files.
  const services = [
    { id: 1, title: t('servicesPage.service1_title'), text: t('servicesPage.service1_text') },
    { id: 2, title: t('servicesPage.service2_title'), text: t('servicesPage.service2_text') },
    { id: 3, title: t('servicesPage.service3_title'), text: t('servicesPage.service3_text') },
    { id: 4, title: t('servicesPage.service4_title'), text: t('servicesPage.service4_text') },
    { id: 5, title: t('servicesPage.service5_title'), text: t('servicesPage.service5_text') },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        {/* Page Title */}
        <Typography variant="h3" component="h1" gutterBottom>
          {t('servicesPage.title')}
        </Typography>

        {/* Page Subtitle */}
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('servicesPage.subtitle')}
        </Typography>

        {/* List of Services */}
        <List>
          {/* Maps over the services array to render each service as a ListItem. */}
          {services.map((service) => (
            <ListItem key={service.id}>
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={service.title}
                secondary={service.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}
