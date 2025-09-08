// src/constants/languages.ts
export const a_languages = [
    { code: 'es', name: 'Español', flag: '/flags/1x1/es.svg' },
    { code: 'en', name: 'English', flag: '/flags/1x1/gb.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/1x1/fr.svg' },
    { code: 'pt', name: 'Português', flag: '/flags/1x1/pt.svg' },
    { code: 'nl', name: 'Nederlands', flag: '/flags/1x1/nl.svg' }, // <-- Add new language
] as const;


export type Language = typeof a_languages[number];
export type LanguageCode = Language['code'];
