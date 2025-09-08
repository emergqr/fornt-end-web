'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

// Recharts components for charts
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import all the necessary stores
import { useAuthStore } from '@/store/auth/auth.store';
import { useAllergyStore } from '@/store/allergy/allergy.store';
import { useDiseaseStore } from '@/store/disease/disease.store';
import { useVitalSignStore } from '@/store/vital-sign/vital-sign.store';
import { useMedicationStore } from '@/store/medication/medication.store';
import { useDateFilterStore } from '@/store/date-filter/date-filter.store';

// Import date-fns for date manipulation
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

// A simple widget component for displaying summary data
function SummaryWidget({ title, value, loading }: { title: string; value: React.ReactNode; loading: boolean }) {
  return (
    <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      <Typography variant="h4" component="p" sx={{ mt: 1 }}>
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>
    </Paper>
  );
}

// Date Filter Component
function DateFilter() {
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
          <Typography variant="h6">Filtrar por Fecha</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Desde"
            type="date"
            value={format(startDate, 'yyyy-MM-dd')}
            onChange={handleStartDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Hasta"
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

// Vital Signs Chart Component
function VitalSignsChart({ data, loading }: { data: any[]; loading: boolean }) {
  const chartData = React.useMemo(() => {
    const groupedByDate = data.reduce((acc, vs) => {
      const date = format(parseISO(vs.measured_at), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { date };
      }
      const typeKey = vs.type.split(' ')[0];
      acc[date][typeKey] = vs.value;
      return acc;
    }, {} as { [key: string]: any });

    return Object.values(groupedByDate).sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  const lineKeys = React.useMemo(() => {
    if (chartData.length === 0) return [];
    return Object.keys(chartData[0]).filter(key => key !== 'date');
  }, [chartData]);

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>Registros Vitales</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>
      ) : chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Typography>No hay datos en el rango seleccionado.</Typography></Box>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineKeys.map((key, i) => (
              <Line key={key} type="monotone" dataKey={key} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} connectNulls />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

// Medications Chart Component
function MedicationsChart({ data, loading }: { data: any[]; loading: boolean }) {
  const { startDate, endDate } = useDateFilterStore();

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0 || !startDate || !endDate) return [];

    const interval = { start: startDate, end: endDate };
    const daysInInterval = eachDayOfInterval(interval);

    return daysInInterval.map(day => {
      const activeCount = data.filter(s => {
        // Guard against schedules with no start date
        if (!s.startDate) return false;
        const scheduleStart = startOfDay(parseISO(s.startDate));
        const scheduleEnd = s.endDate ? endOfDay(parseISO(s.endDate)) : new Date(8640000000000000);
        return scheduleStart <= day && scheduleEnd >= day;
      }).length;

      return {
        date: format(day, 'yyyy-MM-dd'),
        'Medicamentos Activos': activeCount,
      };
    });
  }, [data, startDate, endDate]);

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>Medicamentos Activos por Día</Typography>
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
            <Bar dataKey="Medicamentos Activos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}

export default function DashboardSummaryPage() {
  const { user } = useAuthStore();
  const { allergies, loading: allergiesLoading, fetchMyAllergies } = useAllergyStore();
  const { diseases, loading: diseasesLoading, fetchMyDiseases } = useDiseaseStore();
  const { vitalSigns, loading: vitalSignsLoading, fetchMyVitalSigns } = useVitalSignStore();
  const { schedules, loading: medicationsLoading, fetchSchedules } = useMedicationStore();
  const { startDate, endDate } = useDateFilterStore();

  React.useEffect(() => {
    fetchMyAllergies();
    fetchMyDiseases();
    fetchMyVitalSigns();
    fetchSchedules();
  }, [fetchMyAllergies, fetchMyDiseases, fetchMyVitalSigns, fetchSchedules]);

  const filteredVitalSigns = React.useMemo(() => {
    return vitalSigns.filter(vs => 
      isWithinInterval(parseISO(vs.measured_at), { start: startDate, end: endDate })
    );
  }, [vitalSigns, startDate, endDate]);

  const filteredSchedules = React.useMemo(() => {
    return schedules.filter(s => {
      // Guard against schedules with no start date to prevent crashes
      if (!s.startDate) {
        return false;
      }
      const scheduleStart = startOfDay(parseISO(s.startDate));
      const scheduleEnd = s.endDate ? endOfDay(parseISO(s.endDate)) : new Date(8640000000000000);
      return scheduleStart <= endDate && scheduleEnd >= startDate;
    });
  }, [schedules, startDate, endDate]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        ¡Hola, {user?.name || 'Usuario'}!
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Aquí tienes un resumen de tu perfil de salud.
      </Typography>

      <DateFilter />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <VitalSignsChart data={filteredVitalSigns} loading={vitalSignsLoading} />
        </Grid>
        <Grid item xs={12}>
          <MedicationsChart data={filteredSchedules} loading={medicationsLoading} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SummaryWidget title="Alergias" value={allergies.length} loading={allergiesLoading} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <SummaryWidget title="Condiciones Médicas" value={diseases.length} loading={diseasesLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
