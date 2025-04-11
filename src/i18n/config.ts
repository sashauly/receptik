import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import intervalPlural from "i18next-intervalplural-postprocessor";

const localStorageKey = "receptik-i18nextLng";

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "locales/{{lng}}/{{ns}}.json",
    },
    debug: import.meta.env.DEV ?? true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: localStorageKey,
    },
  });

i18next.on("languageChanged", (lng) => {
  localStorage.setItem(localStorageKey, lng);
});

export default i18next;
