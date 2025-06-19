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
import { Globe } from "lucide-react";

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

  const labelId = "locale-options-label";

  return (
    <div
      className="flex items-center justify-between space-x-2"
      role="group"
      aria-labelledby={labelId}
    >
      <Label
        htmlFor="locale-options"
        id={labelId}
        className="text-sm font-medium"
      >
        <Globe className="h-4 w-4 mr-2" aria-hidden="true" />
        {t("language.label")}
      </Label>

      <Select
        value={i18n.resolvedLanguage}
        onValueChange={handleLanguageChange}
        name="language"
        aria-labelledby={labelId}
      >
        <SelectTrigger
          id="locale-options"
          className="w-[200px]"
          aria-label={t("language.label")}
        >
          <SelectValue placeholder={t("language.label")} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(supportedLngs).map(([code, name]) => (
            <SelectItem value={code} key={code}>
              <span className="font-medium">{code.toUpperCase()}</span>
              <span className="text-muted-foreground">{name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
