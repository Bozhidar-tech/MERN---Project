import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import bgTranslation from './locales/bg/translation.json';
import enTranslation from './locales/en/translation.json';
import frTranslation from './locales/fr/translation.json';
import deTranslation from './locales/de/translation.json';


i18n.use(LanguageDetector).use(initReactI18next).init({
    resources: {
        bg:{
            translation: bgTranslation
        },
        en: {
            translation: enTranslation
        },
        fr: {
            translation: frTranslation
        },
        de: {
            translation: deTranslation
        }
    },
    fallbacking : "bg",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;