import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExportAllRecipes } from "@/hooks/useExportAllRecipes";
import { useTranslation } from "react-i18next";
import type { Recipe } from "@/types/recipe";
import { Spinner } from "../ui/spinner";

interface ExportAllRecipesProps {
  recipes: Recipe[] | null | undefined;
}

export default function ExportAllRecipes({ recipes }: ExportAllRecipesProps) {
  const { t } = useTranslation();
  const { exportAll, loading, error } = useExportAllRecipes();
  const labelId = "export-all-recipes-label";

  if (recipes === null) {
    return <p className="text-destructive">{t("settings.exportError")}</p>;
  }

  if (recipes === undefined) {
    return <p className="text-muted-foreground">{t("common.loading")}</p>;
  }

  return (
    <div
      className="flex items-center justify-between gap-2"
      role="group"
      aria-labelledby={labelId}
    >
      <div className="flex flex-col gap-1">
        <h3 id={labelId} className="text-sm font-medium mb-2">
          {t("share.exportAllRecipes")}
        </h3>
        <p
          id="export-all-recipes-desc"
          className="text-muted-foreground text-sm"
        >
          {t("settings.exportAllRecipesDesc")}
        </p>
      </div>
      <Button
        onClick={() => exportAll(recipes)}
        variant="outline"
        className="cursor-pointer"
        aria-label={t("share.exportAllAsJson")}
        aria-describedby="export-all-recipes-desc"
        aria-busy={loading}
        disabled={loading}
      >
        {loading ? (
          <Spinner>{t("common.loading")}</Spinner>
        ) : (
          <Download className="h-4 w-4" aria-hidden="true" />
        )}
        {t("share.exportAllAsJson")}
      </Button>
      {error && (
        <div
          role="alert"
          className="text-destructive ml-2"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
    </div>
  );
}
