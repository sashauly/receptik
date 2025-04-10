import i18n from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEN from "../../public/locales/en/translation.json";
import translationRU from "../../public/locales/ru/translation.json";
// import resources from 'virtual:i18next-loader'


const resources = {
  en: {
    translation: translationEN,
  },
  ru: {
    translation: translationRU,
  },
};

export const supportedLngs = {
  en: "English",
  ru: "Russian",
};

const localStorageKey = "receptik-i18nextLng";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: import.meta.env.DEV ?? true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: localStorageKey,
    },
  });

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(localStorageKey, lng);
});

export default i18n;
