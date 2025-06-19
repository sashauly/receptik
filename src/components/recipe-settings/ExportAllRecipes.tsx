import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useExportAllRecipes } from "@/hooks/recipes/useExportAllRecipes";
import { useTranslation } from "react-i18next";
import type { Recipe } from "@/types/recipe";

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      className={"animate-spin h-4 w-4 mr-2 " + (props.className || "")}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

interface ExportAllRecipesProps {
  recipes: Recipe[];
}

export default function ExportAllRecipes({ recipes }: ExportAllRecipesProps) {
  const { t } = useTranslation();
  const { exportAll, loading, error } = useExportAllRecipes();
  const labelId = "export-all-recipes-label";

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
          <SpinnerIcon aria-hidden="true" />
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
