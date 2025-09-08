'use client';

import * as React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * The sole responsibility of the DashboardLayout is now to protect its routes.
 * All visual layout (AppBar, Drawer, content spacing) is handled by the root layout (ThemeRegistry).
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
