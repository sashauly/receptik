import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  activeTheme: "dark" | "light";
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
  activeTheme: "light",
});

const getSystemTheme = (): "dark" | "light" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: "dark" | "light") => {
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "receptik-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [activeTheme, setActiveTheme] = useState<"dark" | "light">(
    getSystemTheme()
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey);
    let initialTheme: Theme = defaultTheme;
    if (savedTheme && ["dark", "light", "system"].includes(savedTheme)) {
      initialTheme = savedTheme as Theme;
    }

    setTheme(initialTheme);
    localStorage.setItem(storageKey, initialTheme);
  }, [storageKey, defaultTheme]);

  const handleThemeChange = useCallback(() => {
    let newActiveTheme: "dark" | "light";
    if (theme === "system") {
      newActiveTheme = getSystemTheme();
    } else {
      newActiveTheme = theme;
    }
    applyTheme(newActiveTheme);
    setActiveTheme(newActiveTheme);
  }, [theme]);

  useEffect(() => {
    handleThemeChange();
  }, [handleThemeChange]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        handleThemeChange();
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, handleThemeChange]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    activeTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
