import { logError } from "../../lib/utils/logger";
import { SettingsStorage } from "./types";

export class LocalStorageSettings implements SettingsStorage {
  private prefix = "receptik-";

  public getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      return item ? JSON.parse(item) : null;
    } catch (error) {
      logError(`Error reading from localStorage: ${error}`);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (error) {
      logError(`Error writing to localStorage: ${error}`);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      logError(`Error removing from localStorage: ${error}`);
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      logError(`Error clearing localStorage: ${error}`);
    }
  }
}

export const localStorageSettings = new LocalStorageSettings();
