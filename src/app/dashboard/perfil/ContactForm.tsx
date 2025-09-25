'use client';

/**
 * @file A reusable form component for creating and editing contacts within the profile page.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ContactCreate, ContactUpdate } from '@/interfaces/client/contact.interface';

const getContactSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation.nameRequired') }),
  email: z.string().email({ message: t('validation.emailInvalid') }),
  phone: z.string().min(7, { message: t('validation.phoneRequired') }),
  relationship_type: z.string().min(3, { message: t('validation.relationshipRequired') }),
  is_emergency_contact: z.boolean(),
});

type ContactFormInputs = z.infer<ReturnType<typeof getContactSchema>>;

interface ContactFormProps {
  onSubmit: (data: ContactCreate | ContactUpdate) => Promise<void>;
  onCancel: () => void;
  initialData?: ContactFormInputs | null;
}

export default function ContactForm({ onSubmit, onCancel, initialData }: ContactFormProps) {
  const { t } = useTranslation();
  const contactSchema = getContactSchema(t);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || { name: '', email: '', phone: '', relationship_type: '', is_emergency_contact: true },
  });

  React.useEffect(() => {
    reset(initialData || { name: '', email: '', phone: '', relationship_type: '', is_emergency_contact: true });
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller name="name" control={control} render={({ field }) => <TextField {...field} label={t('contacts.form.nameLabel')} fullWidth margin="normal" required error={!!errors.name} helperText={errors.name?.message} autoFocus />} />
      <Controller name="email" control={control} render={({ field }) => <TextField {...field} label={t('contacts.form.emailLabel')} type="email" fullWidth margin="normal" required error={!!errors.email} helperText={errors.email?.message} />} />
      <Controller name="phone" control={control} render={({ field }) => <TextField {...field} label={t('contacts.form.phoneLabel')} fullWidth margin="normal" required error={!!errors.phone} helperText={errors.phone?.message} />} />
      <Controller name="relationship_type" control={control} render={({ field }) => <TextField {...field} label={t('contacts.form.relationshipLabel')} fullWidth margin="normal" required error={!!errors.relationship_type} helperText={errors.relationship_type?.message} />} />
      <Controller name="is_emergency_contact" control={control} render={({ field }) => <FormControlLabel control={<Checkbox {...field} checked={!!field.value} />} label={t('contacts.form.isEmergencyContactLabel')} />} />
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">{t('common.cancel')}</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? t('common.saving') : t('common.saveChanges')}
        </Button>
      </Box>
    </Box>
  );
}
