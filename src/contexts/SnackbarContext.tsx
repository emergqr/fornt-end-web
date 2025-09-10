/**
 * @file This file defines the SnackbarContext and SnackbarProvider for displaying global notifications.
 * It allows any component to easily trigger a snackbar message (e.g., for success or error feedback).
 * Note: This implementation uses `react-native-paper`, which is unusual for a web-only project.
 */

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

// Defines the possible types of snackbar notifications.
type SnackbarType = 'success' | 'error' | 'info';

/**
 * Defines the shape of the context value that will be exposed to consumers.
 */
interface SnackbarContextType {
    /**
     * Function to trigger the display of a snackbar notification.
     * @param {string} message - The text to be displayed in the snackbar.
     * @param {SnackbarType} [type='info'] - The type of the snackbar, which affects its color.
     * @param {number} [duration] - The duration in milliseconds for which the snackbar is visible.
     */
    showSnackbar: (message: string, type?: SnackbarType, duration?: number) => void;
}

// Create a React Context to hold the snackbar functionality.
export const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
    children: ReactNode;
}

/**
 * The provider component that wraps the application to provide snackbar functionality.
 * It manages the state of the snackbar and renders it when visible.
 * @param {SnackbarProviderProps} props - The component props.
 * @returns {React.ReactElement} The provider component.
 */
export const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
    // Hook to access the current theme, used for styling.
    const theme = useTheme();

    // State management for the snackbar's properties.
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState(Snackbar.DURATION_SHORT);
    const [type, setType] = useState<SnackbarType>('info');

    // Callback to hide the snackbar.
    const onDismissSnackBar = () => setVisible(false);

    // The function exposed to the rest of the app to show a snackbar.
    // `useCallback` is used to memoize the function, preventing unnecessary re-renders of consumer components.
    const showSnackbar = useCallback((msg: string, snackbarType: SnackbarType = 'info', dur?: number) => {
        setMessage(msg);
        setType(snackbarType);
        setDuration(dur || Snackbar.DURATION_SHORT);
        setVisible(true);
    }, []);

    /**
     * Determines the background color of the snackbar based on its type.
     * @returns {string} The background color hex code.
     */
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#4CAF50'; // Standard green for success
            case 'error':
                return theme.colors.error;
            case 'info':
            default:
                // Default color from the react-native-paper theme.
                return theme.colors.onSurface;
        }
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            {/* The Snackbar component from react-native-paper, controlled by the provider's state. */}
            <Snackbar 
                visible={visible} 
                onDismiss={onDismissSnackBar} 
                duration={duration} 
                style={{ backgroundColor: getBackgroundColor() }}
            >
                {message}
            </Snackbar>
        </SnackbarContext.Provider>
    );
};