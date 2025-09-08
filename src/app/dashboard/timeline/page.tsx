'use client';

import * as React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

// Icons for different event types
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'; // Alergia
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';   // Enfermedad
import VaccinesIcon from '@mui/icons-material/Vaccines';             // Medicamento
import ArticleIcon from '@mui/icons-material/Article';               // Evento Médico

import { useTimelineStore } from '@/store/timeline/timeline.store';
import { TimelineItemRead } from '@/interfaces/client/medical-history.interface';

// Helper to get icon based on event type
const getIconForEventType = (type: TimelineItemRead['type']) => {
  switch (type) {
    case 'allergy':
      return <MedicalInformationIcon sx={{ color: '#d32f2f' }} />;
    case 'disease':
      return <HealthAndSafetyIcon sx={{ color: '#f57c00' }} />;
    case 'medication':
      return <VaccinesIcon sx={{ color: '#512da8' }} />;
    case 'event':
      return <ArticleIcon sx={{ color: '#757575' }} />;
    default:
      return <ArticleIcon sx={{ color: '#757575' }} />;
  }
};

export default function TimelinePage() {
  const {
    timeline,
    loading,
    error,
    fetchTimeline,
  } = useTimelineStore();

  React.useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Línea de Tiempo Médica
      </Typography>
      
      {timeline.length === 0 ? (
        <Typography sx={{ mt: 4, textAlign: 'center' }}>
          No hay eventos en tu historial médico para mostrar.
        </Typography>
      ) : (
        <Timeline position="alternate">
          {timeline.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                sx={{ m: 'auto 0' }}
                align="right"
                variant="body2"
                color="text.secondary"
              >
                {new Date(item.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot color="primary" variant="outlined">
                  {getIconForEventType(item.type)}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="h6" component="h2">
                    {item.title}
                  </Typography>
                  <Typography>{item.details}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </Paper>
  );
}
