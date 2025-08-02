import { addRecipe as addRecipeService } from "@/data/recipeService";
import { useMutation } from "@/hooks/useMutation";
import { Recipe } from "@/types/recipe";

export const useAddRecipe = (): {
  addRecipe: (recipeData: Omit<Recipe, "id" | "slug" | "createdAt" | "updatedAt">) => Promise<Recipe>;
  addedRecipe: Recipe | undefined;
  isLoading: boolean;
  error: Error | null;
} => {
  const { mutate, isLoading, error, data } = useMutation<
    Recipe,
    Omit<Recipe, "id" | "slug" | "createdAt" | "updatedAt">
  >(addRecipeService);

  return {
    addRecipe: mutate,
    addedRecipe: data,
    isLoading,
    error,
  };
};
