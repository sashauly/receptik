import { deleteRecipe as deleteRecipeService } from "@/data/recipeService";
import { useMutation } from "@/hooks/useMutation";
import { Recipe } from "@/types/recipe";

export const useDeleteRecipe = (): {
  deleteRecipe: (id: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
} => {
  const { mutate, isLoading, error } = useMutation<void, Recipe["id"]>(
    deleteRecipeService
  );

  return {
    deleteRecipe: mutate,
    isLoading,
    error,
  };
};
