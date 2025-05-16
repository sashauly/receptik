import { importRecipes as performImport } from "@/data/recipeService";
import { logDebug, logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useState } from "react";

export const useImportRecipes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const importRecipesMutation = async (recipesToImport: Recipe[]) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await performImport(recipesToImport);
      setSuccess(true);

      logDebug("Recipes imported successfully!");
    } catch (err) {
      setError(err as Error);
      logError("Error importing recipes:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importRecipes: importRecipesMutation, loading, error, success };
};
