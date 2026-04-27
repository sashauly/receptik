import { createContext } from "react";
import type { AppSettings } from "@/utils/settings/types";
import { localStorageSettings } from "@/utils/settings/storage";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const storage = localStorageSettings;
export const STORAGE_KEY = "settings";
