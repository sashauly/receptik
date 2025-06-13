import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";

export default function LocaleSwitcher() {
  const { i18n, t } = useTranslation();
  const { updateSettings } = useSettings();

  const supportedLngs = t("language.supported", { returnObjects: true });

  useEffect(() => {
    document.documentElement.setAttribute("lang", i18n.language);
    document.title = t("common.appName");
  }, [t, i18n.language]);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    updateSettings({ language: value });
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="locale-options">{t("language.label")}</Label>

      <Select
        value={i18n.resolvedLanguage}
        onValueChange={handleLanguageChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("language.label")} />
        </SelectTrigger>
        <SelectContent id="locale-options">
          {Object.entries(supportedLngs).map(([code, name]) => (
            <SelectItem value={code} key={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
