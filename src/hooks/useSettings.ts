import { SettingsContext } from "@/context/SettingsContext";
import { use } from "react";

export function useSettings() {
  const context = use(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
