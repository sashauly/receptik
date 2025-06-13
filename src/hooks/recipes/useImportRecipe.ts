import { importRecipes as performImport } from "@/data/recipeService";
import { logDebug, logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const ensureRecipeIds = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      id: ingredient.id || uuidv4(),
    })),
  };
};

export const useImportRecipes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);

  const importRecipesMutation = async (recipesToImport: Recipe[]) => {
    if (!Array.isArray(recipesToImport) || recipesToImport.length === 0) {
      const err = new Error("No recipes provided for import.");
      setError(err);
      logError("No recipes provided for import in useImportRecipes.", err);

      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure all recipes have proper ingredient IDs before import
      const recipesWithIds = recipesToImport.map(ensureRecipeIds);
      await performImport(recipesWithIds);
      setSuccess(true);
      logDebug("Recipes imported successfully!");
    } catch (err) {
      setError(err as Error);
      logError("Error importing recipes in useImportRecipes:", err);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importRecipes: importRecipesMutation, loading, error, success };
};
