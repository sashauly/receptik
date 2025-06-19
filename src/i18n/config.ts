import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import intervalPlural from "i18next-intervalplural-postprocessor";
import resources from "virtual:i18next-loader";
import { localStorageSettings } from "@/lib/settings/storage";
import { AppSettings } from "@/lib/settings/types";

export const defaultNS = "translation";

const customSettingsDetector = {
  name: "customSettingsDetector",
  lookup() {
    const settings = localStorageSettings.getItem<AppSettings>("settings");
    return settings?.language;
  },
  cacheUserLanguage(lng: string) {
    const settings = localStorageSettings.getItem<AppSettings>("settings");
    if (settings) settings.language = lng;
    localStorageSettings.setItem("settings", settings);
  },
};

const languageDetector = new LanguageDetector();
languageDetector.addDetector(customSettingsDetector);

const DETECTION_OPTIONS = {
  order: ["customSettingsDetector", "navigator"],
  caches: ["customSettingsDetector"],
};

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(languageDetector)
  .use(intervalPlural)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    defaultNS,
    load: "languageOnly",
    fallbackLng: "en",
    debug: import.meta.env.DEV ?? true,
    interpolation: {
      escapeValue: false,
    },
    detection: DETECTION_OPTIONS,
  });

export default i18next;
