import { deleteRecipe as deleteRecipeService } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { useState } from "react";

export const useDeleteRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRecipe = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRecipeService(id);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete recipe")
      );
      logError(`Error deleting recipe ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecipe, loading, error };
};
