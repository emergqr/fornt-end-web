'use client';

import * as React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

/**
 * DashboardLayout Component
 *
 * @component
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @returns {React.ReactElement} A protected layout shell for the dashboard area.
 *
 * @description This layout component acts as a security boundary for all routes within the `/dashboard` path.
 * Its sole responsibility is to wrap its children with the `ProtectedRoute` component, which ensures
 * that only authenticated users can access the nested routes.
 * All visual layout aspects (like AppBar, Drawer, etc.) are now handled by the root `RootLayout`,
 * keeping this layout focused on its role as a route guard.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    // The ProtectedRoute component contains the logic to check for a valid user session.
    // If the user is not authenticated, it will typically redirect them to the login page.
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
