'use client';

/**
 * @file A widget component to display a summary of key health metrics.
 */

import * as React from 'react';
import { useSummaryStore } from '@/store/summary/summary.store';
import {
  Box,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function SummaryWidget() {
  const { summary, loading, error, fetchSummary } = useSummaryStore();

  React.useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!summary) {
    return null;
  }

  // Dynamically create grid items from the summary object
  const summaryItems = Object.entries(summary).map(([key, value]) => (
    <Grid item xs={6} sm={4} md={3} key={key}>
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="p" color="primary">
          {String(value)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {key.replace(/_/g, ' ').toUpperCase()}
        </Typography>
      </Paper>
    </Grid>
  ));

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Health Summary
      </Typography>
      <Grid container spacing={2}>
        {summaryItems}
      </Grid>
    </Box>
  );
}
