'use client';

/**
 * @file This file centralizes the definitions for all languages supported by the application.
 * It provides a single source of truth for language codes, names, and flags, which is used
 * throughout the app, particularly in the language selector UI and i18n configuration.
 */

/**
 * An array of supported language objects.
 * Each object contains the language code (ISO 639-1), its native name, and the path to its flag icon.
 * `as const` is used to treat this array as a readonly tuple, providing strict type safety and enabling
 * type inference for `Language` and `LanguageCode`.
 */
export const a_languages = [
    { code: 'es', name: 'Español', flag: '/flags/1x1/es.svg' },
    { code: 'en', name: 'English', flag: '/flags/1x1/gb.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/1x1/fr.svg' },
    { code: 'pt', name: 'Português', flag: '/flags/1x1/pt.svg' },
    { code: 'nl', name: 'Nederlands', flag: '/flags/1x1/nl.svg' },
] as const;

/**
 * Represents the type of a single language object from the `a_languages` array.
 * This type is derived automatically from the `a_languages` constant for compile-time safety.
 */
export type Language = typeof a_languages[number];

/**
 * Represents the type for a language code (e.g., 'es', 'en').
 * This union type is derived from the `Language` type, ensuring that only valid codes can be used.
 */
export type LanguageCode = Language['code'];
