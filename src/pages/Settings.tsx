import ThemeSelect from "@/components/ThemeSelect";
import { Separator } from "@/components/ui/separator";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation("translation", { keyPrefix: "settings" });

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>

      <div className="space-y-4">
        <ThemeSelect />

        <LocaleSwitcher />

        <Separator />

        <p className="text-muted-foreground">{t("stayTuned")}</p>
      </div>
    </div>
  );
}
