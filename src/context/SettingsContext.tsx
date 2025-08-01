import React, { createContext, useContext, useEffect, useState } from "react";
import { AppSettings, DEFAULT_SETTINGS } from "@/utils/settings/types";
import { localStorageSettings } from "@/utils/settings/storage";

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const storage = localStorageSettings;
const STORAGE_KEY = "settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = storage.getItem<AppSettings>(STORAGE_KEY);
    return savedSettings || DEFAULT_SETTINGS;
  });

  useEffect(() => {
    storage.setItem(STORAGE_KEY, settings);
  }, [settings]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
