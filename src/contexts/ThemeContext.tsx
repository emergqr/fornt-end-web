/**
 * @file This file defines the ThemeContext and ThemeProvider for the application.
 * It bridges the Zustand theme store with React's Context API to provide theme-related
 * values and functions to the component tree. It also handles the initial state hydration
 * to prevent UI mismatches on the client.
 */

import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
// Note: The use of react-native components suggests a shared or legacy codebase.
// For a pure web application, these would typically be Material-UI components.
import { ActivityIndicator, View, StyleSheet, SafeAreaView } from 'react-native';
import { useThemeStore } from '@/store/theme/theme.store';
import { colors } from '@/constants/color';
import { ThemeColors } from '@/interfaces/ThemeColors.interface';

/**
 * Defines the shape of the data provided by the ThemeContext.
 */
interface ThemeContextType {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    themeColors: ThemeColors;
}

// Create a React Context for the theme.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Custom hook to easily access the theme context data.
 * Throws an error if used outside of a ThemeProvider to ensure proper usage.
 * @returns {ThemeContextType} The theme context value.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/**
 * Provides the theme context to its children.
 * It handles the asynchronous hydration of the theme state from storage
 * and displays a loading indicator until the state is ready.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {React.ReactElement} The ThemeProvider wrapping the children.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Get theme state and setter from the Zustand store.
    const { theme, setTheme } = useThemeStore();
    // State to track if the Zustand store has finished hydrating from persistent storage.
    const [isHydrated, setHydrated] = useState(false);

    useEffect(() => {
        // The `onFinishHydration` listener is called once the store has been rehydrated.
        const unsubscribe = useThemeStore.persist.onFinishHydration(() => {
            setHydrated(true);
        });

        // If hydration has already completed by the time this component mounts, set the state.
        if (useThemeStore.persist.hasHydrated()) {
            setHydrated(true);
        }

        // Cleanup the subscription when the component unmounts.
        return () => {
            unsubscribe();
        };
    }, []);

    // Memoize the theme colors object to prevent recalculation on every render.
    const themeColors = useMemo(() => colors[theme], [theme]);

    // While the store is hydrating, display a loading screen.
    // This prevents a flash of un-styled content or a hydration mismatch error.
    if (!isHydrated) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color={colors.light.primary} />
                </View>
            </SafeAreaView>
        );
    }

    // Once hydrated, provide the theme values to the rest of the application.
    return (
        <ThemeContext.Provider value={{ theme, setTheme, themeColors}}>{children}</ThemeContext.Provider>
    );
};

// Styles for the loading container, using React Native's StyleSheet.
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    loadingContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
