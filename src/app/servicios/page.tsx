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

export default function ServiciosPage() {
  const { t } = useTranslation();

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
        <Typography variant="h3" component="h1" gutterBottom>
          {t('servicesPage.title')}
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          {t('servicesPage.subtitle')}
        </Typography>
        <List>
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
