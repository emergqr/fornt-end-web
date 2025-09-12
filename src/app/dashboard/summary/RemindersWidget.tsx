'use client';

/**
 * @file A widget component to display a list of upcoming reminders.
 */

import * as React from 'react';
import { useRemindersStore } from '@/store/reminders/reminders.store';
import { 
    Box, 
    Paper, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    CircularProgress, 
    Alert 
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import MedicationIcon from '@mui/icons-material/Medication';
import { format } from 'date-fns';

export default function RemindersWidget() {
  const { reminders, loading, error, fetchReminders } = useRemindersStore();

  React.useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upcoming Reminders
      </Typography>
      <Paper sx={{ p: 2 }}>
        {reminders.length > 0 ? (
          <List>
            {reminders.map((reminder) => (
              <ListItem key={reminder.uuid}>
                <ListItemIcon>
                  {reminder.type === 'appointment' ? <EventIcon /> : <MedicationIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={reminder.title}
                  secondary={`${format(new Date(reminder.datetime), 'PPP p')} - ${reminder.details}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            No upcoming reminders.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
