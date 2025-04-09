import { useTranslation } from "react-i18next";
import { supportedLngs } from "./config";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocaleSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="locale-options">{t("language.label")}</Label>

      <Select
        value={i18n.resolvedLanguage}
        onValueChange={(value) => i18n.changeLanguage(value)}
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
