import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation from './en';
import viTranslation from './vi';

const language = 'vi';
i18n.use(initReactI18next).init({
  debug: process.env.NODE_ENV === 'development',
  compatibilityJSON: 'v3',
  fallbackLng: language,
  lng: language,
  resources: {
    en: {
      translation: enTranslation,
    },
    vi: {
      translation: viTranslation,
    },
  },
  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

export default i18n;
