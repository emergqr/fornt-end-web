/**
 * @file This file defines the `useSnackbar` custom hook, providing a simple and safe way
 * to access the SnackbarContext from any component.
 */

import { useContext } from 'react';
import { SnackbarContext } from '@/contexts/SnackbarContext';

/**
 * A custom hook that provides easy access to the snackbar context.
 * It abstracts the `useContext` call and includes a runtime check to ensure
 * it is used within a `SnackbarProvider`.
 * 
 * @throws {Error} If the hook is used outside of a SnackbarProvider, 
 * ensuring that the context is always available when the hook is called.
 * @returns The snackbar context, which includes the `showSnackbar` function.
 */
export const useSnackbar = () => {
    // Access the context value.
    const context = useContext(SnackbarContext);

    // If the context is undefined, it means the hook is not being used within a SnackbarProvider.
    // Throw an error to alert the developer to this mistake.
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }

    // Return the context, providing access to `showSnackbar`.
    return context;
};