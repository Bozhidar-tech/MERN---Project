import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';
import bgTranslation from './locales/bg/translation.json';
import enTranslation from './locales/en/translation.json';

i18n.use(LanguageDetector).use(initReactI18next).init({
    lng: "bg",
    resources: {
        bg:{
            translation: bgTranslation
        },
        en: {
            translation: enTranslation
        }
    },
    fallbacking : "bg",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;