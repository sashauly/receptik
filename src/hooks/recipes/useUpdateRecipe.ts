import {
  UpdateArgs,
  updateRecipe as updateRecipeService,
} from "@/data/recipeService";
import { Recipe } from "@/types/recipe";
import { useMutation } from "@/hooks/useMutation";

export const useUpdateRecipe = (): {
  updateRecipe: (args: UpdateArgs) => Promise<Recipe | undefined>;
  updatedRecipe: Recipe | undefined;
  isLoading: boolean;
  error: Error | null;
} => {
  const { mutate, isLoading, error, data } = useMutation<
    Recipe | undefined,
    UpdateArgs
  >(({ id, updates }) => updateRecipeService({ id, updates }));

  return {
    updateRecipe: mutate,
    updatedRecipe: data,
    isLoading,
    error,
  };
};
