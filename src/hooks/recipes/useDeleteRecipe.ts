import { deleteRecipe } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { useState } from "react";

export const useDeleteRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteRecipeMutation = async (id: string) => {
    try {
      setLoading(true);
      await deleteRecipe(id);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Unknown error occurred")
      );
      logError(`Error deleting recipe with ID ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecipe: deleteRecipeMutation, loading, error };
};
