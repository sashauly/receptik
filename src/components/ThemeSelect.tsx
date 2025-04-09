import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Theme, useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ThemeSelect() {
  const { theme, setTheme, activeTheme } = useTheme();
  const { t } = useTranslation("translation", { keyPrefix: "theme" });

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="theme-options">{t("label")}</Label>
      <Select
        defaultValue={theme}
        onValueChange={(value) => setTheme(value as Theme)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("label")} />
        </SelectTrigger>
        <SelectContent id="theme-options">
          <SelectItem value="system">{`${t("system")} (${t(`${activeTheme}`)})`}</SelectItem>{" "}
          <SelectItem value="light">{t("light")}</SelectItem>
          <SelectItem value="dark">{t("dark")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
