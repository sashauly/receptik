import { useSettings } from "@/hooks/useSettings";
import React, { useEffect } from "react";
import type { Theme } from "./ThemeContext";
import { applyTheme, getSystemTheme, ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, updateSettings } = useSettings();
  const theme = settings.theme;
  const activeTheme = theme === "system" ? getSystemTheme() : theme;

  const setTheme = (newTheme: Theme) => {
    updateSettings({ theme: newTheme });
  };

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <ThemeContext value={{ theme, activeTheme, setTheme }}>
      {children}
    </ThemeContext>
  );
}
