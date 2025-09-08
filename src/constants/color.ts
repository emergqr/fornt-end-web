import { ThemeColors } from '@/interfaces/ThemeColors.interface';

/**
 * Paleta de colores comunes para evitar la repetición.
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
  // Tonos de gris
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
 * Definición del tema claro.
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
 * Definición del tema oscuro.
 */
const dark: ThemeColors = {
  ...light, // Hereda propiedades para no redefinir todo
  primary: commonColors.blueGreen,
  secondary: commonColors.gray400,
  background: commonColors.gray800, // Fondo gris semi-oscuro
  card: commonColors.gray700,     // Tarjetas un poco más claras
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

// --- TEMAS ESTACIONALES ---

const spring: ThemeColors = {
  ...light,
  primary: '#4CAF50',
  secondary: '#FFC107',
  background: '#F1F8E9', // Fondo verde pastel
  text: '#2E7D32',
};

const summer: ThemeColors = {
  ...light,
  primary: '#2196F3',
  secondary: '#FFEB3B',
  background: '#E3F2FD', // Fondo azul pastel
  text: '#1565C0',
};

const autumn: ThemeColors = {
  ...light,
  primary: '#FF5722',
  secondary: '#795548',
  background: '#FFF3E0', // Fondo naranja pastel
  text: '#BF360C',
  card: '#FEFBF8',
};

const winter: ThemeColors = {
  ...dark, // Hereda la base del tema oscuro
  primary: '#607D8B',
  secondary: '#00BCD4',
  background: '#263238', // Fondo gris azulado oscuro
  card: '#37474F',
  text: '#CFD8DC',
  secondaryText: '#90A4AE',
};

export const colors = {
  light,
  dark,
  spring,
  summer,
  autumn,
  winter,
};