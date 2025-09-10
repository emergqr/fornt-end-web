/**
 * @file This file initializes and configures the i18next library for internationalization (i18n).
 * It sets up the translation resources, supported languages, and plugins for language detection.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language constants and translation files.
import { a_languages } from '@/constants/languages';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import pt from '@/locales/pt.json';
import nl from '@/locales/nl.json';

/**
 * The `resources` object maps language codes to their corresponding translation files.
 * This structure is required by i18next to load the translations.
 */
const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
  pt: {
    translation: pt,
  },
  nl: {
    translation: nl,
  },
};

// Extract the language codes from the constants to define the supported languages.
const supportedLngs = a_languages.map((lang) => lang.code);

i18n
  // `LanguageDetector` automatically detects the user's language from various sources.
  .use(LanguageDetector)
  // `initReactI18next` integrates i18next with React, enabling the use of hooks like `useTranslation`.
  .use(initReactI18next)
  // Initialize the i18next instance with the configuration.
  .init({
    resources,
    supportedLngs: supportedLngs,
    fallbackLng: 'en', // The default language to use if the detected language is not supported.
    debug: process.env.NODE_ENV === 'development', // Enable debug logs in the console during development.
    interpolation: {
      // React already protects against XSS, so we can disable this i18next feature.
      escapeValue: false,
    },
    detection: {
      // Defines the order in which to detect the user's language.
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      // Specifies where to cache the detected language.
      caches: ['cookie', 'localStorage'],
    },
  });

export default i18n;
