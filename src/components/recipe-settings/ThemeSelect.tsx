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
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor="theme-options">{t("theme.label")}</Label>
      <Select
        defaultValue={theme}
        onValueChange={(value) => setTheme(value as Theme)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("theme.label")} />
        </SelectTrigger>
        <SelectContent id="theme-options">
          <SelectItem value="system">{t("theme.system")}</SelectItem>{" "}
          <SelectItem value="light">{t("theme.light")}</SelectItem>
          <SelectItem value="dark">{t("theme.dark")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
