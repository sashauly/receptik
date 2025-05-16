import { updateRecipe } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useState } from "react";

export const useUpdateRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateRecipeMutation = async (
    id: string,
    updates: Omit<Recipe, "dateCreated" | "dateModified">
  ) => {
    try {
      setLoading(true);
      const updatedRecipe = await updateRecipe(id, updates);
      return updatedRecipe;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      logError(`Error updating recipe with ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateRecipe: updateRecipeMutation, loading, error };
};
