'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import { profileService } from '@/services/profileService'; 
import { PublicProfileResponse } from '@/interfaces/client/client-full-profile.interface';

function InfoWidget({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="h6" component="p">{value}</Typography>
    </Paper>
  );
}

export default function PublicProfilePage({ params }: { params: { uuid: string } }) {
  const { t } = useTranslation();
  const { uuid } = params;
  const [profile, setProfile] = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uuid) {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const data = await profileService.getPublicProfile(uuid);
          setProfile(data);
        } catch (err: any) {
          setError(err.message || t('public_profile.fetchError'));
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [uuid, t]);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Container><Alert severity="error" sx={{ mt: 4 }}>{error}</Alert></Container>;
  }

  if (!profile) {
    return <Container><Alert severity="info" sx={{ mt: 4 }}>{t('public_profile.notAvailable')}</Alert></Container>;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('public_profile.title')}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/* --- Basic Info --- */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}><InfoWidget label={t('public_profile.nameLabel')} value={profile.client.name} /></Grid>
          <Grid item xs={12} sm={6}><InfoWidget label={t('public_profile.ageLabel')} value={profile.client.age} /></Grid>
          <Grid item xs={12} sm={6}><InfoWidget label={t('public_profile.bloodTypeLabel')} value={profile.blood_type} /></Grid>
          <Grid item xs={12} sm={6}><InfoWidget label={t('public_profile.healthInsuranceLabel')} value={profile.social_security_health_system} /></Grid>
        </Grid>

        {/* --- Critical Sections --- */}
        <Box mb={3}>
          <Typography variant="h5" color="error">{t('public_profile.allergiesTitle')}</Typography>
          {profile.allergies.length > 0 ? (
            <List>{profile.allergies.map(a => <ListItem key={a.uuid}><ListItemText primary={a.allergen} secondary={`${t('public_profile.severityLabel')}: ${a.severity}`} /></ListItem>)}</List>
          ) : <Typography>{t('public_profile.noAllergies')}</Typography>}
        </Box>

        <Box mb={3}>
          <Typography variant="h5">{t('public_profile.conditionsTitle')}</Typography>
          {profile.patient_diseases.length > 0 ? (
            <List>{profile.patient_diseases.map(d => <ListItem key={d.uuid}><ListItemText primary={d.disease.name} secondary={`${t('public_profile.diagnosedLabel')}: ${new Date(d.diagnosis_date).toLocaleDateString()}`} /></ListItem>)}</List>
          ) : <Typography>{t('public_profile.noConditions')}</Typography>}
        </Box>

        <Box mb={3}>
          <Typography variant="h5">{t('public_profile.contactsTitle')}</Typography>
          {profile.emergency_contacts.length > 0 ? (
            <List>{profile.emergency_contacts.map(c => <ListItem key={c.uuid}><ListItemText primary={c.name} secondary={`${c.relationship_type}: ${c.phone}`} /></ListItem>)}</List>
          ) : <Typography>{t('public_profile.noContacts')}</Typography>}
        </Box>

      </Paper>
    </Container>
  );
}
