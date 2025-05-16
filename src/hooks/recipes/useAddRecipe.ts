import { addRecipe } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useState } from "react";

export const useAddRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addRecipeMutation = async (
    recipeData: Omit<Recipe, "id" | "slug" | "dateCreated" | "dateModified">
  ) => {
    try {
      setLoading(true);
      const addedRecipe = await addRecipe(recipeData);
      return addedRecipe;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      logError("Error adding recipe:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addRecipe: addRecipeMutation, loading, error };
};
