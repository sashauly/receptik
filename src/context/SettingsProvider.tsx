import type { AppSettings } from "@/utils/settings/types";
import { DEFAULT_SETTINGS } from "@/utils/settings/types";
import React, { useEffect, useState } from "react";
import { SettingsContext, storage, STORAGE_KEY } from "./SettingsContext";

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
    <SettingsContext value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext>
  );
}
