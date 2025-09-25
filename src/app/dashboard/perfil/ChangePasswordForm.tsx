'use client';

/**
 * @file A reusable form component for changing the user's password.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import { authService } from '@/services/auth/authService';
import { getApiErrorMessage } from '@/services/apiErrors';

const getPasswordSchema = (t: (key: string) => string) => z.object({
  old_password: z.string().min(6, t('validation.currentPasswordRequired')),
  new_password: z.string().min(6, t('validation.newPasswordMinLength')),
  new_passwordRepeat: z.string().min(6, t('validation.repeatNewPasswordRequired')),
}).refine((data) => data.new_password === data.new_passwordRepeat, {
  message: t('validation.passwordsDoNotMatch'),
  path: ["new_passwordRepeat"],
});

type PasswordFormInputs = z.infer<ReturnType<typeof getPasswordSchema>>;

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChangePasswordForm({ onSuccess, onCancel }: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const [feedback, setFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const passwordSchema = getPasswordSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInputs>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { old_password: '', new_password: '', new_passwordRepeat: '' },
  });

  const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    setFeedback(null);
    try {
      await authService.changePassword(data);
      setFeedback({ type: 'success', message: t('dashboard_profile.change_password.successMessage') });
      reset();
      onSuccess(); // Notify parent component on success
    } catch (error) {
      const message = getApiErrorMessage(error);
      setFeedback({ type: 'error', message });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      {feedback && <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>}
      <Controller name="old_password" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.change_password.form.currentPasswordLabel')} type="password" fullWidth margin="normal" required error={!!errors.old_password} helperText={errors.old_password?.message} autoFocus />} />
      <Controller name="new_password" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.change_password.form.newPasswordLabel')} type="password" fullWidth margin="normal" required error={!!errors.new_password} helperText={errors.new_password?.message} />} />
      <Controller name="new_passwordRepeat" control={control} render={({ field }) => <TextField {...field} label={t('dashboard_profile.change_password.form.repeatNewPasswordLabel')} type="password" fullWidth margin="normal" required error={!!errors.new_passwordRepeat} helperText={errors.new_passwordRepeat?.message} />} />
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('dashboard_profile.change_password.form.submittingButton') : t('dashboard_profile.change_password.form.submitButton')}
        </Button>
      </Box>
    </Box>
  );
}
