import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en/translation.json';
import rwTranslation from '../locales/rw/translation.json';
import frTranslation from '../locales/fr/translation.json';
import swTranslation from '../locales/sw/translation.json';

const resources = {
  en: { translation: enTranslation },
  rw: { translation: rwTranslation },
  fr: { translation: frTranslation },
  sw: { translation: swTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;
