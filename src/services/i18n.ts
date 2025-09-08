import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translations and language definitions
import { a_languages } from '@/constants/languages';
import en from '@/locales/en.json';
import es from '@/locales/es.json';
import fr from '@/locales/fr.json';
import pt from '@/locales/pt.json';
import nl from '@/locales/nl.json'; // <-- Import Dutch

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
    translation: nl, // <-- Add Dutch to resources
  },
};

const supportedLngs = a_languages.map((lang) => lang.code);

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // Init i18next
  .init({
    resources,
    supportedLngs: supportedLngs,
    fallbackLng: 'en', // Fallback language if the user's language is not available
    debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      // Order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie', 'localStorage'], // Where to cache the detected language
    },
  });

export default i18n;
