import { exportAllRecipesAsJson } from "@/utils/export";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Recipe } from "@/types/recipe";

export const useExportAllRecipes = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAll = (recipes: Recipe[]) => {
    setLoading(true);
    setError(null);
    try {
      exportAllRecipesAsJson(recipes);
      toast.success(t("settings.exportSuccess"));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : t("settings.exportError");
      setError(errorMessage);
      toast.error(t("settings.exportError"));
    } finally {
      setLoading(false);
    }
  };

  return { exportAll, loading, error };
};
