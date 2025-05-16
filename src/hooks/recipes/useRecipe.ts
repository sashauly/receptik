import { getRecipeById, getRecipeBySlug } from "@/data/recipeService";
import { logError } from "@/lib/utils/logger";
import { Recipe } from "@/types/recipe";
import { useEffect, useState } from "react";

export const useRecipe = ({ id, slug }: { id?: string; slug?: string }) => {
  const [recipe, setRecipe] = useState<Recipe | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only proceed if either ID or slug is provided
    if (!id && !slug) {
      setRecipe(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedRecipe: Recipe | undefined;

        if (id) {
          fetchedRecipe = await getRecipeById(id);
        } else if (slug) {
          fetchedRecipe = await getRecipeBySlug(slug);
        }

        setRecipe(fetchedRecipe);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred")
        );
        logError(
          `Error fetching recipe with ${id ? "ID " + id : "slug " + slug}:`,
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, slug]);

  return { recipe, loading, error, setRecipe };
};
