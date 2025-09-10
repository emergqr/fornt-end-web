/**
 * @file This file defines the structure for a theme's color palette.
 * It ensures consistency across all supported themes (e.g., light, dark, seasonal)
 * by providing a standard set of color properties that each theme must implement.
 */

export interface ThemeColors {
  // --- Base Colors ---
  primary: string; // Main color for interactive elements like buttons, links, and active items.
  primaryText: string; // Text color used on top of the primary color (typically white or black).
  secondary: string; // Secondary color for less prominent elements.
  background: string; // Main background color for screens.
  card: string; // Background color for cards and elevated surfaces.
  text: string; // Main text color.
  secondaryText: string; // Color for secondary text, subtitles, and descriptions.
  onSurfaceVariant: string; // Medium-emphasis text on surfaces (e.g., form labels).
  border: string; // Color for borders and dividers.

  // --- State Colors ---
  success: string; // Indicates success (e.g., notifications, validation).
  alert: string; // Indicates danger or error (e.g., alerts, invalid fields).
  alertSoft: string; // A soft background for alerts to be less jarring.
  disabled: string; // Color for disabled elements (buttons, inputs).

  // --- Specific UI Colors ---
  inputBackground: string; // Specific background for text input fields.
  placeholder: string; // Color for placeholder text in inputs.
  neutral: string; // Neutral color for badges or informational elements.
  tabIconDefault: string; // Color for unselected tab icons.
  tabIconSelected: string; // Color for the active tab icon.

  // --- Chart & Surface Colors ---
  surface: string; // A surface color, often used in charts or other specific components.
}
