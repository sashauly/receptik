import ThemeSelect from "@/components/ThemeSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRecipes } from "@/hooks/useRecipes";
import LocaleSwitcher from "@/i18n/LocaleSwitcher";
import { exportAllRecipesAsJson } from "@/lib/utils/export";
import { Download } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { recipes } = useRecipes();
  const { t } = useTranslation();

  const onExportAllAsJson = () => {
    try {
      exportAllRecipesAsJson(recipes);
      // TODO add toast
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setErrorMessage(err);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">
        {t("settings.title")}
      </h2>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="space-y-4">
        <ThemeSelect />

        <LocaleSwitcher />

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("share.exportAllRecipes")}</h3>
          <Button
            onClick={onExportAllAsJson}
            variant="outline"
            className="w-full"
          >
            <Download className="h-4 w-4" />
            {t("share.exportAllAsJson")}
          </Button>
        </div>

        <p className="text-muted-foreground">{t("settings.stayTuned")}</p>
      </div>
    </div>
  );
}
