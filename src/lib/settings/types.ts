export type Theme = "light" | "dark" | "system";
export type ViewMode = "grid" | "list";

export interface AppSettings {
  theme: Theme;
  language: string;
  notifications: boolean;
  viewMode: ViewMode;
}

export interface SettingsStorage {
  getItem<T>(key: string): T | null;
  setItem<T>(key: string, value: T): void;
  removeItem(key: string): void;
  clear(): void;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  language: "en",
  notifications: false,
  viewMode: "grid",
};
