'use client';

import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';
import { VitalSignRead } from '@/interfaces/client/vital-sign.interface';

interface VitalSignsChartProps {
  data: VitalSignRead[];
}

export default function VitalSignsChart({ data }: VitalSignsChartProps) {
  // We need to process the data to be in a format that Recharts can understand.
  // We will group the data by vital sign type.
  const chartData = data.reduce((acc, sign) => {
    const date = new Date(sign.measured_at).toLocaleDateString();
    let entry = acc.find(item => item.date === date);
    if (!entry) {
      entry = { date };
      acc.push(entry);
    }
    // We use value_numeric for the chart. We can enhance this later.
    entry[sign.type] = sign.value_numeric;
    return acc;
  }, [] as any[]);

  // Get all unique vital sign types to create a line for each one.
  const vitalSignTypes = [...new Set(data.map(item => item.type))];
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  if (data.length === 0) {
    return null; // Don't render the chart if there is no data
  }

  return (
    <Paper sx={{ p: 2, mb: 4, height: 400 }}>
      <Typography variant="h6" gutterBottom>Evolución de Signos Vitales</Typography>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {vitalSignTypes.map((type, index) => (
            <Line 
              key={type as string}
              type="monotone" 
              dataKey={type as string} 
              stroke={colors[index % colors.length]} 
              activeDot={{ r: 8 }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
