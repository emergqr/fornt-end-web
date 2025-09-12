'use client';

/**
 * @file A widget to display menstrual cycle predictions.
 */

import * as React from 'react';
import { useMenstrualCycleStore } from '@/store/menstrual-cycle/menstrual-cycle.store';
import { Box, Paper, Typography, Grid, CircularProgress, Alert, Chip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsightsIcon from '@mui/icons-material/Insights';

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  return format(parseISO(dateString), 'PPP');
};

export default function PredictionWidget() {
  const { prediction, predictionLoading, predictionError, fetchPrediction } = useMenstrualCycleStore();

  React.useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  if (predictionLoading) {
    return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />;
  }

  if (predictionError) {
    return <Alert severity="error">{predictionError}</Alert>;
  }

  if (!prediction) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 4, backgroundColor: 'primary.lighter' }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Cycle Predictions
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
            <CalendarMonthIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1">Next Period</Typography>
            <Typography variant="h6">{formatDate(prediction.predicted_next_period_start)}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
            <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1">Fertile Window</Typography>
            <Typography variant="h6">{`${formatDate(prediction.predicted_fertile_window_start)} - ${formatDate(prediction.predicted_fertile_window_end)}`}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
            <InsightsIcon color="action" sx={{ fontSize: 40 }} />
            <Typography variant="subtitle1">Prediction Confidence</Typography>
            <Chip label={prediction.confidence} color={prediction.confidence === 'Alta' ? 'success' : (prediction.confidence === 'Media' ? 'warning' : 'default')} sx={{ mt: 1 }} />
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
}
