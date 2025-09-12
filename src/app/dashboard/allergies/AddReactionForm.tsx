'use client';

/**
 * @file A reusable form component for adding a reaction history to an allergy.
 */

import * as React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ReactionHistoryCreate } from '@/interfaces/client/allergy.interface';

// Zod schema for reaction form validation
const getReactionSchema = (t: (key: string) => string) => z.object({
  reaction_date: z.string().min(1, { message: 'Reaction date is required' }),
  symptoms: z.string().min(3, { message: 'Symptoms are required' }),
});

type ReactionFormInputs = z.infer<ReturnType<typeof getReactionSchema>>;

interface AddReactionFormProps {
  onSubmit: (data: ReactionHistoryCreate) => Promise<void>;
  onCancel: () => void;
}

export default function AddReactionForm({ onSubmit, onCancel }: AddReactionFormProps) {
  const { t } = useTranslation();
  const reactionSchema = getReactionSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReactionFormInputs>({
    resolver: zodResolver(reactionSchema),
    defaultValues: { reaction_date: '', symptoms: '' },
  });

  const handleFormSubmit: SubmitHandler<ReactionFormInputs> = async (data) => {
    await onSubmit(data);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Controller
        name="reaction_date"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Date of Reaction"
            type="date"
            fullWidth
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
            error={!!errors.reaction_date}
            helperText={errors.reaction_date?.message}
          />
        )}
      />
      <Controller
        name="symptoms"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Symptoms"
            fullWidth
            margin="normal"
            required
            multiline
            rows={3}
            error={!!errors.symptoms}
            helperText={errors.symptoms?.message}
          />
        )}
      />
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Reaction'}
        </Button>
      </Box>
    </Box>
  );
}
