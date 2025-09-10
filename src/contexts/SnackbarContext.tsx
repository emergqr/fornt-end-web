'use client';

/**
 * @file This file defines the SnackbarContext and SnackbarProvider for displaying global notifications (snackbars).
 * It allows any component to easily trigger a feedback message (e.g., for success or error).
 * NOTE: This file has been refactored to use standard Material-UI components instead of react-native-paper.
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

/**
 * Defines the severity levels for the snackbar, corresponding to Material-UI Alert colors.
 */
type SnackbarSeverity = AlertColor;

/**
 * Defines the shape of the context value that will be exposed to consumers.
 */
interface SnackbarContextType {
    /**
     * Function to trigger the display of a snackbar notification.
     * @param {string} message - The text to be displayed in the snackbar.
     * @param {SnackbarSeverity} [severity='info'] - The type of the snackbar, which affects its color and icon.
     */
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

// Create a React Context to hold the snackbar functionality.
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
    children: ReactNode;
}

/**
 * The provider component that wraps the application to provide global snackbar functionality.
 * It manages the state of the snackbar and renders it when open.
 * @param {SnackbarProviderProps} props - The component props, which include the children to be rendered.
 * @returns {React.ReactElement} The provider component.
 */
export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    // State management for the snackbar's properties.
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<SnackbarSeverity>('info');

    // The function exposed to the rest of the app to show a snackbar.
    // `useCallback` is used to memoize the function, preventing unnecessary re-renders of consumer components.
    const showSnackbar = useCallback((msg: string, sev: SnackbarSeverity = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    // Callback to hide the snackbar.
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // Prevent closing the snackbar on a click away, making it more intentional.
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {/* The Snackbar component from Material-UI, controlled by the provider's state. */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                {/* The Alert component provides the styling (color, icon) for the message. */}
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};