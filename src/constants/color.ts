import { ThemeColors } from '@/interfaces/ThemeColors.interface';

/**
 * @file This file defines the color palettes for all supported themes in the application.
 * It establishes a consistent and centralized color system.
 */

/**
 * A collection of common, reusable colors to maintain consistency across themes.
 * This avoids magic strings and makes it easy to update a color in one place.
 */
const commonColors = {
  white: '#FFFFFF',
  black: '#000000',
  blueGreen: '#5d979e',
  red: '#d9534f',
  softRed: '#dd7272',
  darkSoftRed: '#4d2222',
  green: '#5cb85c',
  surfGreen: '#3f673f',
  surfOrange: '#f59e0b',
  // Grayscale palette
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
};

/**
 * Defines the color palette for the standard light theme.
 */
const light: ThemeColors = {
  surface: commonColors.surfOrange,
  primary: commonColors.blueGreen,
  primaryText: commonColors.white,
  secondary: commonColors.gray500,
  background: commonColors.gray50,
  card: commonColors.white,
  text: commonColors.gray900,
  secondaryText: commonColors.gray500,
  onSurfaceVariant: commonColors.gray500,
  border: commonColors.gray200,
  success: commonColors.green,
  alert: commonColors.red,
  alertSoft: commonColors.softRed,
  disabled: commonColors.gray200,
  inputBackground: commonColors.white,
  placeholder: commonColors.gray400,
  neutral: commonColors.gray100,
  tabIconDefault: '#ccc',
  tabIconSelected: commonColors.blueGreen,
};

/**
 * Defines the color palette for the standard dark theme.
 * It inherits from the light theme and overrides specific colors for a dark appearance.
 */
const dark: ThemeColors = {
  ...light, // Inherit from the light theme to avoid redefining all colors.
  primary: commonColors.blueGreen,
  secondary: commonColors.gray400,
  background: commonColors.gray800,
  card: commonColors.gray700,
  text: commonColors.gray50,
  secondaryText: commonColors.gray400,
  onSurfaceVariant: commonColors.gray400,
  border: commonColors.gray700,
  alertSoft: commonColors.darkSoftRed,
  disabled: commonColors.gray700,
  inputBackground: commonColors.gray700,
  placeholder: commonColors.gray500,
  neutral: commonColors.gray800,
};

// --- SEASONAL THEMES ---

/**
 * Defines the color palette for the Spring theme.
 * Inherits from the light theme with a fresh, green-dominant palette.
 */
const spring: ThemeColors = {
  ...light,
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F1F8E9',
  text: '#2E7D32',
};

/**
 * Defines the color palette for the Summer theme.
 * Inherits from the light theme with a bright, blue-dominant palette.
 */
const summer: ThemeColors = {
  ...light,
  primary: '#2196F3',
  secondary: '#FFEB3B',
  background: '#E3F2FD',
  text: '#1565C0',
};

/**
 * Defines the color palette for the Autumn theme.
 * Inherits from the light theme with a warm, orange-dominant palette.
 */
const autumn: ThemeColors = {
  ...light,
  primary: '#FF5722',
  secondary: '#795548',
  background: '#FFF3E0',
  text: '#BF360C',
  card: '#FEFBF8',
};

/**
 * Defines the color palette for the Winter theme.
 * Inherits from the dark theme with a cool, blue-gray palette.
 */
const winter: ThemeColors = {
  ...dark, // Inherits from the dark theme for a darker base.
  primary: '#607D8B',
  secondary: '#00BCD4',
  background: '#263238',
  card: '#37474F',
  text: '#CFD8DC',
  secondaryText: '#90A4AE',
};

/**
 * A collection of all theme palettes, keyed by their respective mode names.
 * This object is used by the ThemeRegistry to select the appropriate theme.
 */
export const colors = {
  light,
  dark,
  spring,
  summer,
  autumn,
  winter,
};