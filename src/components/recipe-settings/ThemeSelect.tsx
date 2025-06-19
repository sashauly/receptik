import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";
import { Theme } from "@/lib/settings/types";
import { Moon, Sun, Monitor, Brush } from "lucide-react";

export default function ThemeSelect() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  const handleThemeChange = (value: string) => {
    updateSettings({ theme: value as Theme });
  };

  const themeOptions = [
    { value: "system", label: t("theme.system"), icon: Monitor },
    { value: "light", label: t("theme.light"), icon: Sun },
    { value: "dark", label: t("theme.dark"), icon: Moon },
  ];

  const labelId = "theme-options-label";

  return (
    <div
      className="flex items-center justify-between space-x-2"
      role="group"
      aria-labelledby={labelId}
    >
      <Label
        htmlFor="theme-options"
        id={labelId}
        className="text-sm font-medium"
      >
        <Brush className="w-4 h-4 mr-2" />
        {t("theme.label")}
      </Label>
      <Select
        value={settings.theme}
        onValueChange={handleThemeChange}
        name="theme"
        aria-labelledby={labelId}
      >
        <SelectTrigger
          id="theme-options"
          className="w-[200px]"
          aria-label={t("theme.label")}
        >
          <SelectValue placeholder={t("theme.label")} />
        </SelectTrigger>
        <SelectContent>
          {themeOptions.map(({ value, label, icon: Icon }) => (
            <SelectItem
              key={value}
              value={value}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
