'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/store/auth/auth.store';
import { profileService } from '@/services/profileService';
import { recursiveUrlCorrection } from '@/services/api';

export default function ProfileAvatar() {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const updatedUser = await profileService.uploadAvatar(file);
      const correctedUser = recursiveUrlCorrection(updatedUser);
      setUser(correctedUser); // Update the global state with the new user data
    } catch (err: any) {
      setError(err.message || t('dashboard_profile.avatar.uploadError'));
    } finally {
      setIsUploading(false);
    }
  };

  // CORRECTED: Use `avatar_url` (relative path) which is then processed to a full URL.
  // The `user` object in the store should have the corrected URL if `recursiveUrlCorrection` was applied.
  const avatarSrc = user?.avatar_url || '';

  return (
    <Box sx={{ position: 'relative', width: 120, height: 120, margin: 'auto' }}>
      <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
        <Avatar
          src={avatarSrc}
          sx={{ width: 120, height: 120, fontSize: '4rem' }}
        >
          {!avatarSrc && <AccountCircleIcon fontSize="inherit" />}
        </Avatar>
      </IconButton>
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={handleAvatarClick}
      >
        <EditIcon sx={{ color: 'white', p: 0.5 }} />
      </Box>

      {isUploading && (
        <CircularProgress
          size={120}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        accept="image/png, image/jpeg"
      />
      {error && <Typography color="error" variant="caption" sx={{ textAlign: 'center', mt: 1 }}>{error}</Typography>}
    </Box>
  );
}
