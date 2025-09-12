'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

// Recharts components for creating charts
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import all the necessary Zustand stores for state management
import { useAuthStore } from '@/store/auth/auth.store';
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store';
import { useMedicationStore } from '@/store/medication/medication.store';
import { useDateFilterStore } from '@/store/date-filter/date-filter.store';

// Import the new widgets
import SummaryWidget from './summary/SummaryWidget';
import RemindersWidget from './summary/RemindersWidget';

// Import date-fns for robust date manipulation and formatting
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

/**
 * A component for filtering data within a date range.
 * @returns {React.ReactElement}
 */
function DateFilter() {
  const { t } = useTranslation();
  const { startDate, endDate, setStartDate, setEndDate } = useDateFilterStore();

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseISO(e.target.value);
    setStartDate(startOfDay(date));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseISO(e.target.value);
    setEndDate(endOfDay(date));
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Typography variant="h6">{t('dashboard_summary.dateFilterTitle')}</Typography>
        </Grid>
        <Grid item>
          <TextField
            label={t('dashboard_summary.dateFilterFrom')}
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            label={t('dashboard_summary.dateFilterTo')}
            type="date"
            value={format(endDate, 'yyyy-MM-dd')}
            onChange={handleEndDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

/**
 * A line chart to visualize vital sign records over time.
 * @param {{ data: any[]; loading: boolean }} props
 * @returns {React.ReactElement}
 */
function VitalSignsChart({ data, loading }: { data: any[]; loading: boolean }) {
  const { t } = useTranslation();

  const chartData = React.useMemo(() => {
    const groupedByDate = data.reduce((acc, vs) => {
      const date = format(parseISO(vs.measured_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date };
      }
      const typeKey = vs.type.split(' ')[0];
      acc[date][typeKey] = vs.value_numeric;
      return acc;
    }, {} as { [key: string]: any });

    return Object.values(groupedByDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const lineKeys = React.useMemo(() => {
    if (chartData.length === 0) return [];
    return Object.keys(chartData[0]).filter(key => key !== 'date');
  }, [chartData]);

  return (
    <Paper sx={{ p: 2, height: 300, mt: 4 }}>
      <Typography variant="h6" gutterBottom>{t('dashboard_summary.vitalsChartTitle')}</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
      ) : chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>{t('dashboard_summary.chartNoData')}</Typography></Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineKeys.map((key) => (
              <Line key={key} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

/**
 * A bar chart to visualize the number of active medications per day.
 * @param {{ data: any[]; loading: boolean }} props
 * @returns {React.ReactElement}
 */
function MedicationsChart({ data, loading }: { data: any[]; loading: boolean }) {
  const { t } = useTranslation();
  const { startDate, endDate } = useDateFilterStore();

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0 || !startDate || !endDate) return [];

    const interval = { start: startDate, end: endDate };
    const daysInInterval = eachDayOfInterval(interval);

    return daysInInterval.map(day => {
      const activeCount = data.filter(s => {
        if (!s.start_date) return false;
        const scheduleStart = startOfDay(parseISO(s.start_date));
        const scheduleEnd = s.end_date ? endOfDay(parseISO(s.end_date)) : new Date(8640000000000000);
        return scheduleStart <= day && scheduleEnd >= day;
      }).length;

      return {
        date: format(day, 'yyyy-MM-dd'),
        [t('dashboard_summary.widgetMedsTitle')]: activeCount,
      };
    });
  }, [data, startDate, endDate, t]);

  return (
    <Paper sx={{ p: 2, height: 300, mt: 4 }}>
      <Typography variant="h6" gutterBottom>{t('dashboard_summary.medsChartTitle')}</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey={t('dashboard_summary.widgetMedsTitle')} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

/**
 * The main component for the dashboard summary page.
 * @returns {React.ReactElement}
 */
export default function DashboardSummaryPage() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { vitalSigns, loading: vitalSignsLoading, fetchMyVitalSigns } = useVitalSignStore();
  const { schedules, loading: medicationsLoading, fetchSchedules } = useMedicationStore();
  const { startDate, endDate } = useDateFilterStore();

  React.useEffect(() => {
    fetchMyVitalSigns();
    fetchSchedules();
  }, [fetchMyVitalSigns, fetchSchedules]);

  const filteredVitalSigns = React.useMemo(() => {
    return vitalSigns.filter(vs => 
      isWithinInterval(parseISO(vs.measured_at), { start: startDate, end: endDate })
    );
  }, [vitalSigns, startDate, endDate]);

  const filteredSchedules = React.useMemo(() => {
    return schedules.filter(s => {
      if (!s.start_date) return false;
      const scheduleStart = startOfDay(parseISO(s.start_date));
      const scheduleEnd = s.end_date ? endOfDay(parseISO(s.end_date)) : new Date(8640000000000000);
      return scheduleStart <= endDate && scheduleEnd >= startDate;
    });
  }, [schedules, startDate, endDate]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard_summary.greeting', { name: user?.name || t('dashboard.defaultUser') })}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {t('dashboard_summary.subtitle')}
      </Typography>

      <DateFilter />

      {/* New Dynamic Widgets */}
      <SummaryWidget />
      <RemindersWidget />

      {/* Existing Charts */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <VitalSignsChart data={filteredVitalSigns} loading={vitalSignsLoading} />
        </Grid>
        <Grid item xs={12}>
          <MedicationsChart data={filteredSchedules} loading={medicationsLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
