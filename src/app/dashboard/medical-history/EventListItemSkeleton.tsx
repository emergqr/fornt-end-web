'use client';

/**
 * @file A skeleton loader component that mimics the structure of a medical history list item.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';

export default function EventListItemSkeleton() {
  return (
    <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: '1px solid #eee', pb: 2, mb: 2 }}>
      <Box sx={{ width: '100%' }}>
        {/* Skeleton for Title and Date */}
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
      {/* Skeleton for Description */}
      <Skeleton variant="text" width="90%" height={20} sx={{ mt: 1 }} />
      {/* Skeleton for Documents section */}
      <Box mt={2} width="100%">
        <Skeleton variant="text" width="120px" height={24} />
        <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
      </Box>
    </ListItem>
  );
}
