'use client';

/**
 * @file A skeleton loader component that mimics the structure of an allergy list item.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';

export default function AllergyListItemSkeleton() {
  return (
    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
      <Box sx={{ width: '100%' }}>
        <Skeleton variant="text" width="50%" height={24} />
        <Skeleton variant="text" width="70%" height={20} />
      </Box>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Skeleton variant="text" width="150px" height={24} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
      </Box>
    </ListItem>
  );
}
