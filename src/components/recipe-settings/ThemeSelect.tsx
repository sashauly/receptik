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

export default function ThemeSelect() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  const handleThemeChange = (value: string) => {
    updateSettings({ theme: value as Theme });
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="theme-options">{t("theme.label")}</Label>
      <Select value={settings.theme} onValueChange={handleThemeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("theme.label")} />
        </SelectTrigger>
        <SelectContent id="theme-options">
          <SelectItem value="system">{t("theme.system")}</SelectItem>
          <SelectItem value="light">{t("theme.light")}</SelectItem>
          <SelectItem value="dark">{t("theme.dark")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
