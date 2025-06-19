import { deleteAllRecipes } from "@/data/recipeService";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useResetAllData = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetAll = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteAllRecipes();
      toast.success(t("settings.resetSuccess"));
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : t("settings.resetError");
      setError(errorMessage);
      toast.error(t("settings.resetError"));
    } finally {
      setLoading(false);
    }
  };

  return { resetAll, loading, error };
};
